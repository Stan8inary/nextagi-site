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

// Item 3 (use-case listing): a question that asks for OUR services / use cases
// / offerings / capabilities / projects — "what do you do/offer", "use cases",
// "list of your work", "what projects". These must route to the /Use-Cases
// listing page AND every use-case detail page so the answer can enumerate all
// of them. Buying-intent takes precedence over listing (checked first).
//
// Deliberate narrow matches so we never capture off-topic queries:
//   - "use case(s)"          (a use-case noun, not the word "use" alone)
//   - "what do you do/offer" (brand + listing; "AppoSight do" is NOT matched)
//   - services / offerings / capabilities / projects (explicit listing nouns)
//   - "list" + a company/work word ("list of your work", "list your services"),
//     so a bare "list the CIS controls" (a specific technical question) stays
//     grounded instead of flipping to the listing page.
// Two patterns combined by isListing() (JS `||` on two regex objects would
// always return the first — so we test both explicitly).
const LISTING_A = /\b(use ?cases?|what do you (do|offer)|services?|offerings|capabilities?|projects?)\b/i;
const LISTING_B = /\blist\b.*\b(your|our|apposight|services?|projects?|use ?cases?|work|offerings?|capabilit)/i;
export function isListing(q) { const s = String(q || ''); return LISTING_A.test(s) || LISTING_B.test(s); }

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

// Part D: brand / social mode ("who are you", "what does AppoSight do") must
// ground the model on the HOME service areas, not just the hero + about.
// Build clean excerpts (heading + lead prose only) for the home hero, every
// home service-area heading, and the about page. The demo/transcript content
// that follows the lead prose in the "AI Penetration Testing" chunk (a fake
// `target.com`, port lists, a CVE id) is EXAMPLE DATA and must never reach the
// model, so each excerpt is cut at the first transcript sentinel and trimmed
// to a lead sentence. Total is capped to ~3000 chars. Returns synthetic chunk
// objects (heading/title/url/text) so buildSystemPrompt renders them exactly
// like retrieved chunks.
const BRAND_SERVICE_DROP = /Let's build the future together|Explore|Connect$/;
const BRAND_SENTINELS = [
  'agent@', 'ai-pentest-agent', '--target', '--scan', '--ports', '--chain',
  '[+]', '[✓]', 'CVE-', 'Scanning', 'Open ports', 'SSH key', 'Lateral movement',
  'Privilege escalation', 'Assessment complete', 'OpenSSH', 'Apache ', 'Nginx',
  'Tomcat', 'MySQL ', '8.0.32', 'Explore Connect',
];
function brandCleanLead(text, cap = 150) {
  let t = String(text || '').replace(/\s+/g, ' ').trim();
  let cut = Infinity;
  for (const s of BRAND_SENTINELS) { const i = t.indexOf(s); if (i > 0 && i < cut) cut = i; }
  let head = t.slice(0, cut).trim();
  head = head.replace(/[ \t]*[🧠🤖⚡🔊📊🔒📋🔍💥]+$/, '').trim();
  if (head.length > cap) head = head.slice(0, cap).replace(/\s+\S*$/, '') + '…';
  return head;
}
export const BRAND_CAP_CHARS = 3000;
export function brandExcerpts() {
  const home = CHUNKS.filter((c) => c.url === '/');
  const hero = home.find((c) => c.heading === 'Intelligence, Reimagined.') || home[0];
  const service = home.filter((c) => !BRAND_SERVICE_DROP.test(c.heading) && c !== hero);
  const about = CHUNKS.find((c) => c.url === '/about');
  const src = [hero, ...service, about].filter(Boolean);
  const out = [];
  let total = 0;
  for (const c of src) {
    const head = brandCleanLead(c.text);
    if (!head) continue;
    // Source chunk text is "## <heading> <lead prose>". The renderer ALSO
    // prints the heading in brackets, so keep the PROSE only: strip the leading
    // "## " marker and the repeated heading (exact match, no regex guessing).
    let prose = head.replace(/^##\s*/, '').trim();
    const heading = c.heading;
    if (prose.startsWith(heading)) prose = prose.slice(heading.length).trim();
    if (!prose) prose = heading;
    total += (heading + ' ' + prose).length;
    out.push({ url: c.url, title: c.title, heading, text: prose, brand: true });
    if (total >= BRAND_CAP_CHARS) break;
  }
  return {
    chunks: out,
    chars: total,
    tokenEstimate: Math.round(total / 4),
    headings: out.map((c) => c.heading),
  };
}
export function retrieve(query, { topK = 5, charCap = 12000 } = {}) {
  const qTerms = [...new Set(tokens(query))];
  const ranked = CHUNKS
    .map((ch) => ({ ch, s: scoreChunk(ch, qTerms) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => (b.s - a.s) || (a.ch.url < b.ch.url ? -1 : 1))
    .slice(0, topK);

  const topScore = ranked.length ? ranked[0].s : 0;
  // Item 3: a "listing" query asks for our services / use cases / offerings /
  // capabilities / projects. Buying intent takes precedence (lead capture).
  // A listing query resolves to 'listing' mode (social-style context + the
  // /Use-Cases listing + every use-case detail page) so handleChat never
  // short-circuits it to canned.
  const listingQuery = isListing(query);
  let mode;
  if (isBuying(query)) mode = 'social'; // buying -> social mode + lead-capture offer
  else if (listingQuery) mode = (topScore >= THRESHOLD) ? 'grounded' : 'social';
  else if (topScore >= THRESHOLD) mode = 'grounded';
  else if (isSocial(query)) mode = 'social'; // greeting / brand -> social, WITH home+about context
  else mode = 'canned';

  // Enforce the ~12k char cap on retrieved content (keep top-ranked chunks).
  let selected = [];
  let chars = 0;
  const pushIf = (ch) => {
    if (!ch) return;
    if (chars + ch.text.length > charCap) return;
    selected.push(ch); chars += ch.text.length;
  };
  if (mode === 'grounded') {
    for (const r of ranked) {
      if (chars >= charCap) break;
      selected.push(r.ch);
      chars += r.ch.text.length;
    }
  } else if (mode === 'social' && !isBuying(query)) {
    // Brand / smalltalk ("who are you", "what does AppoSight do"): ground the
    // model on the HOME service areas + hero + about (Part D) so it describes
    // AppoSight accurately, instead of guessing from the index alone. The demo
    // transcript content in the "AI Penetration Testing" chunk is example data
    // and is stripped by brandExcerpts (see brandCleanLead).
    const brand = brandExcerpts();
    for (const ch of brand.chunks) pushIf(ch);
  }

  // Item 3 (use-case listing): ALWAYS include the /Use-Cases listing chunk
  // plus one chunk from EVERY use-case detail page so the model can enumerate
  // all use cases by title. Appended AFTER the ranked chunks (grounded) or
  // home+about (social) so the primary topical context still leads.
  // Also (item 5) include the HOME + ABOUT pages so a services/capabilities
  // question covers the service areas listed on the home page — e.g.
  // "What's new in your services?" must retrieve /Use-Cases PLUS home.
  if (listingQuery && !isBuying(query)) {
    const seen = new Set(selected.map((c) => c.url + '|' + (c.heading || '')));
    const add = (ch) => {
      if (!ch) return;
      const key = ch.url + '|' + (ch.heading || '');
      if (seen.has(key)) return;
      pushIf(ch); if (selected[selected.length - 1] === ch) seen.add(key);
    };
    add(CHUNKS.find((c) => c.url === '/'));       // item 5: home (service areas)
    add(CHUNKS.find((c) => c.url === '/about'));  // item 5: about
    add(CHUNKS.find((c) => c.url === '/Use-Cases'));
    for (const p of knowledge.filter((k) => k.url.startsWith('/use-cases/'))) {
      add(CHUNKS.find((c) => c.url === p.url));
    }
  }

  // Sources (what the UI shows as chips):
  //   grounded -> distinct URLs of the ACTUAL top-3 chunks sent to the model,
  //               ordered by their BEST chunk score (best match first). The
  //               old order was first-appearance in the selected list, so a
  //               page whose single chunk ranked above the target page's best
  //               chunk got listed first (observed: "how long did the DC
  //               upgrade take?" -> aks-employee-portal (28.5) ahead of
  //               dc-upgrade (19.64)).
  //   social   -> HOME + ABOUT only (what the model is grounded on)
  //   buying   -> HOME + ABOUT only (same context; + lead-capture offer)
  //   canned   -> none (the UI hides the empty label)
  let sources;
  if (mode === 'grounded') {
    const bestBy = new Map(); // url -> { s, url }
    for (const r of ranked.slice(0, 3)) {
      const cur = bestBy.get(r.ch.url);
      if (!cur || r.s > cur.s) bestBy.set(r.ch.url, { s: r.s, url: r.ch.url });
    }
    sources = [...bestBy.values()].sort((a, b) => (b.s - a.s) || (a.url < b.url ? -1 : 1)).map((b) => b.url);
  } else if (mode === 'social') {
    sources = ['/', '/about'];
  } else {
    sources = [];
  }
  // Item 3: a listing query's chips must include the /Use-Cases listing page
  // (the answer is grounded on it), even if the ranked top-3 didn't surface it.
  if (listingQuery && !sources.includes('/Use-Cases')) {
    sources = ['/Use-Cases', ...sources.filter((u) => u !== '/Use-Cases')];
  }
  // Item 5: a listing query is also grounded on HOME (service areas), so its
  // chips include '/' too (the model can cite the home page's service areas).
  if (listingQuery && !sources.includes('/')) {
    sources = ['/', ...sources];
  }

  // Item 3: the canonical list of use-case page titles (listing page + one per
  // detail page), for the answer prompt + the test assertion that the model is
  // asked to enumerate every use case.
  const useCaseTitles = listingQuery
    ? knowledge
        .filter((k) => k.url === '/Use-Cases' || k.url.startsWith('/use-cases/'))
        .map((k) => ({ title: k.title, url: k.url }))
    : [];

  return {
    query,
    topScore: Math.round(topScore * 100) / 100,
    mode,
    top: ranked.map((r) => ({ url: r.ch.url, title: r.ch.title, score: Math.round(r.s * 100) / 100 })),
    chunks: selected,
    chars,
    sources,
    useCaseTitles,
    tokenEstimate: Math.round((BASE_CONTEXT_CHARS + chars) / 4),
  };
}

// ---------------------------------------------------------------------------
// buildQuery (item 3): a follow-up that is a pro-form / anaphoric reference
// ("how long did it take?", "what about this one?") must carry the previous
// user message so the entity from the prior turn is preserved. A
// self-contained follow-up that names its own entity ("What is EntraSync?",
// "what ACR pull identity did AKS use?") must stand alone, or an off-topic
// prior question ("Do you do AKS work?") will dominate retrieval.
//
// Discriminator = presence of a 1st/2nd/3rd-person pronoun or a demonstrative
// in the LATEST user message: those signal the answer depends on an earlier
// turn. Entity-bearing questions have none, so they are never concatenated.
// This keeps R11 ("How long did it take?" -> concat, AKS portal #1) working
// while fixing the case where a fresh entity question was wrongly dragged
// into the prior topic.
// ---------------------------------------------------------------------------
const ANAPHORA = /\b(it|its|this|that|these|those|they|them)\b/i;
export function isProForm(text) {
  return ANAPHORA.test(String(text || '').toLowerCase());
}
export function buildQuery(messages) {
  const users = (messages || [])
    .filter((m) => m && m.role === 'user' && typeof m.content === 'string');
  if (!users.length) return '';
  const latest = users[users.length - 1].content;
  if (isProForm(latest) && users.length >= 2) {
    return users[users.length - 2].content + ' ' + latest; // anaphoric -> carry prior turn
  }
  return latest; // self-contained (or first message) -> latest only
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
