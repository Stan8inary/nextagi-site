// worker/tests.js — contact-form hardening tests (Brevo status, timeout, PII log, origin, KV-fail)
// Run: node tests.js   (no Workers runtime needed; module is plain ESM)
import * as W from './src/index.js';

let passed = 0, failed = 0;
function ok(name, cond, detail) {
  if (cond) { passed++; console.log(`PASS ${name}`); }
  else { failed++; console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); }
}
function makeKV() {
  const store = {};
  return {
    store,
    put(k, v) { store[k] = v; return Promise.resolve(); },
    get(k) { return Promise.resolve(store[k] ?? null); },
    del(k) { delete store[k]; return Promise.resolve(); },
  };
}
function rejectKV() {
  return { store: {}, put: () => Promise.reject(new Error('kv down')), get: () => Promise.reject(new Error('kv down')), del: () => Promise.resolve() };
}
function makeReq(body, headers = {}) {
  return new Request('https://www.apposight.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}
const BASE_ENV = { BREVO_API_KEY: 'test-key', RATE_LIMIT: null };
function withFetch(impl, fn) {
  const orig = globalThis.fetch;
  globalThis.fetch = impl;
  return Promise.resolve().then(fn).finally(() => { globalThis.fetch = orig; });
}
function captureConsole() {
  const logs = [];
  const olog = console.log, oerr = console.error, owarn = console.warn;
  console.log = (...a) => logs.push(['log', a.join(' ')]);
  console.error = (...a) => logs.push(['error', a.join(' ')]);
  console.warn = (...a) => logs.push(['warn', a.join(' ')]);
  return () => { console.log = olog; console.error = oerr; console.warn = owarn; return logs; };
}
const BODY = { name: 'T', email: 't@example.com', message: 'm', phone: '' };
const url = new URL('https://www.apposight.com/api/contact');

async function main() {
  // ---- B1: Brevo 4xx → visitor still 200, email_sent=false, status logged (code only)
  await withFetch(async () => new Response('{}', { status: 403 }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv });
    const body = await res.json();
    const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
    const logs = restore();
    const hasStatus = logs.some(l => /status=403/.test(l[1]));
    const noBody = !logs.some(l => /\{\}/.test(l[1]));
    ok('B1 brevo-4xx-visitor-200', res.status === 200 && body.success === true, `got ${res.status}`);
    ok('B1 brevo-4xx-email_sent-false', rec.email_sent === false, JSON.stringify(rec.email_status));
    ok('B1 brevo-4xx-status-logged', hasStatus && noBody);
  });

  // ---- B2: Brevo 5xx → visitor 200, email_sent=false, status=500 logged
  await withFetch(async () => new Response('boom', { status: 500 }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv });
    const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
    const logs = restore();
    ok('B2 brevo-5xx-visitor-200', res.status === 200, `got ${res.status}`);
    ok('B2 brevo-5xx-email_sent-false', rec.email_sent === false && rec.email_status.notif === 500, JSON.stringify(rec.email_status));
    ok('B2 brevo-5xx-status-logged', logs.some(l => /status=500/.test(l[1])));
  });

  // ---- B3: timeout (abort) → visitor 200, email_sent=false, status=timeout logged, fetch actually aborted
  await withFetch(async (u, o) => new Promise((resolve, reject) => {
    o.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const t0 = Date.now();
    const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv });
    const elapsed = Date.now() - t0;
    const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
    const logs = restore();
    ok('B3 timeout-visitor-200', res.status === 200, `got ${res.status}`);
    ok('B3 timeout-email_sent-false', rec.email_sent === false && rec.email_status.notif === 'timeout', JSON.stringify(rec.email_status));
    ok('B3 timeout-logged', logs.some(l => /status=timeout/.test(l[1])));
    ok('B3 timeout-bounded-8s', elapsed < 8000, `${elapsed}ms (parallel: worst case ~5s cap)`);
  });

  // ---- B4: happy path → 200, email_sent=true (Brevo returns 201 in practice)
  await withFetch(async () => new Response('{}', { status: 201 }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv });
    const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
    const logs = restore();
    ok('B4 happy-200', res.status === 200, `got ${res.status}`);
    ok('B4 happy-email_sent-true', rec.email_sent === true && rec.email_status.notif === 201 && rec.email_status.reply === 201, JSON.stringify(rec.email_status));
    ok('B4 happy-no-error-logs', !logs.some(l => l[0] === 'error'));
  });

  // ---- B6: full Brevo status matrix (each code => email_sent true/false as spec)
  const MATRIX = [
    { code: 200, sent: true }, { code: 201, sent: true }, { code: 202, sent: true },
    { code: 400, sent: false }, { code: 401, sent: false }, { code: 403, sent: false },
    { code: 429, sent: false }, { code: 500, sent: false }, { code: 503, sent: false },
  ];
  for (const m of MATRIX) {
    await withFetch(async () => new Response('{}', { status: m.code }), async () => {
      const kv = makeKV();
      const restore = captureConsole();
      const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv });
      const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
      const logs = restore();
      ok(`B6 matrix-${m.code}-visitor-200`, res.status === 200, `got ${res.status}`);
      ok(`B6 matrix-${m.code}-email_sent=${m.sent ? 'true' : 'false'}`, rec.email_sent === m.sent, JSON.stringify(rec.email_status));
      ok(`B6 matrix-${m.code}-status-logged`, logs.some(l => new RegExp('status=' + m.code).test(l[1])));
    });
  }

  // ---- B5: no BREVO_API_KEY → skipped, visitor 200, email_sent=false
  await withFetch(async () => new Response('{}', { status: 200 }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const res = await W.handleContactForm(makeReq(BODY), { RATE_LIMIT: null, CONTACT_FORMS: kv });
    const rec = JSON.parse(kv.store[Object.keys(kv.store).find(k => k !== 'submissions_list')]);
    const logs = restore();
    ok('B5 nokey-200-skipped', res.status === 200 && rec.email_sent === false && rec.email_status.notif === 'skipped', `got ${res.status} ${JSON.stringify(rec.email_status)}`);
    ok('B5 nokey-warn-logged', logs.some(l => /BREVO_API_KEY not set/.test(l[1])));
  });

  // ---- P1: PII must not appear in any console output
  await withFetch(async () => new Response('{}', { status: 202 }), async () => {
    const kv = makeKV();
    const restore = captureConsole();
    const pii = { name: 'ZoeQx', email: 'zoeqx@example.com' };
    await W.handleContactForm(makeReq({ ...BODY, name: pii.name, email: pii.email }), { ...BASE_ENV, CONTACT_FORMS: kv });
    const logs = restore();
    const leaked = logs.some(l => l[1].includes(pii.name) || l[1].includes(pii.email));
    ok('P1 no-pii-in-logs', !leaked, 'name/email found in console output');
  });

  // ---- O1: origin checks (Option B)
  ok('O1 allow-same-origin', W.isAllowedContactOrigin(makeReq(BODY, { Origin: 'https://www.apposight.com' }), url) === true);
  ok('O1 allow-bare-origin', W.isAllowedContactOrigin(makeReq(BODY, { Origin: 'https://apposight.com' }), url) === true);
  ok('O1 reject-evil-origin', W.isAllowedContactOrigin(makeReq(BODY, { Origin: 'https://evil.example' }), url) === false);
  ok('O1 reject-suffix-trick-origin', W.isAllowedContactOrigin(makeReq(BODY, { Origin: 'https://apposight.com.evil.example' }), url) === false);
  ok('O1 no-origin-allowed-referer', W.isAllowedContactOrigin(makeReq(BODY, { Referer: 'https://www.apposight.com/#c' }), url) === true);
  ok('O1 no-origin-foreign-referer-403', W.isAllowedContactOrigin(makeReq(BODY, { Referer: 'https://evil.example/c' }), url) === false);
  ok('O1 neither-header-allow', W.isAllowedContactOrigin(makeReq(BODY), url) === true);
  ok('O1 no-origin-foreign-referer-suffix', W.isAllowedContactOrigin(makeReq(BODY, { Referer: 'https://apposight.com.evil.example/' }), url) === false);

  // ---- K1: rejecting KV put → 500 (record never claimed stored)
  await withFetch(async () => new Response('{}', { status: 201 }), async () => {
    const res = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: rejectKV() });
    ok('K1 kv-reject-500', res.status === 500, `got ${res.status}`);
  });

  // ---- R1: rate limit → 11th request 429
  {
    const kv = makeKV();
    let last;
    for (let i = 0; i < 11; i++) {
      last = await W.handleContactForm(makeReq(BODY), { ...BASE_ENV, CONTACT_FORMS: kv, RATE_LIMIT: kv });
    }
    ok('R1 rate-limit-429', last.status === 429, `got ${last.status}`);
  }

  // ---- T1: fetchWithTimeout returns null on abort
  await withFetch(async (u, o) => new Promise((resolve, reject) => {
    o.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  }), async () => {
    const r = await W.fetchWithTimeout('https://x.example', { method: 'POST' }, 50);
    ok('T1 fetchWithTimeout-null-on-abort', r === null, `got ${r}`);
  });

  console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error('HARNESS ERROR:', e && e.stack || e); process.exit(2); });
