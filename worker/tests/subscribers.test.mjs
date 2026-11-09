// Offline test suite for the briefing-subscription endpoints.
// Runs the real worker handlers (src/index.js) under Node with mocked KV / Brevo.
// Same pattern as tests.js: named imports, direct handler calls.
// Usage: node tests/subscribers.test.mjs

import assert from 'node:assert/strict';
import * as W from '../src/index.js';

const {
    handleSubscribe, handleSubscribeConfirm, handleSubscribeUnsubscribe,
    handleDigestSend, handleSubscriberList, handleSubscriberSetStatus, renderDigestEmail, subGenToken, SUB_EMAIL_RE,
} = W;
for (const [n, f] of Object.entries({
    handleSubscribe, handleSubscribeConfirm, handleSubscribeUnsubscribe, handleDigestSend,
    handleSubscriberList, handleSubscriberSetStatus, renderDigestEmail,
})) assert.equal(typeof f, 'function', 'export present: ' + n);

// ---------------------------------------------------------------- mocks ---
// SUBSCRIBERS KV mock: stores objects, speaks JSON on get/put like real KV.
function makeSubscribers(initial = []) {
    const store = new Map();
    for (const r of initial) store.set(r.email, { ...r });
    return {
        store,
        async get(k) { const v = store.get(k); return v === undefined ? null : JSON.stringify(v); },
        async put(k, v) { store.set(k, JSON.parse(v)); },
        async list() { return { keys: [...store.keys()].map((name) => ({ name })) }; },
    };
}

function makeKV(initial = {}) {
    const store = new Map(Object.entries(initial));
    return {
        async get(k) { return store.has(k) ? store.get(k) : null; },
        async put(k, v) { store.set(k, v); },
        store,
    };
}

// Brevo interceptor: record calls, always 200 (unless brevoFail)
const brevoCalls = [];
let brevoFail = false;
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
    if (String(url).includes('api.brevo.com')) {
        brevoCalls.push({ url: String(url), options });
        if (brevoFail) return { ok: false, status: 500, text: async () => 'brevo down' };
        return { ok: true, status: 200, text: async () => JSON.stringify({ message: 'ok' }) };
    }
    return realFetch(url, options);
};

// ------------------------------------------------------------------ env ---
const BRIEFING = {
    date: '2026-10-22',
    high_priority: [
        { title: 'Zero-day exploited in field gateway <script>alert(1)</script>', summary: 'Actively exploited; patch now.' },
    ],
    watch: [{ title: 'Supply-chain advisory', summary: 'Vendor update expected.' }],
    general: [{ title: 'General item' }],
    published_at: '2026-10-22T20:15:00Z',
    critical_count: 1, watch_count: 1, general_count: 1,
};

function makeEnv(initialSubs = []) {
    return {
        SUBSCRIBERS: makeSubscribers(initialSubs),
        RATE_LIMIT: makeKV(),
        BRIEFINGS: makeKV({
            briefings_index: JSON.stringify([{
                date: BRIEFING.date,
                critical_count: 1, watch_count: 1, general_count: 1,
            }]),
            [BRIEFING.date]: JSON.stringify(BRIEFING),
        }),
        BREVO_API_KEY: 'test-brevo-key',
        DIGEST_SEND_KEY: 'test-digest-key',
    };
}

const BASE = 'https://www.apposight.com';
function mkRequest(method, path, { body, headers = {} } = {}) {
    return new Request(BASE + path, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', ...headers },
    });
}
const subUrl = (p) => new URL(BASE + p);

// ---------------------------------------------------------------- tests ---
let passed = 0;
async function t(name, fn) {
    try { await fn(); passed += 1; console.log('  ok  ' + name); }
    catch (e) { console.error('FAIL  ' + name + '\n      ' + (e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n      ') : e)); process.exitCode = 1; }
}

console.log('subscribers.test.mjs');

await t('token: 48 hex chars', () => {
    assert.match(subGenToken(), /^[a-f0-9]{48}$/);
    assert.notEqual(subGenToken(), subGenToken());
});

await t('email regex: rejects junk, accepts valid', () => {
    assert.ok(SUB_EMAIL_RE.test('stan@apposight.com'));
    assert.ok(!SUB_EMAIL_RE.test('nope'));
    assert.ok(!SUB_EMAIL_RE.test('@x.com'));
    assert.ok(!SUB_EMAIL_RE.test('a@b'));
    assert.ok(!SUB_EMAIL_RE.test('a b@c.com'));
});

await t('subscribe: valid email -> pending row + confirmation email with personal link', async () => {
    brevoCalls.length = 0;
    const env = makeEnv();
    const res = await handleSubscribe(mkRequest('POST', '/api/subscribe', {
        body: { email: 'Stan.Example@Example.com ' },
        headers: { Origin: 'https://www.apposight.com' },
    }), env, subUrl('/api/subscribe'));
    assert.equal(res.status, 200);
    const d = await res.json();
    assert.ok(d.ok);
    const row = env.SUBSCRIBERS.store.get('stan.example@example.com'); // lowercased
    assert.ok(row, 'row stored under lowercased email');
    assert.equal(row.status, 'pending');
    assert.match(row.token, /^[a-f0-9]{48}$/);
    assert.equal(brevoCalls.length, 1, 'one confirmation email');
    const payload = JSON.parse(brevoCalls[0].options.body);
    assert.equal(payload.sender.email, 'stanley@apposight.com');
    assert.equal(payload.to[0].email, 'stan.example@example.com');
    const link = 'https://www.apposight.com/subscribe/confirm?token=' + row.token;
    assert.ok(payload.htmlContent.includes(link), 'html has personal confirm link');
    assert.ok(payload.textContent.includes(link), 'text has confirm link');
});

await t('subscribe: invalid email -> 400, no email sent', async () => {
    brevoCalls.length = 0;
    const env = makeEnv();
    const res = await handleSubscribe(mkRequest('POST', '/api/subscribe', { body: { email: 'not-an-email' } }), env, subUrl('/api/subscribe'));
    assert.equal(res.status, 400);
    assert.equal(brevoCalls.length, 0);
    assert.equal(env.SUBSCRIBERS.store.size, 0);
});

await t('subscribe: hostile Origin -> 403', async () => {
    const env = makeEnv();
    const res = await handleSubscribe(mkRequest('POST', '/api/subscribe', {
        body: { email: 'x@y.com' },
        headers: { Origin: 'https://evil.example' },
    }), env, subUrl('/api/subscribe'));
    assert.equal(res.status, 403);
});

await t('subscribe: already-active -> ok, no duplicate email', async () => {
    brevoCalls.length = 0;
    const env = makeEnv([{ email: 'a@b.com', token: 'tok-existing', status: 'active', created_at: 'x', updated_at: 'x' }]);
    const res = await handleSubscribe(mkRequest('POST', '/api/subscribe', { body: { email: 'a@b.com' } }), env, subUrl('/api/subscribe'));
    assert.equal(res.status, 200);
    const d = await res.json();
    assert.ok(d.ok);
    assert.match(d.message, /already subscribed/i);
    assert.equal(brevoCalls.length, 0, 'no duplicate confirmation email');
});

await t('confirm: bad token -> expired page', async () => {
    const env = makeEnv();
    const res = await handleSubscribeConfirm(subUrl('/subscribe/confirm?token=zzzz'), env);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Link expired or invalid/);
});

await t('confirm: valid token -> active + success page', async () => {
    const tok = subGenToken();
    const env = makeEnv([{ email: 'c@d.com', token: tok, status: 'pending', created_at: 'x', updated_at: 'x' }]);
    const res = await handleSubscribeConfirm(subUrl('/subscribe/confirm?token=' + tok), env);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /subscribed/);
    assert.equal(env.SUBSCRIBERS.store.get('c@d.com').status, 'active');
});

await t('unsubscribe: valid token -> unsubscribed', async () => {
    const tok = subGenToken();
    const env = makeEnv([{ email: 'u@v.com', token: tok, status: 'active', created_at: 'x', updated_at: 'x' }]);
    const res = await handleSubscribeUnsubscribe(subUrl('/subscribe/unsubscribe?token=' + tok), env);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /unsubscribed/);
    assert.equal(env.SUBSCRIBERS.store.get('u@v.com').status, 'unsubscribed');
});

await t('unsubscribe: bad token -> expired page, row untouched', async () => {
    const env = makeEnv([{ email: 'u@v.com', token: subGenToken(), status: 'active', created_at: 'x', updated_at: 'x' }]);
    const res = await handleSubscribeUnsubscribe(subUrl('/subscribe/unsubscribe?token=deadbeef'), env);
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Link expired or invalid/);
    assert.equal(env.SUBSCRIBERS.store.get('u@v.com').status, 'active');
});

await t('digest: wrong key -> 401', async () => {
    const env = makeEnv();
    const res = await handleDigestSend(mkRequest('POST', '/api/digest/send', {
        headers: { Authorization: 'Bearer wrong-key' },
    }), env);
    assert.equal(res.status, 401);
});

await t('digest: no subscribers -> ok, total 0, no emails', async () => {
    brevoCalls.length = 0;
    const env = makeEnv();
    const res = await handleDigestSend(mkRequest('POST', '/api/digest/send', {
        headers: { Authorization: 'Bearer test-digest-key' },
    }), env);
    assert.equal(res.status, 200);
    const d = await res.json();
    assert.equal(d.ok, true);
    assert.equal(d.total, 0);
    assert.equal(brevoCalls.length, 0);
});

await t('digest: 2 active + 1 pending -> exactly 2 emails, personal unsubscribe links, full content', async () => {
    brevoCalls.length = 0;
    const tokA = subGenToken(), tokB = subGenToken(), tokP = subGenToken();
    const env = makeEnv([
        { email: 'alpha@corp.com', token: tokA, status: 'active', created_at: '2026-01-01', updated_at: '2026-01-01' },
        { email: 'beta@corp.com', token: tokB, status: 'active', created_at: '2026-01-02', updated_at: '2026-01-02' },
        { email: 'pending@corp.com', token: tokP, status: 'pending', created_at: '2026-01-03', updated_at: '2026-01-03' },
    ]);
    const res = await handleDigestSend(mkRequest('POST', '/api/digest/send', {
        headers: { Authorization: 'Bearer test-digest-key' },
    }), env);
    assert.equal(res.status, 200);
    const d = await res.json();
    assert.equal(d.ok, true);
    assert.equal(d.total, 2);
    assert.equal(d.sent, 2);
    assert.equal(d.failed, 0);
    assert.equal(brevoCalls.length, 2);
    const byEmail = {};
    for (const c of brevoCalls) byEmail[JSON.parse(c.options.body).to[0].email] = JSON.parse(c.options.body);
    assert.ok(byEmail['alpha@corp.com'] && byEmail['beta@corp.com']);
    for (const [email, payload] of Object.entries(byEmail)) {
        assert.match(payload.subject, /Daily Cybersecurity Briefing/);
        const html = payload.htmlContent;
        assert.ok(html.includes('Zero-day exploited'), 'full briefing content present');
        assert.ok(html.includes('Supply-chain advisory'), 'watch item present');
        assert.ok(html.includes('General item'), 'general item present');
        assert.ok(html.includes('High Priority'), 'section label');
        assert.ok(html.includes('&lt;script&gt;'), 'XSS payload escaped');
        assert.ok(!/<script/i.test(html), 'no raw script tag from content');
        const mine = email === 'alpha@corp.com' ? tokA : tokB;
        assert.ok(html.includes('/subscribe/unsubscribe?token=' + mine), 'personal unsubscribe link');
        assert.ok(!html.includes(mine === tokA ? tokB : tokA), 'no foreign token leaked');
        assert.ok(html.includes('https://www.apposight.com/briefings'), 'archive link');
        assert.ok(payload.textContent.length > 50, 'text version present');
    }
});

await t('digest: Brevo outage -> honest failed count, ok=false', async () => {
    brevoFail = true;
    try {
        brevoCalls.length = 0;
        const tokA = subGenToken();
        const env = makeEnv([{ email: 'alpha@corp.com', token: tokA, status: 'active', created_at: 'x', updated_at: 'x' }]);
        const res = await handleDigestSend(mkRequest('POST', '/api/digest/send', {
            headers: { Authorization: 'Bearer test-digest-key' },
        }), env);
        assert.equal(res.status, 200);
        const d = await res.json();
        assert.equal(d.ok, false);
        assert.equal(d.sent, 0);
        assert.equal(d.failed, 1);
    } finally { brevoFail = false; }
});

await t('subscribe: Brevo outage -> 502, row stays pending (retryable)', async () => {
    brevoFail = true;
    try {
        brevoCalls.length = 0;
        const env = makeEnv();
        const res = await handleSubscribe(mkRequest('POST', '/api/subscribe', {
            body: { email: 'retry@me.com' },
        }), env, subUrl('/api/subscribe'));
        assert.equal(res.status, 502);
        assert.equal(env.SUBSCRIBERS.store.get('retry@me.com').status, 'pending', 'row kept for retry');
    } finally { brevoFail = false; }
});

await t('rate limit: 11th subscribe from same IP -> 429', async () => {
    brevoCalls.length = 0;
    const env = makeEnv();
    let last;
    for (let i = 1; i <= 11; i++) {
        last = await handleSubscribe(mkRequest('POST', '/api/subscribe', {
            body: { email: 'user' + i + '@rate.test' },
            headers: { 'cf-connecting-ip': '203.0.113.7' },
        }), env, subUrl('/api/subscribe'));
    }
    assert.equal(last.status, 429);
    assert.equal(brevoCalls.length, 10, 'exactly 10 emails sent before the cap');
});

await t('renderDigestEmail: subject + date label', () => {
    const { subject, html } = renderDigestEmail(BRIEFING);
    assert.match(subject, /Daily Cybersecurity Briefing — Thursday, October 22/);
    assert.ok(html.includes('Thursday, October 22'));
});

await t('subscriber list: bearer key returns all rows sorted by email', async () => {
    const env = makeEnv([
        { email: 'zeta@later.com', token: 't1', status: 'active', created_at: '2026-10-22T00:00:00Z', updated_at: '2026-10-22T01:00:00Z' },
        { email: 'alpha@first.com', token: 't2', status: 'pending', created_at: '2026-10-21T00:00:00Z', updated_at: '2026-10-21T02:00:00Z' },
        { email: 'gone@bye.com', token: 't3', status: 'unsubscribed', created_at: '2026-10-20T00:00:00Z', updated_at: '2026-10-20T03:00:00Z' },
    ]);
    const res = await handleSubscriberList(
        mkRequest('GET', '/api/digest/subscribers', { headers: { authorization: 'Bearer test-digest-key' } }),
        env);
    assert.equal(res.status, 200);
    const d = JSON.parse(await res.text());
    assert.equal(d.ok, true);
    assert.equal(d.total, 3);
    assert.deepEqual(d.subscribers.map((s) => s.email), ['alpha@first.com', 'gone@bye.com', 'zeta@later.com'], 'sorted by email');
    assert.equal(d.subscribers[0].status, 'pending');
    assert.equal(d.subscribers[2].status, 'active');
    assert.ok(!JSON.stringify(d).match(/t1|t2|t3/), 'tokens never exposed');
});

await t('subscriber list: wrong key -> 401', async () => {
    const env = makeEnv();
    const res = await handleSubscriberList(
        mkRequest('GET', '/api/digest/subscribers', { headers: { authorization: 'Bearer wrong-key' } }),
        env);
    assert.equal(res.status, 401);
});

await t('subscriber list: missing DIGEST_SEND_KEY -> 503', async () => {
    const env = makeEnv();
    delete env.DIGEST_SEND_KEY;
    const res = await handleSubscriberList(mkRequest('GET', '/api/digest/subscribers', {}), env);
    assert.equal(res.status, 503);
});

await t('set-status: bearer key flips status and reports before/after', async () => {
    const env = makeEnv([
        { email: 'leave@me.com', token: 't9', status: 'active', created_at: '2026-10-22T00:00:00Z', updated_at: '2026-10-22T01:00:00Z' },
    ]);
    const res = await handleSubscriberSetStatus(mkRequest('POST', '/api/digest/set-status', {
        headers: { authorization: 'Bearer test-digest-key' },
        body: { email: 'Leave@Me.com', status: 'unsubscribed' },
    }), env);
    assert.equal(res.status, 200);
    const d = JSON.parse(await res.text());
    assert.equal(d.ok, true);
    assert.equal(d.found, true);
    assert.equal(d.before, 'active');
    assert.equal(d.after, 'unsubscribed');
    assert.equal(env.SUBSCRIBERS.store.get('leave@me.com').status, 'unsubscribed', 'KV row flipped');
});

await t('set-status: wrong key -> 401; unknown email -> found:false; bad status -> 400', async () => {
    const env = makeEnv();
    const bad = await handleSubscriberSetStatus(mkRequest('POST', '/api/digest/set-status', {
        headers: { authorization: 'Bearer wrong-key' },
        body: { email: 'a@b.com', status: 'unsubscribed' },
    }), env);
    assert.equal(bad.status, 401);
    const missing = await handleSubscriberSetStatus(mkRequest('POST', '/api/digest/set-status', {
        headers: { authorization: 'Bearer test-digest-key' },
        body: { email: 'nobody@here.com', status: 'unsubscribed' },
    }), env);
    assert.equal(missing.status, 200);
    assert.equal((await missing.json()).found, false);
    const badStatus = await handleSubscriberSetStatus(mkRequest('POST', '/api/digest/set-status', {
        headers: { authorization: 'Bearer test-digest-key' },
        body: { email: 'a@b.com', status: 'superadmin' },
    }), env);
    assert.equal(badStatus.status, 400);
});

console.log(passed + ' tests' + (process.exitCode ? ' (FAILURES)' : ' — all passed'));
