# Retrieval eval (no model calls)

Deterministic harness that drives the REAL production retrieval pipeline
(`src/retrieval.js`) over `questions.json` and reports hit rates. No network,
no KV, no Gemini — safe to run with plain `node`.

## Run
```
node tests/eval/run_eval.mjs [outfile.json]   # defaults to latest.json
```

## Metrics
- **EFFECTIVE** (what the user/model is actually served — mode-aware):
  `top-1 hit` = served `sources[0]` is an accepted page;
  `top-5 hit` = an accepted page is in served sources OR the top-5 rank.
- **RANK** (pure chunk ranking — drives BM25/synonym/followup tuning):
  `rank top-1/5` against `rankAll()` order.
- **REJECTION**: `expect:[]` questions (out-of-scope / injection). A miss is a
  `grounded` mode (irrelevant content handed to the model). `social`
  (home+about only) counts as correctly rejected. Note: prompt-injection
  refusal is guaranteed by the system prompt (untrusted reference_data), NOT by
  the retrieval threshold — several injection questions score high because they
  contain domain words (AD, credential, key, email).

## Files
- `questions.json` — 40 questions (10 simple, 8 two-page, 8 follow-up,
  6 synonym, 4 out-of-scope, 4 injection) + accepted source pages.
- `run_eval.mjs` — the harness (imports `buildQuery`, `rankAll`, `retrieve`).
- `baseline.json` — STEP-0 baseline (before any RAG changes).
- `after_<step>.json` — post-improvement snapshots.

## Baseline (STEP 0)
- EFFECTIVE top-1 71.9% (23/32), top-5 90.6% (29/32)
- RANK      top-1 65.6% (21/32), top-5 81.3% (26/32)
- REJECTION 12.5% (1/8); false grounds OS1,OS2,OS4,I1,I2,I3,I4
- Misses: T6, F7, Y5
