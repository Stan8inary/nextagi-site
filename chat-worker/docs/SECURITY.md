# AppoSight Chatbot — Security

Secrets, rotation, privacy, hardening. **Secret names only — values never in
code, repo, docs, logs, or shell history.**

## 1. Secrets inventory (names only)

| Worker | Secret (name) | Used for |
|---|---|---|
| `apposight-chat` | `GEMINI_API_KEY` | Gemini generateContent (auth header) |
| `apposight-chat` | `TURNSTILE_SECRET` | Turnstile siteverify (`/sitesverify`) |
| `www` (main) | `ADMIN_PASSWORD` | `/admin` Basic-auth |
| `www` (main) | `BREVO_API_KEY` | contact-form email relay |
| `www` (main) | `BRIEFINGS_PUBLISH_KEY` | `POST /api/briefings/publish` Bearer auth |

**Non-secret vars (chat):** `TURNSTILE_SITE_KEY` (public browser site key —
NOT a secret), `GEMINI_MODEL`, `DAILY_CAP`, and optional `GEMINI_THINKING_LEVEL`
+ timeout vars.

**Local-only:** `.dev.vars` (git-ignored) holds DEV test keys for
`wrangler dev` — it is **not** used by production and is never committed.

## 2. Rotation procedure

**Always via the Cloudflare UI** (Settings → Variables and Secrets → Secrets).
Never type a secret value into a terminal, chat, doc, or file — values must not
land in shell history or the repo.

1. UI → `apposight-chat` → Secrets.
2. `GEMINI_API_KEY` → paste new key. (Generate a fresh key in the Gemini
   console; revoke the old one after verifying chat works.)
3. `TURNSTILE_SECRET` → paste new secret. (Turnstile secrets pair with a site
   key — if the site key also changes, update the `TURNSTILE_SITE_KEY` **var**
   and the widget to match, then redeploy.)
4. Main Worker: `ADMIN_PASSWORD`, `BREVO_API_KEY`, `BRIEFINGS_PUBLISH_KEY` via
   the `www` worker's same UI panel.
5. Verify (no redeploy required for secret-only changes, but harmless):
   - chat: live check (dummy token → 403) + one real send.
   - main: one contact-form test + one admin login.

## 3. Privacy / data-handling guarantees (code-enforced)

- **Question log (`q_`)** stores the user's question text (30-day TTL) —
  **no IPs, no emails, no contact details**. Treat `q_` entries as sensitive:
  do not copy them into docs, chat, or files.
- **Timing log (`t_`)** stores stage/timing/attempt/outcome only — **no
  question text** (7-day TTL).
- **Issue log (`m_`)** stores the error code/reason — **never the Turnstile
  token, never the upstream response body, never a key** (30-day TTL).
- **KV write failures are non-fatal** — the chat still answers (or returns its
  classified error); the failure is counted per-isolate and logged without any
  secret or PII.
- **Upstream error bodies are never captured or propagated** — only the status
  code is recorded (404/403 bodies can contain key/account details).
- The chat Worker's `BRIEFINGS` binding is **read-only**; a test fails the
  suite on any `BRIEFINGS.put`/`delete` in chat-worker source.

## 4. Hardening summary (what the code enforces)

| Control | Mechanism |
|---|---|
| Body cap | `20000` raw bytes → `413 payload_too_large` |
| Per-message cap | `500` chars on user messages → `400` |
| History trim | assistant→`700` chars, keep last 2, total `6000` |
| Turn count | max `6` user turns → `400` |
| Per-IP rate | `20`/min via Durable Object → `429` |
| Daily cap | `300`/day (env var) via DO + 24h-TTL KV key → `429` |
| Fail-closed limiter | no per-process fallback in prod; DO down → `503` |
| Turnstile | siteverify on every send; fresh token per send; expired→retry once |
| Origin | allowlisted; foreign Origin/Referer → `403` (Option B on main) |
| PII in logs | none (enforced by design + leak scan) |
| Secret in logs | none (token / key / body never logged) |
| SSE stream caps | TTFB `8 s`, idle `15 s`, overall `45 s` |
| Model retry | once, only attempt-1 timeout/5xx-before-bytes |

## 5. Operational security rules

- **Preview before publish; verify live after.** Never deploy un-previewed.
- **Commit by file name only**; stage exactly the changed files.
- **Docs live in `chat-worker/docs/`** (not served, not in `worker/`).
- **Never write** secret values, tokens, API keys, passwords, customer data,
  question text, briefing text, or IPs into any file or doc.
- **`.dev.vars`** is local-only and git-ignored — never commit it.
- **Rollback / deploy** go through the verified commands in DEPLOY-RUNBOOK.md;
  a rollback is a state change — get explicit approval before running.
