# AppoSight Chatbot — Troubleshooting

Symptom → cause → fix. All fixes are scoped to this project. If a fix would
change a secret, deploy, or public content, stop and get approval first.

> **First move for almost any issue:** `npx wrangler tail apposight-chat` and
> grep for the 6-char `STAGE_ID` of the failing request, plus the `stage=` /
> `stageErr` names. Then check the `m_`/`t_`/`q_` KV entries for that window.

---

## "No answer / nothing shows in the widget"

**Cause (most common):** the model call failed and the worker emitted an SSE
`error` event, but the widget is still booting or the error path isn't rendered.
The classified cause is in the log.

**Diagnose:**
```bash
npx wrangler tail apposight-chat
# look for: stageErr model_error_404 | model_ttfb_timeout | model_error_5xx
```
- `model_404` → bad `GEMINI_MODEL` name or key lacks access. **Fix:** set the
  correct model id in `[vars]`, redeploy (see OPERATIONS (c)).
- `model_ttfb_timeout` → model too slow for the 8 s TTFB budget, or key/region
  issue. **Fix:** check key validity + model availability; consider a faster
  model.
- `model_error_5xx` → upstream transient. **Fix:** retry; if persistent, the
  worker already retried once on attempt-1.

---

## "3rd (or later) send hangs / stalls" (mobile)

**Cause:** stale Turnstile token (reuse/timeout) — the token was fetched once and
reused across sends.

**Fix (already in code, but if regressing):** the worker verifies a FRESH token
per send and transparently retries once on `timeout-or-duplicate` /
`invalid-input-response`. If you still see hangs, check `m_turnstile_*` KV
entries for `error_code: timeout-or-duplicate` — that means the client sent a
stale token. Regenerate the widget (`node build_knowledge.js`) and redeploy so
the current client-side fresh-token-per-send logic is live.

---

## "Answers changed / seem wrong after a content update"

**Cause:** stale knowledge base — `src/knowledge.js` was not regenerated after
editing site pages, so the worker is scoring chunks from old content.

**Fix:**
```bash
node build_knowledge.js
node --import ./test-cf-hook.mjs tests.js
git add chat-worker/src/knowledge.js chat-worker/src/widget.js
git commit -m "chat-worker: rebuild knowledge base"
npx wrangler deploy
```

---

## "Briefing answers are stale"

**Cause:** the chat Worker reads `BRIEFINGS` KV **live (read-only)**, so a
stale answer means the **briefing was never published** to the KV (main
Worker), not that the chat Worker is outdated.

**Diagnose:**
```bash
curl -s https://www.apposight.com/api/briefings | python3 -m json.tool | head
# does the expected date appear in briefings_index?
```
**Fix:** publish the briefing via the main Worker's
`POST /api/briefings/publish` (see OPERATIONS (f)). No chat-worker redeploy
needed — the chat Worker picks it up on the next question.

---

## "503 / service unavailable on chat"

**Cause:** the Durable Object limiter was unavailable and the worker is
**fail-closed** by design (it never falls back to a per-process counter in prod,
because that could under-count the global daily cap across isolates).

**Diagnose:** `wrangler tail` → look for `limiter unavailable` / `Limiter DO`
errors; check the DO class is deployed (`new_sqlite_classes = ["ChatLimiter"]`
in `wrangler.toml`).

**Fix:** confirm the `Limiter` DO + migration are present in the deployed config;
redeploy. If the DO is genuinely down, the worker correctly refuses rather than
over-serving — wait for CF DO recovery.

---

## "429 rate_limited_ip" / "429 daily_cap"

**Cause:** per-IP cap (`20/min`) or global daily cap (`300/day`) hit.

- `rate_limited_ip` — a single IP sent >20 requests in a minute. **Fix:** none
  needed (abuse/bug); if it's your own testing, wait a minute or use a different
  egress. Raise `PER_IP_PER_MINUTE` only with intent.
- `daily_cap` — the whole site hit `300` verified messages today. **Fix:** the
  daily counter is a KV key with a **24 h TTL** — it resets automatically at
  local midnight. If you genuinely need more, raise the `DAILY_CAP` var and
  redeploy.

> Note: the cap is only charged for **Turnstile-verified** requests (invalid
> tokens are rejected before the daily counter is incremented).

---

## "Widget served but old / not my edits"

**Cause:** you edited `chat-widget.js` but did **not** rebuild, or the browser
has a cached copy.

**Diagnose (served vs raw must match):**
```bash
SVC=$(curl -s https://www.apposight.com/api/chat-widget.js | sha256sum | cut -d' ' -f1)
RAW=$(sha256sum chat-worker/chat-widget.js | cut -d' ' -f1)
[ "$SVC" = "$RAW" ] && echo OK || echo MISMATCH
```
**Fix:** `node build_knowledge.js` → redeploy. Then hard-refresh the browser
(widget is served at `/api/chat-widget.js`; clear cache if needed).

---

## "403 on every send (even with a real token)"

**Cause:** Turnstile siteverify failing — mismatched `TURNSTILE_SITE_KEY` (var)
and `TURNSTILE_SECRET` (secret), or the token was generated for a different site
key, or wrong `Origin`.

**Diagnose:** `m_turnstile_*` KV entries show the `error_code`
(`invalid-input-response`, `invalid-secret`, etc.).

**Fix:**
- Ensure `TURNSTILE_SITE_KEY` (var, public) and the token were created with the
  SAME site key, and the form/origin matches `Origin` (allowlisted).
- Ensure `TURNSTILE_SECRET` matches the site key in the Turnstile dashboard.
- If you rotated the site key, update BOTH the var and the secret, redeploy.

---

## "Model says 'I don't have that on the site' too often (canned reply)"

**Cause:** retrieval found no chunk above threshold, so it fell through to the
canned "not on the site" answer. Usually the question is outside the site's
content, OR the knowledge base is stale (see above), OR the question is a
briefing-type question that wasn't routed to the briefing reader.

**Fix:**
1. Confirm it's actually a site question (not a briefing question).
2. Rebuild knowledge base if content is new.
3. Check `retrieval.js` thresholds / `briefings.js` intent routing if routing
   seems off — this is a code change, so scope + test before deploying.

---

## "Logs are full but I can't tell which request"

**Cause:** multiple requests interleave in `wrangler tail`.

**Fix:** every request gets a random 6-char `STAGE_ID` shared across its body
and stream `start()`. Pick one id from a known time and grep:
```bash
npx wrangler tail apposight-chat 2>&1 | grep '<the-6-char-id>'
```
The persistent `t_` KV entries also carry the stage + timing + attempt for the
same request, and the `q_` entry is the question (treat as sensitive — do not
copy to disk/chat/docs).

---

## Quick "is it live and healthy?" (read-only)

```bash
B=https://www.apposight.com
curl -s $B/api/chat/health            # expect {"ok":true}
curl -s -o /dev/null -w '%{http_code}\n' $B/api/chat/nonexistent-xyz   # 404
curl -s -o /dev/null -w '%{http_code}\n' $B/api/briefings              # 200
```
All three passing = worker is up, routing is correct, and the briefing KV is
readable. A failing one of these points to the specific subsystem above.
