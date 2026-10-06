/**
 * retrieval.js — no-vector-DB lexical retrieval over the site knowledge base.
 *
 * Pipeline (deterministic, pure, no network):
 *   knowledge (12 pages)  ->  heading/paragraph chunks (1500-2500 chars, each
 *                             keeps page title + URL)
 *                          ->  IDF over the chunk corpus
 *                          ->  per-query scoring (keyword overlap * IDF,
 *                              + small boost when a query term hits the page
 *                              title/"heading")
 *                          ->  top-K chunks, capped at ~12k chars of content
 *   plus a compact 12-page index (title, URL, one-line summary) that is ALWAYS
 *   included so answers can link the right source.
 *
 * Everything here is exported so tests.js can assert the top-K URLs + scores
 * directly (no model, no network).
 */
import knowledge from './knowledge.js';

// ---------------------------------------------------------------------------
// Stopwords: generic English + the site-specific generic words Stan asked for
// (site, website, apposight, company, page).
// ---------------------------------------------------------------------------
export const STOP = new Set([
  // site-specific generics (required)
  'site', 'website', 'apposight', 'company', 'page', 'pages', 'web', 'app',
  // articles / pronouns / aux / prepositions / common function words
  'the','a','an','and','or','nor','of','to','in','on','at','by','for','from',
  'with','without','into','about','against','between','through','during','before',
  'after','above','below','up','down','out','off','over','under','again','further',
  'then','once','here','there','all','any','both','each','few','more','most','other',
  'some','such','no','not','only','own','same','so','than','too','very','i','you',
  'he','she','it','we','they','me','my','your','our','their','his','her','its','this',
  'that','these','those','is','are','was','were','be','been','being','do','does',
  'did','done','have','has','had','having','will','would','shall','should','may',
  'might','must','can','could','what','which','who','whom','when','where','why','how',
  's','t','don','now','also','as','if','else','because','but','while','of',
]);

// ---------------------------------------------------------------------------
// Tokenize: lowercase, keep [a-z0-9] runs >= 2 chars, drop stopwords.
// ---------------------------------------------------------------------------
export function tokens(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP.has(w));
}

// ---------------------------------------------------------------------------
// Chunking (HEADING-BASED).
//
// The KB text is already structured by build_knowledge.js: real h1-h3 headings
// are "## <heading>" marker lines and paragraphs are separated by newlines.
// We split each page on "## " boundaries so every chunk carries its own
// SECTION heading (not the page title). Sections larger than MAX are split on
// paragraph boundaries; a section with no heading inherits the page title.
// Each chunk keeps { url, title, heading, text } — `heading` is the section
// name and is used as the citation label in the prompt.
// ---------------------------------------------------------------------------
const MIN = 900, MAX = 2600;

function splitLong(text) {
  // Split an over-long run on paragraph boundaries, keeping <= MAX.
  const paras = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const out = [];
  let cur = '';
  const flush = () => { if (cur.trim()) out.push(cur.trim()); cur = ''; };
  for (const p of paras) {
    if (p.length > MAX) {
      flush();
      for (let i = 0; i < p.length; i += MAX) out.push(p.slice(i, i + MAX));
      continue;
    }
    if ((cur ? cur.length + 1 : 0) + p.length > MAX) flush();
    cur = cur ? cur + ' ' + p : p;
  }
  flush();
  return out;
}

function chunkPage(page) {
  const out = [];
  // Split on "## " heading markers (start of line). Each part is one section:
  // "## <heading>\n<body>". `.` does not cross newlines, so the heading is
  // exactly the first line; the body is everything after the first newline.
  const parts = page.text.split(/\n(?=## )/);
  for (const part of parts) {
    const m = part.match(/^##\s+(.*)/);
    let heading = page.title || '';
    let body = part;
    if (m) {
      heading = m[1].trim();
      const nl = part.indexOf('\n');
      body = nl >= 0 ? part.slice(nl + 1) : '';
    }
    body = body.trim();
    const headingLine = '## ' + heading;
    for (const seg of splitLong(body)) {
      out.push({ url: page.url, title: page.title, heading, text: headingLine + '\n' + seg });
    }
  }
  return out;
}

export const CHUNKS = knowledge.flatMap(chunkPage);

// ---------------------------------------------------------------------------
// Compact 12-page index: title, URL, one-line summary (first ~150 chars).
// Always shipped so answers can link the correct source page.
// ---------------------------------------------------------------------------
function oneLine(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 150 ? clean.slice(0, 150).replace(/\s+\S*$/, '') + '…' : clean;
}
export const INDEX = knowledge.map((p) => ({
  title: p.title,
  url: p.url,
  summary: oneLine(p.text),
}));

// ---------------------------------------------------------------------------
// IDF over the chunk corpus. idf(t) = ln((N+1)/(df+1)) + 1   (>= 1 always).
// ---------------------------------------------------------------------------
const N = CHUNKS.length;
const df = new Map();
for (const ch of CHUNKS) {
  for (const t of new Set(tokens(ch.text))) df.set(t, (df.get(t) || 0) + 1);
  for (const t of new Set(tokens(ch.title))) df.set(t, (df.get(t) || 0) + 1);
}
export const IDF = new Map([...df.keys()].map((t) => [t, Math.log((N + 1) / (df.get(t) + 1)) + 1]));
const idf = (t) => IDF.get(t) ?? 1;

// A query term that hits a chunk's title/"heading" gets this bonus (small).
const TITLE_BOOST = 1.5;

// ---------------------------------------------------------------------------
// Score every chunk against a query.
// ---------------------------------------------------------------------------
function scoreChunk(ch, qTerms) {
  const tf = new Map();
  for (const t of tokens(ch.text)) tf.set(t, (tf.get(t) || 0) + 1);
  let s = 0;
  for (const t of qTerms) if (tf.has(t)) s += tf.get(t) * idf(t);
  // A query term that hits the chunk's SECTION HEADING gets a small bonus
  // (a heading is a strong topical signal, stronger than body text).
  const headingSet = new Set(tokens(ch.heading));
  for (const t of qTerms) if (headingSet.has(t)) s += TITLE_BOOST;
  return s;
}

// ---------------------------------------------------------------------------
// Classification of no-match queries (used when topScore < THRESHOLD).
// ---------------------------------------------------------------------------
// "apposight" is a stopword (per Stan's list), so brand-name-only questions
// ("what does AppoSight do") tokenize to EMPTY. isSocial() doubles as the
// brand-fallback: these go to the model with the page index only (never the
// canned "I don't have that" — the site obviously IS AppoSight).
const SOCIAL_RE = /\b(hi|hello|hey|howdy|yo|hiya|thanks|thank|bye|goodbye|good (morning|afternoon|evening)|how are you|how are things|who are you|who is apposight|about you|tell me about (you|yourselves)|what is this)\b|\bapposight\b/i;
const BUYING_RE = /\b(pricing|price|prices|cost|costs|quote|quotes|demo|demos|hire|hiring|engagement|engagements|budget|how much|invoice|invoices|fee|fees|rate|rates|contract|purchase|buy|procure|sow|scope of work|retainer)\b/i;
export function isSocial(q) { return SOCIAL_RE.test(q); }
export function isBuying(q) { return BUYING_RE.test(q); }

// ---------------------------------------------------------------------------
// THRESHOLD: a query "matches" when the best chunk contains at least one
// non-stopword query term. Justification: every retained term has IDF >= 1,
// so one content-term hit scores >= 1; below that the page shares no content
// word with the question and grounding it would be a guess.
export const THRESHOLD = 1.0;

// ---------------------------------------------------------------------------
// retrieve(query) — pure, deterministic. Returns top-K + mode + sources + sizes.
//   mode = 'grounded' (chunks returned) | 'social' (index only, to model)
//          | 'canned' (no model; contact link)
// Chunks are returned ONLY in grounded mode — social/canned must not leak
// site content into the model call. `top` is always the ranked list
// (diagnostic; the report uses it for every query regardless of mode).
// ---------------------------------------------------------------------------

// Fixed context that ships with EVERY model call regardless of retrieval:
// system rules (~1200 chars) + the 12-page index (title + URL + summary per
// page). Token estimate = (BASE_CONTEXT_CHARS + retrieved-chunk chars) / 4.
export const BASE_CONTEXT_CHARS =
  1200 + INDEX.reduce((a, p) => a + p.title.length + p.url.length + p.summary.length, 0);

export function retrieve(query, { topK = 5, charCap = 12000 } = {}) {
  const qTerms = [...new Set(tokens(query))];
  const ranked = CHUNKS
    .map((ch) => ({ ch, s: scoreChunk(ch, qTerms) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => (b.s - a.s) || (a.ch.url < b.ch.url ? -1 : 1))
    .slice(0, topK);

  const topScore = ranked.length ? ranked[0].s : 0;
  let mode;
  if (topScore >= THRESHOLD && !isBuying(query)) mode = 'grounded';
  else if (isBuying(query)) mode = 'social'; // buying -> social mode + lead-capture offer at the worker
  else if (isSocial(query)) mode = 'social'; // greeting / brand -> social, WITH home+about context
  else mode = 'canned';

  // Enforce the ~12k char cap on retrieved content (keep top-ranked chunks).
  let selected = [];
  let chars = 0;
  if (mode === 'grounded') {
    for (const r of ranked) {
      if (chars >= charCap) break;
      selected.push(r.ch);
      chars += r.ch.text.length;
    }
  } else if (mode === 'social' && !isBuying(query)) {
    // Brand / smalltalk ("who are you", "what does AppoSight do"): give the
    // model the HOME + ABOUT pages (first content chunk of each) so it can
    // describe AppoSight accurately, instead of guessing from the index alone.
    for (const url of ['/', '/about']) {
      const ch = CHUNKS.find((c) => c.url === url);
      if (ch) {
        if (chars + ch.text.length > charCap) continue;
        selected.push(ch);
        chars += ch.text.length;
      }
    }
  }

  const sources = mode === 'grounded'
    ? [...new Set(selected.map((c) => c.url))]
    : INDEX.map((p) => p.url);
  return {
    query,
    topScore: Math.round(topScore * 100) / 100,
    mode,
    top: ranked.map((r) => ({ url: r.ch.url, title: r.ch.title, score: Math.round(r.s * 100) / 100 })),
    chunks: selected,
    chars,
    sources,
    tokenEstimate: Math.round((BASE_CONTEXT_CHARS + chars) / 4),
  };
}

// ---------------------------------------------------------------------------
// buildQuery: concatenation of the LAST TWO user messages, so follow-ups like
// "how long did it take?" still carry the entity from the previous turn.
// ---------------------------------------------------------------------------
export function buildQuery(messages) {
  const users = (messages || [])
    .filter((m) => m && m.role === 'user' && typeof m.content === 'string');
  return users.slice(-2).map((m) => m.content).join(' ');
}

// ---------------------------------------------------------------------------
// rankAll(query): the FULL ranked chunk list (not cut to top-K) with each
// chunk's text, for needle tests: find the rank (1-based) of the chunk that
// contains a known fact. A rank of 0/absent means no chunk carries the fact.
// ---------------------------------------------------------------------------
export function rankAll(query) {
  const qTerms = [...new Set(tokens(query))];
  return CHUNKS
    .map((ch) => ({ ch, s: scoreChunk(ch, qTerms) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => (b.s - a.s) || (a.ch.url < b.ch.url ? -1 : 1));
}
