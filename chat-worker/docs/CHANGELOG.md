# AppoSight Chatbot — Changelog

Dated history of what was built and deployed. Sources: `git log` and
`wrangler deployments list` (read-only). Version ids are the live/rollback
references. **Newest first.**

> **Ordering note (verified):** `wrangler deployments list --json` returns
> entries **ascending by `created_on`** — `items[0]` is the OLDEST, and the
> **live version is the LAST (newest)** entry. Do not take the first entry.

## 2026-10-11

- **`www` (main Worker) — contact-form hardening** (commit `16f5dad`)
  - Brevo status handling (success = any 2xx; failure recorded as code only),
    PII-safe logging (no names/emails/messages), Option-B origin handling,
    parallel Brevo sends each capped at 5 s.
  - Deployed `www` → live version `05963f28-625f-4a29-8af2-7fa9e5e95a7c`.
  - Rollback target (pre-deploy live): `56e98db0-6784-48b4-9ff7-59ed53a950ad`.
  - Tests: 54 passed, 0 failed. Leak scan clean. Live checks: 14 public pages
    200 + 1 widget; `/admin` 200 + 0; foreign-Origin POST `/api/contact` → 403;
    `/api/briefings` valid JSON; `/api/chat/health` `ok:true`.

- **`apposight-chat` — content + model fixes** (commit `12a28ec`)
  - True briefing range, `MAX_TOKENS` note, weekly wording, brand service areas,
    KV write reduction.
  - Live chat version: `69f1b50d-df73-4f34-816b-85ec689f2d19`.
  - Tests: 156 passed, 0 failed.

## 2026-10-10

- **`apposight-chat`** (commits `d7879e2`, `9c58577`)
  - Early SSE `status` (first bytes before KV/model), model retry-once,
    pre-model timeouts, stage logging, widget no-byte retry.
  - Briefing retrieval from KV, date-grounded answers, assistant-history
    truncation, listing includes home/about.

## 2026-10-08

- **`apposight-chat`** (commit `8180179`)
  - `waitUntil` logging, prompt rule fixes, listing mode, brand answer, link
    rendering, style cleanup.

## 2026-10-07

- **`apposight-chat`** (commits `babaf7a`, `c05fa9e`, `e384c28`, `8d4a39c`)
  - Fresh Turnstile token per send, expired-token retry (fix 3rd-send mobile
    hang), strip model `Sources` block, order chips by score, rebuild widget
    (client timeouts), timeouts + latest-message retrieval + source chips +
    MINIMAL thinking + `t_` timing log.

## 2026-10-06

- **`apposight-chat` + `www`** (commits `98a398a`, `24a319d`, `09aeef5`)
  - Account/KV ids verified identical; DV6 accepts production site key, rejects
    Cloudflare test keys; initial `KV_LOG` id + `TURNSTILE_SITE_KEY`.

## 2026-10-05

- **`www` (main Worker) — chat widget integrated into the site** (commits
  `b9be78c`, `22a0a62`)
  - Added 14 `chat-widget` tags across the public pages (baseline taken first).

## 2026-08-13 (baseline)

- **`www` (main Worker)** (commits `7a11d84`, `71b283c`)
  - Fixed KV namespace ids + `account_id`; added briefings API, weekly
    analysis, and site content — the original main-Worker baseline.

## Notes

- The chat Worker project (`apposight-chat`) shipped as its own Worker starting
  2026-10-06 (KV/site-key wiring), with iterative hardening through 2026-10-11.
- `DAILY_CAP` in production = **300** (env var in `wrangler.toml`); the code
  fallback is `500` but is overridden by the var.
- All deployments verified with the live-check suite in OPERATIONS.md (a).
