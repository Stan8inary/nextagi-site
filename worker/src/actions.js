// AppoSight Daily Action Plan: pages + API.
// Data lives in the BRIEFINGS KV namespace:
//   actions:<date>        published plan (JSON)
//   actions_index         [{date, today, week, aware}] newest first
//   actions_draft:<date>  {p: <preview secret>, plan}  (unlisted preview, never indexed)
// Written by ~/.local/bin/apposight-actions on the workstation; this module only reads.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const AUD_LABELS = [
    ['vpn', 'Firewalls & VPN'], ['linux', 'Linux / containers'], ['windows', 'Windows'],
    ['network', 'Network devices'], ['nas', 'NAS & media servers'], ['ot', 'Industrial / OT'],
    ['dev', 'Developers & AI tools'], ['cloud', 'Cloud'], ['vendor', 'Vendor accounts'],
];

function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}
// escape, then allow `code` and **bold**
function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}
function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' },
    });
}
function htmlResp(body, status = 200, extra = {}) {
    return new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
}
function sameSecret(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length || a.length < 16) return false;
    let d = 0;
    for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
}
function longDate(day) {
    const [y, m, d] = day.split('-');
    return new Date(Date.UTC(+y, +m - 1, +d)).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
function list(a) { return Array.isArray(a) ? a : []; }

function renderCard(c, preview) {
    const tier = c.priority === 'today' ? 'crit' : 'warn';
    const tags = list(c.tags).map(t => `<span class="tag ${esc(t.kind || 'plain')}">${esc(t.text)}</span>`).join('');
    const row = (label, inner) => inner ? `<div class="row"><dt>${label}</dt><dd>${inner}</dd></div>` : '';
    const affected = c.affected ? `<p>${fmt(c.affected)}${c.not_affected ? ` <span class="no">Not affected:</span> ${fmt(c.not_affected)}` : ''}</p>` +
        (c.check_cmd ? `<pre><code>${esc(c.check_cmd)}</code></pre>` : '') : '';
    const steps = list(c.steps).length ? `<ol>${list(c.steps).map(s => `<li>${fmt(s)}</li>`).join('')}</ol>` : '';
    return `<article class="card ${tier}" data-id="${esc(c.id)}" data-f="${esc(list(c.audience).join(' '))}">
  <div class="card-top"><h3>${fmt(c.title)}</h3><label class="donebox"><input type="checkbox"> Done</label></div>
  ${preview && c.review ? '<div class="review">⚠ Needs review: automatic checks flagged this card.</div>' : ''}
  ${tags ? `<div class="meta">${tags}</div>` : ''}
  <dl class="rows">
    ${row('Who should act', c.who ? `<p>${fmt(c.who)}</p>` : '')}
    ${row('Am I affected?', affected)}
    ${row('Do this', steps)}
    ${row('Check it worked', c.verify ? `<p>${fmt(c.verify)}</p>` : '')}
    ${row('If you were hit', c.if_hit ? `<p>${fmt(c.if_hit)}</p>` : '')}
  </dl>
</article>`;
}

function renderPage(plan, opts = {}) {
    const day = plan.date;
    const cards = list(plan.cards);
    const today = cards.filter(c => c.priority === 'today');
    const week = cards.filter(c => c.priority === 'week');
    const aware = list(plan.aware);
    const used = new Set();
    cards.concat(aware).forEach(c => list(c.audience).forEach(a => used.add(a)));
    const chips = AUD_LABELS.filter(([k]) => used.has(k))
        .map(([k, l]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="false">${esc(l)}</button>`).join('');
    const tierBlock = (title, sub, arr) => arr.length ? `<section class="tier"><div class="tier-head"><h2>${title}</h2><p>${sub}</p></div>
${arr.map(c => renderCard(c, opts.preview)).join('\n')}<p class="empty" hidden>Nothing in this group for what you run.</p></section>` : '';
    const awareBlock = aware.length ? `<section class="tier" data-tier="aware"><div class="tier-head"><h2>Awareness only</h2><p>No action needed today. Here is why each one matters.</p></div>
<div class="aware"><ul>${aware.map(a => `<li data-f="${esc(list(a.audience).join(' '))}"><b>${fmt(a.title)}</b>${opts.preview && a.review ? ' <span class="tag exploited">⚠ review</span>' : ''}<span>${fmt(a.why)}</span></li>`).join('')}</ul>
<p class="empty" id="aware-empty" hidden>Nothing here for this filter.</p></div></section>` : '';
    const banner = opts.preview ? `<div class="preview-banner">PREVIEW · not published · this link is unlisted. Approve or reject in Telegram.</div>` : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Action Plan — ${esc(longDate(day))} | AppoSight</title>
<meta name="description" content="What to do about today's cybersecurity news: who is affected, the steps to take, and how to check they worked.">
${opts.preview ? '<meta name="robots" content="noindex, nofollow">' : ''}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
:root { --black:#1d1d1f; --gray:#6e6e73; --gray2:#86868b; --light-gray:#f5f5f7; --line:#d2d2d7; --white:#fff; --blue:#0071e3; --blue-logo:#2997ff;
  --red:#d70015; --red-soft:#fde8ea; --orange:#b25000; --orange-soft:#fdf0e1; --green:#1d7a32; --teal-soft:#e3f1fb; --code:#eef0f3; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: var(--black); background: var(--white); line-height: 1.55; }
nav { position: fixed; top: 0; width: 100%; padding: 14px 40px; background: rgba(255,255,255,0.85); backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px); z-index: 100; display: flex; justify-content: space-between; align-items: center; }
.logo-link { text-decoration: none; color: inherit; } .logo { display: flex; align-items: center; } .logo svg { height: 32px; }
.nav-links a { color: var(--black); text-decoration: none; margin-left: 28px; font-size: 12px; opacity: 0.8; } .nav-links a:hover { opacity: 1; }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 110; }
.hamburger span { display: block; width: 24px; height: 2px; background: var(--black); border-radius: 2px; transition: all .3s; }
.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); } .hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.hero { padding: 140px 40px 44px; text-align: center; background: var(--black); color: var(--white); }
.hero a { color: var(--blue-logo); text-decoration: none; font-size: 14px; opacity: .85; margin: 0 10px; } .hero a:hover { opacity: 1; }
.hero .date-label { font-size: 13px; color: var(--gray2); text-transform: uppercase; letter-spacing: .5px; margin: 22px 0 12px; }
.hero h1 { font-size: clamp(32px, 5vw, 52px); font-weight: 700; letter-spacing: -1.5px; line-height: 1.1; }
.hero p.sub { color: #a1a1a6; max-width: 640px; margin: 16px auto 0; font-size: 17px; }
.tally { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 22px; margin-top: 22px; font-size: 14px; color: #d2d2d7; }
.dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 7px; }
.d-crit { background: #ff453a; } .d-warn { background: #ff9f0a; } .d-info { background: #64d2ff; }
.content { max-width: 820px; margin: 0 auto; padding: 40px 40px 60px; display: grid; gap: 34px; }
.preview-banner { background: var(--orange-soft); color: var(--orange); border: 1px dashed var(--orange); border-radius: 10px; padding: 12px 16px; font-weight: 600; font-size: 14px; }
.filter { background: var(--light-gray); border-radius: 16px; padding: 20px; display: grid; gap: 12px; }
.filter-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; align-items: baseline; }
.filter-head h2 { font-size: 17px; font-weight: 600; } .progress { font-size: 13px; color: var(--gray); font-variant-numeric: tabular-nums; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { font: 500 13px/1 inherit; font-family: inherit; padding: 9px 14px; border-radius: 980px; border: 1px solid var(--line); background: var(--white); color: var(--black); cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--black); border-color: var(--black); color: var(--white); }
.chip:focus-visible, .donebox input:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.hint { font-size: 12.5px; color: var(--gray); }
.tier { display: grid; gap: 16px; }
.tier-head { display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; border-bottom: 1px solid var(--line); padding-bottom: 10px; }
.tier-head h2 { font-size: 24px; font-weight: 700; letter-spacing: -.5px; } .tier-head p { color: var(--gray); font-size: 14px; }
.card { background: var(--light-gray); border-radius: 16px; padding: 24px 26px; display: grid; gap: 14px; border-top: 4px solid var(--tc); min-width: 0; }
.card.crit { --tc: var(--red); } .card.warn { --tc: var(--orange); } .card.done { opacity: .55; }
.card-top { display: flex; gap: 14px; align-items: flex-start; }
.card-top h3 { font-size: 20px; font-weight: 600; letter-spacing: -.3px; line-height: 1.3; flex: 1; min-width: 0; }
.donebox { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--gray); white-space: nowrap; cursor: pointer; }
.donebox input { width: 18px; height: 18px; accent-color: var(--black); }
.review { font-size: 13px; color: var(--orange); font-weight: 600; }
.meta { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 980px; background: #e8e8ed; color: #424245; }
.tag.exploited { background: var(--red-soft); color: var(--red); } .tag.nopatch { background: var(--orange-soft); color: var(--orange); }
.tag.patch { background: var(--teal-soft); color: var(--blue); }
.rows { display: grid; gap: 12px; } .row { display: grid; grid-template-columns: 150px 1fr; gap: 14px; }
.row dt { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--gray); padding-top: 3px; }
.row dd { min-width: 0; font-size: 15.5px; } .row ol { padding-left: 20px; display: grid; gap: 5px; }
.no { color: var(--green); font-weight: 600; }
code { font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: .88em; background: var(--code); padding: 1px 5px; border-radius: 4px; }
pre { margin-top: 8px; background: var(--white); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; overflow-x: auto; position: relative; font-size: 13px; line-height: 1.55; }
pre code { background: none; padding: 0; font-size: inherit; }
pre button { position: absolute; top: 7px; right: 7px; font: 500 11px inherit; font-family: inherit; border: 1px solid var(--line); background: var(--light-gray); border-radius: 6px; padding: 3px 8px; cursor: pointer; }
.aware { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; } .aware ul { list-style: none; }
.aware li { display: grid; gap: 3px; padding: 14px 18px; border-top: 1px solid var(--line); } .aware li:first-child { border-top: 0; }
.aware li b { font-weight: 600; } .aware li span { color: var(--gray); font-size: 14.5px; }
.empty { color: var(--gray); font-style: italic; padding: 8px 0; }
.disclaimer { padding: 22px; background: var(--light-gray); border-radius: 12px; font-size: 13px; color: var(--gray); line-height: 1.6; display: grid; gap: 6px; }
.disclaimer a { color: var(--blue); text-decoration: none; }
footer { background: var(--light-gray); padding: 40px; text-align: center; font-size: 12px; color: var(--gray); border-top: 1px solid var(--line); }
@media (max-width: 640px) {
  nav { padding: 14px 20px; } .hamburger { display: flex; }
  .nav-links { position: fixed; top: 0; right: 0; width: 260px; height: 100vh; background: rgba(255,255,255,.98); display: flex; flex-direction: column;
    justify-content: center; padding: 0 40px; transform: translateX(100%); transition: transform .3s ease; z-index: 105; box-shadow: -4px 0 24px rgba(0,0,0,.1); }
  .nav-links.open { transform: translateX(0); } .nav-links a { margin-left: 0; margin-bottom: 24px; font-size: 20px; }
  .hero { padding: 120px 20px 34px; } .content { padding: 28px 16px 48px; }
  .row { grid-template-columns: 1fr; gap: 2px; } .card { padding: 18px; }
}
</style>
</head>
<body>
<nav>
  <a href="/" class="logo-link"><div class="logo"><svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg"><g transform="translate(30, 40)"><polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#2997ff" stroke-width="2.5"/><polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="#2997ff" opacity="0.3"/></g><text x="70" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="700" letter-spacing="-1.5" fill="#1d1d1f">Appo<tspan fill="#2997ff">Sight</tspan></text></svg></div></a>
  <div class="nav-links"><a href="/about">About</a><a href="/#capabilities">Capabilities</a><a href="/#pentest">Pentest</a><a href="/Use-Cases">Use Cases</a><a href="/briefings">Briefings</a><a href="/#contact">Contact</a></div>
  <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>
<div class="hero">
  <a href="/briefings">← All Briefings</a><a href="/briefings/${esc(day)}">Read today's briefing →</a>
  <div class="date-label">${esc(longDate(day))}</div>
  <h1>Daily Action Plan</h1>
  <p class="sub">Every item from the briefing, turned into steps you can follow. Pick what you run to see only what applies to you.</p>
  <div class="tally"><span><i class="dot d-crit"></i>${today.length} act today</span><span><i class="dot d-warn"></i>${week.length} this week</span><span><i class="dot d-info"></i>${aware.length} awareness only</span></div>
</div>
<div class="content">
  ${banner}
  <div class="filter">
    <div class="filter-head"><h2>What do you run?</h2><span class="progress" id="progress"></span></div>
    <div class="chips" id="chips" role="group" aria-label="Filter by what you run"><button class="chip" type="button" data-f="all" aria-pressed="true">Show everything</button>${chips}</div>
    <p class="hint">Your choices and ticks are saved in this browser only.</p>
  </div>
  ${tierBlock('Act today', 'Exploited now, or you are directly affected if you use the product.', today)}
  ${tierBlock('This week', 'Real risk, but no confirmed mass exploitation, or the fix needs planning.', week)}
  ${awareBlock}
  <div class="disclaimer">
    <p><b>How this plan is made:</b> generated with AI from the AppoSight daily briefing and public reporting, then reviewed by a person before publishing. Check the vendor's own advisory before changing production systems.</p>
    <p>General guidance only, not advice for your specific environment. For help, <a href="/#contact">contact AppoSight</a>.</p>
  </div>
</div>
<footer><p>Copyright &copy; 2026 AppoSight. All rights reserved.</p></footer>
<script>
(function(){
  var h=document.querySelector('.hamburger'),n=document.querySelector('.nav-links');
  if(h&&n){h.addEventListener('click',function(){h.classList.toggle('active');n.classList.toggle('open');});}
  var KEY='apposight-actions-${esc(day)}', st={f:'all',done:{}};
  try{var s=JSON.parse(localStorage.getItem(KEY)||'null');if(s){st.f=s.f||'all';st.done=s.done||{};}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
  var cards=[].slice.call(document.querySelectorAll('.card')),chips=[].slice.call(document.querySelectorAll('.chip')),aw=[].slice.call(document.querySelectorAll('.aware li'));
  if(!chips.some(function(c){return c.dataset.f===st.f;}))st.f='all';
  function match(el){var f=(el.getAttribute('data-f')||'').split(' ');return st.f==='all'||f.indexOf(st.f)>-1||f.indexOf('all')>-1;}
  function render(){
    chips.forEach(function(c){c.setAttribute('aria-pressed',String(c.dataset.f===st.f));});
    var shown=0,done=0;
    cards.forEach(function(c){c.hidden=!match(c);var d=!!st.done[c.dataset.id];c.classList.toggle('done',d);c.querySelector('input').checked=d;if(!c.hidden){shown++;if(d)done++;}});
    var an=0;aw.forEach(function(l){l.hidden=!match(l);if(!l.hidden)an++;});
    var ae=document.getElementById('aware-empty');if(ae)ae.hidden=an>0;
    document.querySelectorAll('section.tier').forEach(function(sec){var p=sec.querySelector(':scope > .empty');if(p)p.hidden=sec.querySelectorAll('.card:not([hidden])').length>0;});
    document.getElementById('progress').textContent=done+' of '+shown+' done';
  }
  chips.forEach(function(c){c.addEventListener('click',function(){st.f=c.dataset.f;save();render();});});
  cards.forEach(function(c){c.querySelector('input').addEventListener('change',function(e){st.done[c.dataset.id]=e.target.checked;save();render();});});
  document.querySelectorAll('pre').forEach(function(p){var b=document.createElement('button');b.type='button';b.textContent='Copy';
    b.addEventListener('click',function(){var t=p.querySelector('code').innerText;function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy';},1500);}
      function sel(){var r=document.createRange();r.selectNodeContents(p.querySelector('code'));var s=getSelection();s.removeAllRanges();s.addRange(r);}
      try{navigator.clipboard.writeText(t).then(ok,sel);}catch(e){sel();}});p.appendChild(b);});
  render();
})();
</script>
<script src="/api/chat-widget.js?v=1" defer></script>
</body>
</html>`;
}

function notFoundPage(msg) {
    return htmlResp(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Action Plan | AppoSight</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1d1d1f;background:#fff;display:grid;place-items:center;min-height:90vh;padding:20px;text-align:center}a{color:#0071e3;text-decoration:none}</style></head>
<body><div><h1 style="font-size:28px;margin-bottom:12px">${esc(msg)}</h1><p><a href="/briefings">← Back to Briefings</a></p></div></body></html>`, 404);
}

async function getJSON(env, key) {
    const raw = await env.BRIEFINGS.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
}

// Returns a Response for action-plan routes, or null if the path is not ours.
export async function handleActions(url, request, env) {
    const p = url.pathname.replace(/\/+$/, '');
    if (request.method !== 'GET' && request.method !== 'HEAD') return null;

    if (p === '/api/actions') {
        const idx = (await getJSON(env, 'actions_index')) || [];
        return json({ plans: idx, count: idx.length });
    }
    let m = p.match(/^\/api\/actions\/(\d{4}-\d{2}-\d{2})$/);
    if (m) {
        const plan = await getJSON(env, 'actions:' + m[1]);
        return plan ? json(plan) : json({ error: 'Action plan not found' }, 404);
    }
    if (p === '/briefings/actions') {
        const idx = (await getJSON(env, 'actions_index')) || [];
        if (!idx.length) return notFoundPage('No action plans published yet.');
        return Response.redirect(new URL('/briefings/actions/' + idx[0].date, url).toString(), 302);
    }
    m = p.match(/^\/briefings\/actions\/(\d{4}-\d{2}-\d{2})$/);
    if (m && DATE_RE.test(m[1])) {
        const secret = url.searchParams.get('p');
        if (secret) {
            const draft = await getJSON(env, 'actions_draft:' + m[1]);
            if (!draft || !sameSecret(secret, draft.p)) return notFoundPage('This preview link has expired.');
            return htmlResp(renderPage(draft.plan, { preview: true }), 200, { 'X-Robots-Tag': 'noindex, nofollow' });
        }
        const plan = await getJSON(env, 'actions:' + m[1]);
        if (!plan) return notFoundPage('No action plan for this date.');
        return htmlResp(renderPage(plan));
    }
    return null;
}

// For the briefing pages: does a published plan exist for this date?
export async function hasActionPlan(env, day) {
    if (!DATE_RE.test(day)) return false;
    return !!(await env.BRIEFINGS.get('actions:' + day));
}

export { renderPage as _renderPageForTests };
