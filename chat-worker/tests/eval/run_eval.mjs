/**
 * Retriever eval harness — NO model calls, NO network, NO KV.
 *
 * Drives the REAL production retrieval pipeline (src/retrieval.js):
 *   buildQuery(messages) -> rankAll(query) + retrieve(query)
 * and scores, against tests/eval/questions.json.
 *
 * Two complementary metrics are reported (both before AND after each change):
 *
 *   EFFECTIVE (what the user/model is actually served — mode-aware):
 *     top-1 hit : sources[0] is an accepted page
 *     top-5 hit : an accepted page is in the served sources OR in the top-5 rank
 *   RANK (pure chunk ranking, drives the BM25/synonym/followup tuning):
 *     rank top-1 : rankAll[0] page is accepted
 *     rank top-5 : an accepted page is in rankAll top-5
 *
 *   REJECTION : expect:[] questions (out-of-scope / injection) — a miss is a
 *               'grounded' mode (irrelevant content handed to the model).
 *               'social' (home+about only) counts as correctly rejected.
 *
 * Deterministic. Safe with plain `node` (retrieval.js has no cloudflare:workers
 * dependency). Writes a JSON result for before/after diff.
 *
 * Usage:  node tests/eval/run_eval.mjs [outfile]     (outfile defaults to latest.json)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildQuery, rankAll, retrieve, THRESHOLD } from '../../src/retrieval.js';

const here = dirname(fileURLToPath(import.meta.url));
const questions = JSON.parse(readFileSync(join(here, 'questions.json'), 'utf8')).questions;

const rows = [];
let scoreable = 0;
let effTop1 = 0, effTop5 = 0, rankTop1 = 0, rankTop5 = 0;
let rejected = 0, rejectable = 0;
const misses = [];
const falseGrounds = [];

for (const q of questions) {
  const query = buildQuery(q.messages);
  const ranked = rankAll(query);
  const retr = retrieve(query);
  const sources = retr.sources || [];
  const top1Url = ranked.length ? ranked[0].ch.url : null;
  const top5Urls = ranked.slice(0, 5).map((r) => r.ch.url);
  const expect = q.expect || [];
  const isScoreable = expect.length > 0;

  const e1 = isScoreable && expect.includes(sources[0]);
  const e5 = isScoreable && (expect.some((u) => sources.includes(u)) || expect.some((u) => top5Urls.includes(u)));
  const r1 = isScoreable && expect.includes(top1Url);
  const r5 = isScoreable && expect.some((u) => top5Urls.includes(u));

  if (isScoreable) {
    scoreable++;
    if (e1) effTop1++;
    if (e5) effTop5++;
    if (r1) rankTop1++;
    if (r5) rankTop5++;
    if (!e5) misses.push(q.id);
  } else {
    rejectable++;
    if (retr.mode !== 'grounded') rejected++;
    if (retr.mode === 'grounded') falseGrounds.push(q.id);
  }

  rows.push({
    id: q.id, cat: q.cat, query: query.slice(0, 78),
    mode: retr.mode, topScore: retr.topScore,
    src: sources, top1: top1Url, top5: top5Urls, expect,
    eff_top1: e1 || null, eff_top5: e5 || null, rank_top1: r1 || null, rank_top5: r5 || null,
  });
}

const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);
const result = {
  generated: new Date().toISOString(),
  threshold: THRESHOLD,
  counts: { total: questions.length, scoreable, rejectable },
  effective: { top1: { hits: effTop1, of: scoreable, pct: pct(effTop1, scoreable) }, top5: { hits: effTop5, of: scoreable, pct: pct(effTop5, scoreable) } },
  rank: { top1: { hits: rankTop1, of: scoreable, pct: pct(rankTop1, scoreable) }, top5: { hits: rankTop5, of: scoreable, pct: pct(rankTop5, scoreable) } },
  misses,
  rejection: { correctly_rejected: rejected, of: rejectable, rate_pct: pct(rejected, rejectable), false_grounds: falseGrounds },
  rows,
};

const label = process.argv[2] || 'latest.json';
const outPath = join(here, label);
writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');

console.log(`\n=== RETRIEVAL EVAL (threshold=${THRESHOLD}) -> ${label} ===`);
console.log(`EFFECTIVE top-1 : ${result.effective.top1.pct}%  (${effTop1}/${scoreable})   top-5 : ${result.effective.top5.pct}%  (${effTop5}/${scoreable})`);
console.log(`RANK      top-1 : ${result.rank.top1.pct}%  (${rankTop1}/${scoreable})   top-5 : ${result.rank.top5.pct}%  (${rankTop5}/${scoreable})`);
console.log(`REJECTION       : ${result.rejection.rate_pct}%  (${rejected}/${rejectable})  false grounds: ${falseGrounds.length ? falseGrounds.join(',') : 'none'}`);
console.log(`MISSES (no accepted page served): ${misses.length ? misses.join(', ') : 'none'}`);
console.log('');
for (const r of rows) {
  const mark = r.eff_top5 === null ? (r.mode === 'grounded' ? 'FG' : 'ok') : (r.eff_top1 ? 'E1' : (r.eff_top5 ? 'E5' : 'XX'));
  console.log(`  [${mark}] ${r.id.padEnd(4)} ${r.cat.padEnd(12)} ${r.mode.padEnd(8)} s=${String(r.topScore).padStart(6)} top1=${(r.top1 || '—').padEnd(28)} src=${JSON.stringify(r.src)} q="${r.query}"`);
}
console.log('');
