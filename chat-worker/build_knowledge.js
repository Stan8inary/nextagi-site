#!/usr/bin/env node
/**
 * build_knowledge.js
 * ------------------
 * Reads the main worker (worker/src/index.js), pulls out the PUBLIC page
 * template-literal HTML constants, strips <script>/<style>/<svg> and all
 * other tags, and writes a clean knowledge base to knowledge.json for the
 * chat worker's context-stuffing system prompt.
 *
 * Scope / safety:
 *   - EXCLUDES: ADMIN_HTML, all /api/* code, KV-backed pages (briefing/WA
 *     detail are built at runtime from KV, not static consts), secrets, and
 *     the Brevo email HTML bodies.
 *   - EXCLUDES: base64 data-URIs (they live inside tags we remove).
 *   - Prints a per-page char breakdown and the TOTAL so we can decide
 *     whether the whole KB fits in one system prompt (~60k budget).
 *
 * Usage:  node build_knowledge.js
 * Output: ./knowledge.json  (page title, url, clean text)
 *
 * This is READ-ONLY against the worker. It never writes to worker/.
 */

'use strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKER = path.join(__dirname, '..', 'worker', 'src', 'index.js');
// The KB is emitted as a JS ES module so the worker can `import` it directly
// (zero KV round-trip per request). A flat knowledge.json is also written for
// debugging / human inspection.
const OUT_JS = path.join(__dirname, 'src', 'knowledge.js');
const OUT_JSON = path.join(__dirname, 'knowledge.json');
// The client widget is bundled as a STRING module so the worker can serve its
// raw text without a runtime filesystem fetch (Workers have no fs).
const WIDGET_SRC = path.join(__dirname, 'chat-widget.js');
const OUT_WIDGET = path.join(__dirname, 'src', 'widget.js');

// Map each HTML const name to its public URL (for the source links we show
// under chat answers). Order here = order of appearance (top-down).
const NAME_TO_URL = {
  HTML_CONTENT: '/',
  ABOUT_HTML: '/about',
  USE_CASES_LISTING_HTML: '/Use-Cases',
  USE_CASES_ENTRASYNC_HTML: '/use-cases/entrasync',
  CIS_BENCHMARK_HTML: '/use-cases/cis-benchmark-auditor',
  ENTRA_CIS_V2_HTML: '/use-cases/entra-cis-v2',
  AD_ONBOARDING_HTML: '/use-cases/ad-onboarding',
  DC_AZURE_DEPLOYMENT_HTML: '/use-cases/dc-azure-deployment',
  DC_UPGRADE_CASE_HTML: '/use-cases/dc-upgrade',
  DC_AZURE_SECURITY_HTML: '/use-cases/dc-azure-security',
  AKS_EMPLOYEE_PORTAL_HTML: '/use-cases/aks-employee-portal',
  BRIEFINGS_LISTING_HTML: '/briefings',
};
// Anything in this set is never part of the public knowledge base.
const EXCLUDE = new Set(['ADMIN_HTML']);

const src = fs.readFileSync(WORKER, 'utf8');

// Extract each `const NAME = `...`;` template literal (non-greedy).
const BT = String.fromCharCode(96); // backtick
const re = new RegExp(
  'const\\s+([A-Z0-9_]+?)\\s*=\\s*' + BT + '([\\s\\S]*?)' + BT + '\\s*;',
  'g'
);

function unescapeTemplateLiteral(s) {
  // Decode the escapes the worker stores for backslash / quote / newline.
  return s
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '')
    .replace(/\\\\/g, '\\')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace('\\' + BT, BT);
}

// Nav labels + footer boilerplate that repeat verbatim on every public page.
// A *bare* line that is exactly one of these (not a "## " heading) is a nav
// link / brand wordmark, never real prose — safe to drop wherever it appears.
// The brand wordmark "AppoSight" is included: on the home page it is the first
// nav item and previously broke the top-run detection, leaving nav text in
// the summary.
const NAV_LABELS = new Set(['home', 'about', 'capabilities', 'pentest', 'use cases', 'briefings', 'contact', 'apposight']);

function stripBoilerplate(t) {
  let before = t.length;
  // 1) Copyright footer (identical on all 12 pages).
  t = t.replace(/Copyright\s*(?:©|&copy;)?\s*2026\s*AppoSight\s*\.?\s*All rights reserved\./gi, ' ');
  // 2) "← All Use Cases" / "← Use Cases" back-links (navigation chrome).
  t = t.replace(/←\s*(?:All\s+)?Use Cases/gi, ' ');
  // 3) Bare nav-label / brand lines anywhere (exact match, never a "## "
  //    heading, never a sentence). Removing these is what makes each
  //    one-line summary a real description instead of nav text.
  t = t.split('\n').filter((line) => {
    const s = line.trim();
    return !(s && !s.startsWith('##') && NAV_LABELS.has(s.toLowerCase()));
  }).join('\n');
  t = t.replace(/\n{3,}/g, '\n\n').replace(/^ +| +$/gm, '').trim();
  return { t, saved: before - t.length };
}

// ---------------------------------------------------------------------------
// Hygiene: IP-classification redaction (applied AFTER tag-strip / decode,
// BEFORE chunking). Values are replaced in the KB; this file never prints them.
//   - RFC1918 private (10.x, 172.16-31.x, 192.168.x)   -> "[redacted]"
//   - Public / globally-routable IPv4                   -> "[redacted]"
//   - Documentation ranges (TEST-NET-1 192.0.2.0/24,
//     TEST-NET-2 198.51.100.0/24, TEST-NET-3 203.0.113.0/24, 198.18.0.0/15,
//     100.64.0.0/10 CGNAT, 169.254.0.0/16, 127.0.0.0/8) -> KEPT.
//     Reserved-for-documentation by design; the case studies use them AS
//     sanitized placeholders, so they are expected to survive in the KB.
//   - Emails: the site publishes NO contact email (contact = form only).
//     Any email whose domain is NOT apposight.com -> "[redacted]".
//     @apposight.com addresses are kept (they are the site's own domain).
// ---------------------------------------------------------------------------
function classifyV4(ip) {
  const o = ip.split('.').map(Number);
  if (o[0] === 10) return 'private';
  if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return 'private';
  if (o[0] === 192 && o[1] === 168) return 'private';
  if (o[0] === 192 && o[1] === 0 && o[3] >= 0 && o[1] === 0 && o[2] === 2) return 'doc';          // 192.0.2.0/24
  if (o[0] === 192 && o[1] === 0 && o[2] === 0) return 'doc';                                    // 192.0.0.0/24 (iana)
  if (o[0] === 198 && o[1] === 51 && o[2] === 100) return 'doc';                                 // TEST-NET-2
  if (o[0] === 203 && o[1] === 0 && o[2] === 113) return 'doc';                                  // TEST-NET-3
  if (o[0] === 198 && o[1] >= 18 && o[1] <= 19) return 'doc';                                    // benchmark
  if (o[0] === 127) return 'doc';                                                                // loopback (never a real peer)
  if (o[0] === 169 && o[1] === 254) return 'doc';                                                // link-local
  if (o[0] === 100 && o[1] >= 64 && o[1] <= 127) return 'doc';                                   // CGNAT
  return 'public';
}
const V4_RE = /(?<!\d)(?:\d{1,3}\.){3}\d{1,3}(?!\d)/g;
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g;
function redactSecrets(t) {
  let ipRedacted = 0, emailRedacted = 0;
  t = t.replace(V4_RE, (ip) => {
    if (ip.split('.').some((o) => Number(o) > 255)) return ip; // not an IP (version-like text)
    if (classifyV4(ip) === 'private' || classifyV4(ip) === 'public') { ipRedacted++; return '[redacted]'; }
    return ip; // documentation / reserved placeholder — keep
  });
  t = t.replace(EMAIL_RE, (em) => {
    const dom = em.split('@').pop().toLowerCase();
    if (dom === 'apposight.com' || dom.endsWith('.apposight.com')) return em;
    emailRedacted++; return '[redacted]';
  });
  return { t, ipRedacted, emailRedacted };
}

// Decode the HTML entities the worker templates store.
const ENT = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ', '&mdash;': '—',
  '&ndash;': '–', '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“',
  '&rdquo;': '”', '&hellip;': '…', '&larr;': '←', '&rarr;': '→', '&uarr;': '↑', '&darr;': '↓',
};
function decodeEntities(s) {
  // Named entities: decode any &name; present in ENT (amp, lt, rsquo, larr, …).
  s = s.replace(/&([a-zA-Z]+);/g, (m, name) => { const key = '&' + name + ';'; return key in ENT ? ENT[key] : m; });
  // Numeric character references, incl. 4- and 5-digit (emoji) hex refs:
  //   &#x1F9E0; -> 🧠   and   &#8212; -> —
  s = s.replace(/&#x([0-9a-fA-F]{2,6});/g, (m, h) => {
    try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ''; }
  });
  s = s.replace(/&#([0-9]{2,6});/g, (m, d) => {
    try { return String.fromCodePoint(parseInt(d, 10)); } catch { return ''; }
  });
  return s;
}

/**
 * Convert page HTML to STRUCTURED text:
 *   - <h1>/<h2>/<h3>  ->  "## <heading>" marker lines (chunk boundaries)
 *   - block elements   ->  newlines (paragraph/section boundaries)
 *   - all other tags   ->  stripped
 *   - entities decoded, whitespace collapsed
 * The "## " lines preserve each real section heading so retrieval can chunk
 * by heading and each chunk carries its own section title (not the page
 * title). HTML comments are removed here (hygiene).
 */
function toStructuredText(html) {
  let t = html;
  // Drop the big / useless blocks first (scripts, styles, inline SVG art, comments).
  t = t.replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
  t = t.replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  t = t.replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ');
  t = t.replace(/<!--[\s\S]*?-->/g, ' ');
  // Convert h1-h3 into "## heading" marker lines (nested tags inside a
  // heading are flattened). This MUST run before the catch-all tag strip.
  t = t.replace(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi, (m, inner) => {
    const txt = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return txt ? '\n## ' + txt + '\n' : '';
  });
  // Block-element boundaries -> newlines.
  t = t.replace(/<\/(p|div|li|ul|ol|section|article|header|footer|table|tr|h[4-6])>/gi, '\n');
  t = t.replace(/<br\s*\/?>/gi, '\n');
  // Strip every remaining tag.
  t = t.replace(/<[^>]+>/g, ' ');
  // Decode entities + collapse whitespace.
  t = decodeEntities(t);
  t = t.replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/^ +| +$/gm, '');
  return t.trim() + '\n';
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return '';
  return m[1].replace(/\s+/g, ' ').trim();
}

const pages = [];
let m;
while ((m = re.exec(src)) !== null) {
  const name = m[1];
  if (EXCLUDE.has(name)) continue;
  const url = NAME_TO_URL[name];
  if (!url) {
    // A const we don't recognize — skip rather than emit a bad entry.
    process.stderr.write(`skip (no url map): ${name}\n`);
    continue;
  }
  const html = unescapeTemplateLiteral(m[2]);
  const structuredRaw = toStructuredText(html);
  const rd = redactSecrets(structuredRaw); // private/public IPs + non-apposight emails -> [redacted]
  const bp = stripBoilerplate(rd.t);
  const structured = bp.t;
  const before = structuredRaw.length; // text after tag-strip, before boilerplate-strip
  const pageTitle = extractTitle(html) || url;
  // One-line summary = first real prose line that is NOT the page title, NOT
  // a "## " heading marker, and NOT a bare nav/wordmark. Skipping the title
  // is what turns use-case summaries from the title into a real description.
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const titleNorm = norm(pageTitle);
  const proseLine = structured
    .split('\n').map((s) => s.trim())
    .find((s) => s && !s.startsWith('##') && s.length >= 18 && norm(s) !== titleNorm) || '';
  const summary = (proseLine.length > 150 ? proseLine.slice(0, 150).replace(/\s+\S*$/, '') + '…' : proseLine)
    || (pageTitle.length > 150 ? pageTitle.slice(0, 150) + '…' : pageTitle);
  pages.push({ title: pageTitle, url, text: structured, summary, before, after: structured.length, saved: before - structured.length, redacted: rd.ipRedacted, emailRedacted: rd.emailRedacted });
}

// Dedup by url (keep first), keep discovery order.
const seen = new Set();
const pagesClean = pages.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));

// ---- Synthetic "Contact & Basics" page -------------------------------------
// The 12 extracted pages answer topical questions, but NOTHING in the KB says
// how to REACH the company: the contact form sits in the home page's contact
// section and after tag-strip its labels are the only trace, so basic visitor
// questions ("How do I contact you?") scored 0 and were canned (holdout #10).
// This hand-authored chunk uses ONLY facts visible on apposight.com (home
// hero, capabilities grid, contact section at /#contact) so basic questions
// retrieve a real answer.
// SAFETY: the public site publishes NO email address, NO phone number, NO
// physical address, and no response time (verified: no mailto: links, no
// phone digits, no location text in any public page constant; the only
// addresses in the worker are backend Brevo notification code, which this
// build excludes). The chunk therefore states that explicitly and points to
// the contact form — the site's own contact channel. Nothing is invented.
const CONTACT_BASICS = {
  title: 'Contact & Basics',
  url: '/#contact',
  summary: 'How to reach AppoSight (contact form on the home page) and a short summary of what the company does.',
  text: [
    '## Contact',
    'To contact AppoSight, use the contact form on the home page: the "Let\'s build the future together." section (anchor #contact). It asks for your name, your email, an optional phone number, and a short message about your project. The site publishes no public email address, no phone number, and no physical address, and it does not state a response time. The form is the way the site directs visitors to reach the AppoSight team.',
    '',
    '## What AppoSight does',
    'AppoSight builds autonomous AI systems ("Intelligence, Reimagined. Building the future of autonomous AI systems."): fine-tuning of language models, AI agents that plan, reason, and execute workflows, model serving and local inference, audio and text-to-speech, model evaluation, and AI penetration testing — autonomous red team operations. The use-case pages describe applied work in identity and access management, Microsoft Entra, Active Directory, and Azure deployments.',
    '',
    '## Getting started',
    'Questions about pricing, engagements, or fit are handled through the same contact form on the home page. Include a short description of the project so the AppoSight team can follow up.',
  ].join('\n'),
};

const kb = [...pagesClean.map(({ title, url, text, summary }) => ({ title, url, summary, text })), CONTACT_BASICS];
fs.writeFileSync(OUT_JSON, JSON.stringify(kb, null, 2));

// Emit the importable ES module the worker uses. `export default` keeps the
// import on the worker side to a single named symbol.
const jsHeader =
  '// AUTO-GENERATED by build_knowledge.js — DO NOT EDIT BY HAND.\n' +
  '// Regenerate after publishing new site content:  node build_knowledge.js\n' +
  '// Then redeploy the chat worker (wrangler deploy).\n' +
  'export default ' + JSON.stringify(kb, null, 2) + ';\n';
fs.mkdirSync(path.dirname(OUT_JS), { recursive: true });
fs.writeFileSync(OUT_JS, jsHeader);

// Emit the widget string module (raw text of chat-widget.js).
if (fs.existsSync(WIDGET_SRC)) {
  const widgetRaw = fs.readFileSync(WIDGET_SRC, 'utf8');
  fs.writeFileSync(
    OUT_WIDGET,
    '// AUTO-GENERATED from chat-widget.js — DO NOT EDIT BY HAND.\n' +
      '// Edit chat-widget.js, then re-run: node build_knowledge.js\n' +
      'export default ' + JSON.stringify(widgetRaw) + ';\n'
  );
}

const totalBefore = pagesClean.reduce((s, p) => s + p.before, 0);
const total = pagesClean.reduce((s, p) => s + p.after, 0);
console.log(`\nKnowledge base: ${pagesClean.length} public pages`);
console.log(`  ${OUT_JSON}\n  ${OUT_JS}\n`);
console.log('per-page chars (before boilerplate-strip -> after) + hygiene redactions:');
for (const p of pagesClean) {
  const red = (p.redacted || p.emailRedacted) ? `  [redacted: ${p.redacted} IP, ${p.emailRedacted} email]` : '';
  console.log(`  ${String(p.before).padStart(7)} -> ${String(p.after).padStart(7)}  (-${p.saved})  ${p.url}${red}`);
}
console.log(`\nTOTAL: ${totalBefore} -> ${total} chars  (saved ${totalBefore - total})`);
console.log(
  total <= 60000
    ? '=> FITS in a single system prompt (<= 60k budget). OK for full context-stuffing.'
    : `=> OVER 60k. Full context-stuffing may exceed free-tier context; see retrieval proposal.`
);
