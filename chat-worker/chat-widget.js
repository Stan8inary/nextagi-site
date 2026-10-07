/*
 * AppoSight Chat Widget — v1
 * ---------------------------------------------------------------------------
 * Vanilla JS + Shadow DOM. No build step, no dependencies.
 * Injected into every public page by:
 *   <script src="/api/chat-widget.js?v=1" defer></script>
 *
 * Behaviour:
 *   - Floating bubble, bottom-right; expands into a chat panel.
 *   - Keyboard accessible (Esc closes, Enter sends, focusable controls).
 *   - Streams the assistant reply token-by-token (SSE).
 *   - Shows a "typing…" state and source links under each answer.
 *   - "New chat" clears history.
 *   - Cloudflare Turnstile (managed) before each send.
 *   - Lead capture: when the assistant returns lead_capture=true, shows a
 *     small name/email/message form that POSTs to /api/contact using the
 *     SAME fields the site's contact form uses: name, email, phone, message.
 *   - Fails gracefully: on error, "Please use our contact form" + link.
 *   - Disclaimer in the panel footer.
 *
 * All styling/markup lives in a Shadow Root so it cannot clash with the host
 * page, and the host page's CSS cannot leak in. Colors/fonts copied from the
 * AppoSight site (:root --blue #2997ff, etc.).
 */
(function () {
  'use strict';

  const VERSION = 1; // bump to bust the 24h edge cache
  const API = '/api/chat';
  const CFG = '/api/chat/config';
  const CONTACT = '/contact';

  let shadow = null;          // the Shadow Root all queries are scoped to
  const state = {
    open: false,
    messages: [],             // [{role:'user'|'assistant', content}]
    busy: false,
    turnstileKey: '',
    turnstileWidget: null,
    turnstileToken: null,
    maxMsg: 500,
    greeted: false,
  };

  // ---- AppoSight palette (copied from the site's :root) ----
  const CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host {
      --blue: #2997ff; --blue-dark: #1a7fd6;
      --black: #1d1d1f; --gray: #86868b;
      --light-gray: #f5f5f7; --white: #ffffff;
      --radius: 16px;
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px; line-height: 1.45; color: var(--black);
    }
    button { font: inherit; cursor: pointer; border: none; background: none; }
    a { color: var(--blue); text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ---------- Bubble ---------- */
    .bubble {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--blue); color: var(--white);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 24px rgba(41,151,255,0.35);
      transition: transform .18s ease, background .18s ease;
    }
    .bubble:hover { transform: scale(1.05); background: var(--blue-dark); }
    .bubble:focus-visible { outline: 3px solid var(--black); outline-offset: 2px; }
    .bubble svg { width: 28px; height: 28px; }

    /* ---------- Panel ---------- */
    .panel {
      position: fixed; bottom: 88px; right: 20px;
      width: 360px; max-width: calc(100vw - 32px); height: 520px; max-height: 72vh;
      background: var(--white); border-radius: var(--radius);
      box-shadow: 0 12px 48px rgba(0,0,0,0.20);
      display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; transform: translateY(12px) scale(.98); pointer-events: none;
      transition: opacity .18s ease, transform .18s ease;
    }
    .panel.open { opacity: 1; transform: none; pointer-events: auto; }

    .head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; background: var(--blue); color: var(--white);
    }
    .head .t { font-weight: 600; font-size: 15px; letter-spacing: -0.2px; }
    .head .s { font-size: 11px; opacity: .85; margin-top: 2px; }
    .head .act { display: flex; gap: 8px; }
    .icon-btn {
      width: 30px; height: 30px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: var(--white); background: rgba(255,255,255,0.15);
    }
    .icon-btn:hover { background: rgba(255,255,255,0.28); }
    .icon-btn:focus-visible { outline: 2px solid var(--white); }
    .icon-btn svg { width: 18px; height: 18px; }

    .log { flex: 1; overflow-y: auto; padding: 16px 14px; background: var(--light-gray); }
    .msg { display: flex; margin-bottom: 12px; }
    .msg.user { justify-content: flex-end; }
    .bubble-b {
      max-width: 82%; padding: 9px 13px; border-radius: 14px;
      white-space: pre-wrap; word-break: break-word;
    }
    .msg.user .bubble-b { background: var(--blue); color: var(--white); border-bottom-right-radius: 4px; }
    .msg.bot .bubble-b { background: var(--white); border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }

    .srcs { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; }
    .srcs .lbl { font-size: 11px; color: var(--gray); margin-bottom: 3px; }
    .srcs a { display: block; font-size: 12px; margin: 2px 0; }

    .typing { display: inline-flex; gap: 4px; padding: 4px 0; }
    .typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--gray); opacity: .5; animation: apobl 1.2s infinite; }
    .typing span:nth-child(2){ animation-delay: .2s; }
    .typing span:nth-child(3){ animation-delay: .4s; }
    @keyframes apobl { 0%,60%,100%{ opacity:.25; transform:translateY(0);} 30%{ opacity:1; transform:translateY(-3px);} }

    /* lead capture */
    .lead { margin-top: 10px; background: var(--light-gray); border-radius: 10px; padding: 10px; }
    .lead label { display: block; font-size: 12px; color: var(--gray); margin: 6px 0 2px; }
    .lead input, .lead textarea { width: 100%; font: inherit; padding: 7px 9px; border: 1px solid #d5d5da; border-radius: 8px; }
    .lead textarea { resize: vertical; min-height: 56px; }
    .lead .row { display: flex; gap: 8px; margin-top: 8px; }
    .lead button { flex: 1; padding: 8px; border-radius: 8px; font-weight: 600; }
    .lead .send { background: var(--blue); color: var(--white); }
    .lead .send:hover { background: var(--blue-dark); }
    .lead .cancel { background: #e5e5ea; color: var(--black); }

    .composer { display: flex; gap: 8px; padding: 10px 12px; background: var(--white); border-top: 1px solid #ececef; }
    .composer input { flex: 1; font: inherit; padding: 10px 12px; border: 1px solid #d5d5da; border-radius: 10px; }
    .composer input:focus { outline: 2px solid var(--blue); border-color: transparent; }
    .send { width: 42px; height: 42px; border-radius: 10px; background: var(--blue); color: var(--white); display: flex; align-items: center; justify-content: center; }
    .send:hover { background: var(--blue-dark); }
    .send:disabled { background: #b9b9be; cursor: default; }
    .send svg { width: 20px; height: 20px; }

    .foot { padding: 6px 14px 8px; font-size: 10.5px; color: var(--gray); text-align: center; background: var(--white); }
    .foot a { color: var(--gray); }

    .notice { margin: 0 14px 10px; padding: 10px 12px; font-size: 13px; border-radius: 10px; }
    .notice.error { background: #fff5f5; color: #b02a2a; }

    @media (max-width: 480px) {
      :host { bottom: 12px; right: 12px; }
      .panel { width: calc(100vw - 24px); height: 74vh; bottom: 78px; right: 12px; }
    }
  `;

  const SVG = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>',
  };

  const $ = (sel) => shadow.querySelector(sel);

  function pushMessage(role, text) {
    const log = $('.log');
    const m = document.createElement('div');
    m.className = 'msg ' + role;
    const bb = document.createElement('div');
    bb.className = 'bubble-b';
    bb.textContent = text; // textContent -> safe from HTML injection
    m.appendChild(bb);
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function renderSources(sources) {
    if (!sources || !sources.length) return; // item 4: hide the label when the list is empty
    const last = $('.log .msg.bot:last-child .bubble-b');
    if (!last) return;
    const box = document.createElement('div');
    box.className = 'srcs';
    const lbl = document.createElement('div'); lbl.className = 'lbl'; lbl.textContent = 'Sources';
    box.appendChild(lbl);
    sources.forEach((s) => {
      const a = document.createElement('a');
      a.href = s; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = (s === '/' ? 'Home' : s);
      box.appendChild(a);
    });
    last.appendChild(box);
    $('.log').scrollTop = $('.log').scrollHeight;
  }

  function renderLeadForm() {
    const last = $('.log .msg.bot:last-child .bubble-b');
    if (!last) return;
    const box = document.createElement('div');
    box.className = 'lead';
    box.innerHTML = `
      <div style="font-weight:600;margin-bottom:2px">Want a quote or demo?</div>
      <label for="ld-name">Name</label><input id="ld-name" type="text" autocomplete="name" />
      <label for="ld-email">Email</label><input id="ld-email" type="email" autocomplete="email" />
      <label for="ld-msg">Message</label><textarea id="ld-msg" placeholder="Tell us about your project…"></textarea>
      <div class="row"><button class="send" data-act="lead-send">Send</button><button class="cancel" data-act="lead-cancel">Cancel</button></div>
    `;
    last.appendChild(box);
    $('[data-act="lead-send"]').addEventListener('click', leadSend);
    $('[data-act="lead-cancel"]').addEventListener('click', () => box.remove());
    $('.log').scrollTop = $('.log').scrollHeight;
  }

  function notice(text, isError) {
    const log = $('.log');
    const n = document.createElement('div');
    n.className = 'notice' + (isError ? ' error' : '');
    n.innerHTML = '⚠ ' + text + '  ·  <a href="' + CONTACT + '" target="_blank" rel="noopener">Contact us</a>';
    log.appendChild(n);
    log.scrollTop = log.scrollHeight;
  }

  function setBusy(b) {
    state.busy = b;
    const s = $('[data-act="send"]'); if (s) s.disabled = b;
    const inp = $('.composer input'); if (inp) inp.disabled = b; // item 2: input re-enabled on finish
  }

  // ---- Turnstile ----
  async function loadConfig() {
    try {
      const r = await fetch(CFG, { method: 'GET' });
      const cfg = await r.json();
      state.turnstileKey = cfg.turnstile_site_key || '';
      state.maxMsg = cfg.max_message_chars || 500;
      const inp = $('.composer input'); if (inp) inp.maxLength = String(state.maxMsg);
    } catch { /* non-fatal */ }
  }

  function loadTurnstileScript() {
    return new Promise((res) => {
      if (window.turnstile) return res();
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.onload = res; s.onerror = res; // resolve either way; caller checks window.turnstile
      document.head.appendChild(s);
    });
  }

  async function getTurnstileToken() {
    if (!state.turnstileKey) return ''; // no site key configured -> send empty (worker decides)
    if (state.turnstileToken) { const t = state.turnstileToken; state.turnstileToken = null; return t; }
    await loadTurnstileScript();
    if (!window.turnstile) return '';
    if (!state.turnstileWidget) {
      state.turnstileWidget = window.turnstile.render(document.body, {
        sitekey: state.turnstileKey,
        callback: (token) => { state.turnstileToken = token; },
        'expired-callback': () => { state.turnstileToken = null; },
      });
      // invisible widget; grab the first token once it appears (BOUND: 8s max —
      // a slow mobile load of the widget should fail fast with the worker's
      // clean 403, never sit "typing…" forever)
      const t0 = Date.now();
      while (!state.turnstileToken && Date.now() - t0 < 8000) await new Promise((r) => setTimeout(r, 250));
      return state.turnstileToken || '';
    }
    // refresh for subsequent sends — BOUND IT: a reset that never calls back
    // (locked/expired widget on some mobile stacks) used to hang the entire
    // send forever, because the 60s overall cap is armed only AFTER this.
    try {
      return await Promise.race([
        new Promise((res) => {
          window.turnstile.reset(state.turnstileWidget, (tok) => res(tok || ''));
        }),
        new Promise((res) => setTimeout(() => res(''), 10000)), // 10s bound -> worker 403s with a friendly message
      ]);
    } catch {
      return ''; // widget in a bad state: let the worker reject with a clean 403
    }
  }

  // ---- send flow ----
  async function send() {
    if (state.busy) return;
    const input = $('.composer input');
    const text = (input.value || '').trim();
    if (!text) return;
    if (text.length > state.maxMsg) { notice('Message too long (max ' + state.maxMsg + ' chars).', true); return; }

    state.messages.push({ role: 'user', content: text });
    state.messages = state.messages.slice(-12); // enforce 6 turns
    input.value = '';
    pushMessage('user', text);
    setBusy(true);

    const typing = pushMessage('bot', '');
    typing.querySelector('.bubble-b').innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';

    let fullText = '';
    let leadCapture = false;
    let botBox = typing.querySelector('.bubble-b');

    // item 2: client-side timeouts
    //   OVERALL  = 60s (AbortController on the fetch — covers headers + body)
    //   IDLE     = 25s (watchdog: if reader.read() hasn't resolved in this
    //              window we abort and show the friendly timeout notice)
    const OVERALL_MS = 60000;
    const IDLE_MS = 25000;
    const TIMEOUT_NOTICE = 'That took too long. Please try again or use the contact form.';
    const ac = new AbortController();
    let overallTimer = null;
    let idleTimer = null;
    const armOverall = () => {
      if (overallTimer) clearTimeout(overallTimer);
      overallTimer = setTimeout(() => ac.abort(), OVERALL_MS);
    };
    const armIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => ac.abort(), IDLE_MS);
    };
    const disarm = () => {
      if (overallTimer) { clearTimeout(overallTimer); overallTimer = null; }
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    };

    try {
      const token = await getTurnstileToken();
      armOverall();
      const resp = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages, cf_turnstile_response: token }),
        signal: ac.signal,
      });

      if (!resp.ok || !resp.body) {
        let msg = 'Please use our contact form.';
        try { const j = await resp.json(); msg = j.message || j.error || msg; } catch {}
        typing.remove();
        notice(msg, true);
        return;
      }

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      try {
        while (true) {
          armIdle();
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf('\n\n')) !== -1) {
            const block = buf.slice(0, idx); buf = buf.slice(idx + 2);
            let event = 'message', data = '';
            block.split('\n').forEach((l) => {
              if (l.startsWith('event:')) event = l.slice(6).trim();
              else if (l.startsWith('data:')) data += l.slice(5).trim();
            });
            if (!data) continue;
            let p; try { p = JSON.parse(data); } catch { continue; }
            if (event === 'start') { /* keep typing until first delta */ }
            else if (event === 'delta') {
              fullText += (p.text || '');
              botBox.textContent = fullText;
              $('.log').scrollTop = $('.log').scrollHeight;
            } else if (event === 'done') {
              if (p.sources) renderSources(p.sources);
              leadCapture = !!p.lead_capture;
            } else if (event === 'error') {
              botBox.textContent = '';
              notice(p.message || 'Please use our contact form.', true);
            }
          }
        }
      } catch (err) {
        // AbortError => we hit the 60s overall or 25s idle cap. Anything else
        // (mid-stream network drop) is treated the same way: fail fast, show
        // the friendly notice, and guarantee the composer is re-enabled.
        const isAbort = err && (err.name === 'AbortError' || err.name === 'TimeoutError');
        typing.remove();
        notice(isAbort ? TIMEOUT_NOTICE : 'Network error. Please use our contact form.', true);
        return;
      }

      if (!fullText.trim()) { typing.remove(); notice('No answer available. Please use our contact form.', true); return; }
      state.messages.push({ role: 'assistant', content: fullText });
      if (leadCapture) renderLeadForm();
    } catch (err) {
      // fetch-level abort (60s cap fired before headers) or any other throw.
      const isAbort = err && (err.name === 'AbortError' || err.name === 'TimeoutError');
      typing.remove();
      notice(isAbort ? TIMEOUT_NOTICE : 'Network error. Please use our contact form.', true);
    } finally {
      // item 2: ALWAYS re-enable the composer, no matter how we got here.
      disarm();
      setBusy(false);
    }
  }

  // ---- lead form -> /api/contact (exact fields the contact form uses) ----
  async function leadSend() {
    const name = $('#ld-name').value.trim();
    const email = $('#ld-email').value.trim();
    const message = $('#ld-msg').value.trim();
    if (!name || !email || !message) { notice('Please fill in name, email, and message.', true); return; }
    const btn = $('[data-act="lead-send"]'); btn.textContent = 'Sending…'; btn.disabled = true;
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: '', message: message + '\n\n(via AppoSight chat assistant)' }),
      });
      if (r.ok) notice('Thank you! We\'ll get back to you soon.', false);
      else { let m = 'Something went wrong.'; try { m = (await r.json()).error || m; } catch {}; notice(m, true); }
    } catch { notice('Network error. Please use our contact form.', true); }
    btn.textContent = 'Send'; btn.disabled = false;
  }

  function toggle() {
    state.open = !state.open;
    $('.panel').classList.toggle('open', state.open);
    $('.bubble').setAttribute('aria-expanded', String(state.open));
    if (state.open) {
      if (!state.greeted) {
        pushMessage('bot', 'Hi! I can answer questions about AppoSight. What would you like to know?');
        state.greeted = true;
      }
      $('.composer input').focus();
    }
  }

  function wire() {
    $('.bubble').addEventListener('click', toggle);
    $('[data-act="close"]').addEventListener('click', toggle);
    $('[data-act="new"]').addEventListener('click', () => {
      state.messages = []; state.greeted = false;
      // item 2: reset any stuck busy state so "New chat" always un-sticks the composer.
      state.busy = false;
      const s = $('[data-act="send"]'); if (s) s.disabled = false;
      const inp = $('.composer input'); if (inp) inp.disabled = false;
      $('.log').innerHTML = '';
      pushMessage('bot', 'Hi! I can answer questions about AppoSight. What would you like to know?');
      state.greeted = true;
      $('.composer input').focus();
    });
    $('[data-act="send"]').addEventListener('click', send);
    $('.composer input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.open) toggle(); });
  }

  function boot() {
    if (document.getElementById('apo-chat-widget')) return;
    const host = document.createElement('div');
    host.id = 'apo-chat-widget';
    shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);
    const shell = document.createElement('div');
    shell.className = 'apo-shell';
    shell.innerHTML = `
      <button class="bubble" aria-label="Open AppoSight chat" aria-expanded="false">${SVG.chat}</button>
      <div class="panel" role="dialog" aria-label="AppoSight chat">
        <div class="head">
          <div><div class="t">AppoSight</div><div class="s">AI assistant</div></div>
          <div class="act">
            <button class="icon-btn" data-act="new" aria-label="New chat" title="New chat">${SVG.plus}</button>
            <button class="icon-btn" data-act="close" aria-label="Close chat" title="Close">${SVG.close}</button>
          </div>
        </div>
        <div class="log" aria-live="polite"></div>
        <div class="composer">
          <input class="msg-in" type="text" placeholder="Ask about AppoSight…" aria-label="Type a message" maxlength="500" />
          <button class="send" data-act="send" aria-label="Send" title="Send">${SVG.send}</button>
        </div>
        <div class="foot">
          AI assistant. Chats may be processed by Google. Don't share sensitive information.
          &nbsp;·&nbsp; Questions are logged to improve this assistant.
          &nbsp;·&nbsp; <a href="${CONTACT}" target="_blank" rel="noopener">Contact us</a>
        </div>
      </div>
    `;
    shadow.appendChild(shell);
    (document.body || document.documentElement).appendChild(host);
    loadConfig();
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
