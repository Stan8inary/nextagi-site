# AppoSight Chatbot — Operations (day-to-day)

Every command below runs from `public_html/chat-worker` unless stated. **No
command in (a)–(f) touches secrets.** Secrets are rotated only via the Cloudflare
UI (see (d)).

> **Ground rules (every task):**
> - Preview before publish; verify live after.
> - Commit **by file name only**; stage exactly the files you changed.
> - `docs/` and `chat-widget.js` live outside `worker/` and are **not** served.
> - Do **not** hand-edit `src/knowledge.js` or `src/widget.js` — regenerate.

---

## (a) Update site content → rebuild → test → deploy

When the site pages change (or `chat-widget.js` changes), the knowledge base and
widget bundle must be regenerated before deploying.

```bash
cd /home/nextagi/public_html/chat-worker

# 1. Regenerate src/knowledge.js AND src/widget.js from the current main-worker
#    pages + chat-widget.js. Idempotent, read-only on worker/.
node build_knowledge.js

# 2. Run the full suite (deterministic, no network):
node --import ./test-cf-hook.mjs tests.js
#    expected: "RESULT: 156 passed, 0 failed"

# 3. Commit by name (stage EXACTLY these two generated files):
git add chat-worker/src/knowledge.js chat-worker/src/widget.js
git commit -m "chat-worker: rebuild knowledge + widget (content update)"

# 4. Dry-run (syntax/config check, no deploy):
npx wrangler versions upload
#    (or) npx wrangler deploy --dry-run   -- verify it parses + shows bindings

# 5. Deploy the chat worker:
npx wrangler deploy
```

### Post-deploy live checks (run these, expect exactly these results)

Base: `https://www.apposight.com`

```bash
B=https://www.apposight.com

# 1. Config JSON — expect 200 + JSON (site key + model name, no secrets)
curl -s $B/api/chat/config; echo " -> $(curl -s -o /dev/null -w '%{http_code}' $B/api/chat/config)"
#    expected: 200

# 2. Health — expect ok:true
curl -s $B/api/chat/health
#    expected: {"ok":true}  + 200

# 3. No-such path — expect 404
curl -s -o /dev/null -w "%{http_code}\n" $B/api/chat/nonexistent-xyz
#    expected: 404

# 4. Empty Turnstile token POST — expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST $B/api/chat \
  -H "Content-Type: application/json" -H "Origin: https://www.apposight.com" \
  -d '{"messages":[{"role":"user","content":"hi"}],"cf_turnstile_response":""}'
#    expected: 403

# 5. Dummy Turnstile token POST — expect 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST $B/api/chat \
  -H "Content-Type: application/json" -H "Origin: https://www.apposight.com" \
  -d '{"messages":[{"role":"user","content":"hi"}],"cf_turnstile_response":"dummy-invalid-token-xyz"}'
#    expected: 403

# 6. Served widget sha256 must EQUAL the raw chat-widget.js
SVC=$(curl -s $B/api/chat-widget.js | sha256sum | cut -d' ' -f1)
RAW=$(sha256sum chat-widget.js | cut -d' ' -f1)
[ "$SVC" = "$RAW" ] && echo "OK served==raw" || echo "MISMATCH — rebuild needed"
#    expected: "OK served==raw"

# 7. /api/briefings — expect 200 + JSON
curl -s -o /dev/null -w "%{http_code}\n" $B/api/briefings
#    expected: 200
```

Verified 2026-10-11: all 7 checks pass; `SVC == RAW` (served widget is the raw
`chat-widget.js` string, **not** the JS-wrapper `src/widget.js`).

---

## (b) Edit the widget (`chat-widget.js`)

**You MUST rebuild, or the OLD widget keeps being served.** The worker serves the
raw `chat-widget.js` string; `src/widget.js` is just the bundle copy.

```bash
# 1. Edit chat-widget.js
$EDITOR chat-worker/chat-widget.js

# 2. Rebuild the bundle (required — otherwise stale widget is served):
node build_knowledge.js

# 3. Test + deploy (see (a) steps 2–5)
node --import ./test-cf-hook.mjs tests.js
git add chat-worker/src/widget.js chat-worker/src/knowledge.js
git commit -m "chat-worker: widget edit (rebuild)"
npx wrangler deploy
```

Sanity-check with live check #6 (served sha256 must equal the new `chat-widget.js`).

---

## (c) Change the model

The model name comes from the `GEMINI_MODEL` var; the thinking setting from
`GEMINI_THINKING_LEVEL` (default `MINIMAL`).

```bash
# 1. Model name + thinking level are NON-SECRET VARS ([vars] in wrangler.toml),
#    NOT secrets. Edit them in wrangler.toml (or the UI vars tab), then redeploy:
#    [vars]
#    GEMINI_MODEL = "gemini-<model>-<size>"
#    GEMINI_THINKING_LEVEL = "MINIMAL"
#    (wrangler.toml already sets GEMINI_MODEL=gemini-3.5-flash-lite, DAILY_CAP=300)

# 2. Deploy (vars are applied on deploy):
npx wrangler deploy

# 3. Latency check — send a real message and watch first-byte time:
#    (watch for ~sub-2s TTFB with gemini-3.5-flash-lite)
curl -s -N -X POST https://www.apposight.com/api/chat \
  -H "Content-Type: application/json" -H "Origin: https://www.apposight.com" \
  -d '{"messages":[{"role":"user","content":"what services do you offer?"}],"cf_turnstile_response":"<real token>"}' \
  -w "\nTTFB=%{time_starttransfer}\n"
```

**On a model 404** (bad model name / not available to your key):
- The worker does NOT retry a 404. It logs `m_ model_404`, writes a `t_` outcome
  of `error`, and emits an SSE `error` event (`model_unavailable`). The user sees
  a clean "service temporarily unavailable" — not a stack trace.
- Fix = correct the `GEMINI_MODEL` var (verify the exact model id against your
  Gemini project + key's access), re-deploy, re-run the latency check.

---

## (d) Rotate secrets (Gemini key, Turnstile secret)

**Rotate via the Cloudflare UI — never in shell history.**

1. Cloudflare Dashboard → Workers & Pages → `apposight-chat` → Settings →
   **Variables and Secrets** → **Secrets**.
2. `GEMINI_API_KEY` → paste the new key (do NOT paste into a terminal; the value
   will not land in `~/.zsh_history`).
3. `TURNSTILE_SECRET` → paste the new Turnstile siteverify secret.
   - Turnstile secrets are paired with a site key. If you also change the site
     key, update the `TURNSTILE_SITE_KEY` **var** to match, and redeploy.
4. Re-deploy (not strictly required for secret-only changes, but harmless):
   `npx wrangler deploy`
5. Verify with live check #5 (dummy token must still 403) and a real chat send.

Main Worker (`www`) secrets, same UI flow, by name: `ADMIN_PASSWORD`,
`BREVO_API_KEY`, `BRIEFINGS_PUBLISH_KEY`.

> `.dev.vars` is **local-only** (git-ignored). It is used only by `wrangler dev`.
> Production reads the account vars/secrets above. Do not add prod secrets to
> `.dev.vars` and do not commit it.

---

## (e) Deploy & rollback (BOTH workers)

### Deploy

```bash
# chat worker
cd /home/nextagi/public_html/chat-worker && npx wrangler deploy
# main worker
cd /home/nextagi/public_html/worker && npx wrangler deploy
```

### Find the CURRENT LIVE version (read-only)

```bash
npx wrangler deployments list --json
```

> **ORDERING TRAP (misread this once):** `deployments list --json` returns entries
> in **ascending `created_on` order** — `items[0]` is the OLDEST (e.g. the
> 2026-09-06 www baseline), and the **live version is the LAST (newest) entry**.
> The live `version_id` is `deployments[deployments.length-1].versions[0].version_id`.
> Do **not** take the first entry — that is the oldest, not the current one.

Verified current state (2026-10-11):
- `www` live: `05963f28-625f-4a29-8af2-7fa9e5e95a7c`
- `apposight-chat` live: `69f1b50d-df73-4f34-816b-85ec689f2d19`

### Rollback

Use the **version id** (not the deployment id). Verified syntax:

```bash
# chat worker — roll back to a previous version:
cd /home/nextagi/public_html/chat-worker && npx wrangler rollback <version-id>

# main worker:
cd /home/nextagi/public_html/worker && npx wrangler rollback <version-id>
```

(Example target for a www rollback is the pre-deploy live version, e.g.
`56e98db0-6784-48b4-9ff7-59ed53a950ad`.)

After rollback, re-run the live checks in (a) to confirm the restored version
serves correctly.

---

## (f) Publishing briefings (how the chatbot reads them live)

The **main Worker** writes the `BRIEFINGS` KV namespace; the **chat Worker reads
it live (read-only)** — so a newly published briefing is answerable by the chat
immediately, with **no chat-worker redeploy**.

Main-Worker write path (`worker/src/index.js`):
- `POST /api/briefings/publish` (auth: `Authorization: Bearer <BRIEFINGS_PUBLISH_KEY>`)
  - stores the briefing at key `<date>` and updates `briefings_index`
  - keeps the last **90** entries; prunes older ones (`BRIEFINGS.delete`).
- `GET /api/briefings` → the `briefings_index` list (date, counts).
- `GET /api/briefings/<date>` → the briefing detail (HTML) or JSON.

Chat-Worker read path (`src/briefings.js`):
- On a question, if intent = briefing, it reads `BRIEFINGS` KV (`<date>` and/or
  `briefings_index`) to build a **date-grounded** system-prompt addition.
- Because it reads live KV, publishing on the main Worker is enough — the chat
  Worker needs **no redeploy** for new briefings to be reflected.

So: publish a briefing on the main Worker → it is instantly visible to the
`/api/briefings` page **and** usable by the chatbot.

---

## (g) Tail debugging (live logs)

Watch the chat Worker's live logs to see per-request stages:

```bash
# live tail (chat worker) — shows [chat] stage=... lines
npx wrangler tail apposight-chat
```

Useful `stage` / `stageErr` markers to grep for:
- `request_received`, `body_ok`, `limiter_ok`, `turnstile_ok`, `first_byte`
- `briefing_resolved`, `retrieval_done`, `model_start`, `stream_done`
- errors: `model_call_attempt1`, `model_error_404`, `model_ttfb_timeout`,
  `model_error_5xx`, `kv_write_fail` (KV put failure, non-fatal)

For a single request, the logs include a random 6-char **`STAGE_ID`** shared
across the request body and the stream's `start()` — grep for that id to follow
one request end-to-end.

`m_`/`t_`/`q_` KV entries (the persistent log) can be inspected read-only:
```bash
# list recent keys (prefix q_, t_, m_)
npx wrangler kv key list --binding KV_LOG | tail -40
```

> **Do not print secret values, question text to disk, or customer data.** The
> `q_` entries contain question text by design — treat them as sensitive and do
> not copy them into docs or chat.
