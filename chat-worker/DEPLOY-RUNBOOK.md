# AppoSight Chat Worker — Production Deploy Runbook

Account:  982fdf0a67691f5cc01d6918ce69da58
Zone:     apposight.com  (www.apposight.com)
Date:     2026-10-05
RULES:    preview before publish · verify live after · NEVER print secrets.
         This runbook is commands-only. Do NOT run it until you approve each step.

AUTH: no token is stored in this file. Before any wrangler step, confirm the account:
  npx wrangler whoami   (run in STEP 0) — it must show the NextAGI account
  (ID 982fdf0a67691f5cc01d6918ce69da58).
  If it does not, set the token in your shell yourself, never in this file.

────────────────────────────────────────────────────────────────────────────────
STEP 0 — Preflight (read-only: tests, git log, whoami, KB checks — no state change.
           The two main-worker commits it references were made separately; git log shows them.)
────────────────────────────────────────────────────────────────────────────────
  cd /home/nextagi/public_html/chat-worker
  node --import ./test-cf-hook.mjs tests.js          # MUST be 87+ passed, 0 failed
  # BUILD STEP — required before tests AND deploy (regenerates src/widget.js from
  # chat-widget.js and src/knowledge.js from the main-worker page constants):
  #   node build_knowledge.js
  # After editing chat-widget.js or site content, run node build_knowledge.js
  # before testing and deploying. TO16 fails if src/widget.js is stale.
  git -C /home/nextagi/public_html status --short     # review the working tree
  ls -l .dev.vars                                       # confirm test-pair file exists (do NOT read it)

  ACCOUNT CHECK (AUTH — must show the NextAGI account BEFORE any wrangler step):
  npx wrangler whoami
  #    must list account 982fdf0a67691f5cc01d6918ce69da58 (NextAGI).
  #    The API token needs Workers Scripts Edit, Workers KV Storage Edit, and Zone Workers Routes Edit for apposight.com; a permission error at STEP 1 or STEP 4 means fix the scopes at dash.cloudflare.com/profile/api-tokens.
  #    If it does NOT show NextAGI, set the token in your shell first
  #    (export CLOUDFLARE_API_TOKEN=...) — never type it into this file.

  MAIN-WORKER COMMITS — already done separately (NOT run here; git log shows them):
  git -C /home/nextagi/public_html log --oneline -2
  #    b9be78c main-worker: add 14 chat-widget tags           (commit B — the 14-tag state, ships in STEP 8)
  #    22a0a62 main-worker: baseline before chat-widget tags  (commit A — pre-tag baseline)
  #    Both live in git history; STEP 8's main-worker deploy ships commit B.

  # NEVER COMMIT (must stay local / untracked):
  #   chat-worker/smoke-results.json   chat-worker/flood-results.json
  #   chat-worker/checkpoint-chatbot.md   (any *.bak* — e.g. wrangler.toml.bak-<ts>)
  #   chat-worker/.dev.vars                 (local test keys; git-ignored)

  # All 12 knowledge-base pages MUST return 200 on the LIVE site before deploy
  # (the KB is built FROM these pages; a non-200 means the KB is stale/broken).
  for p in "/" "/about" "/Use-Cases" "/use-cases/entrasync" "/use-cases/cis-benchmark-auditor" \
           "/use-cases/entra-cis-v2" "/use-cases/ad-onboarding" "/use-cases/dc-azure-deployment" \
           "/use-cases/dc-upgrade" "/use-cases/dc-azure-security" "/use-cases/aks-employee-portal" "/briefings"; do
    printf "%-42s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://www.apposight.com$p")"
  done
  # -> ALL 12 lines must read 200

  ROLLBACK TARGETS — record the CURRENT live version of each worker BEFORE any deploy,
  so rollback is always against the last known-good deploy:
  npx wrangler versions list | head                       # chat worker (apposight-chat)
    # NOTE (FIRST DEPLOY): `wrangler versions list` will ERROR / return empty for the
    # chat worker because it does not exist in CF yet. That is EXPECTED — capture the
    # error, do not treat it as a failure. There is no previous version to restore.
  (cd ../worker && npx wrangler versions list | head)     # main worker (www) — this one WILL list
  # NOTE: `wrangler deploy` uploads whatever is on DISK at deploy time — it does NOT
  # consult git. What is live after STEP 8 is exactly the worker/ tree as it sits on
  # disk, which already holds the 14 chat-widget tags (commit B, done separately —
  # git log shows commit A pre-tag baseline and commit B tag state in history).

  PRODUCTION TURNSTILE — from the CF Turnstile dashboard (NOT the .dev.vars test pair):
    • real SITE_KEY  (public, 1x0...)        -> [vars] TURNSTILE_SITE_KEY
    • real SECRET    (s0x..., sensitive)     -> wrangler secret TURNSTILE_SECRET
    HOSTNAME CHECK (BOTH DOMAINS): in the CF dashboard -> Security -> Turnstile ->
      widget, the "Hostnames" list MUST contain BOTH `www.apposight.com` AND
      `apposight.com`. A token issued for only one hostname will fail the origin
      check on the other. Add both before STEP 2.
  GEMINI key: create a NEW key in AI Studio (ai.google.dev) for the prod project NOW —
              do NOT reuse the .dev.vars key (that one stays local-dev-only).

────────────────────────────────────────────────────────────────────────────────
STEP 1 — Create the KV namespace (CHAT_LOG)
────────────────────────────────────────────────────────────────────────────────
  cd /home/nextagi/public_html/chat-worker
  npx wrangler kv namespace create CHAT_LOG
  # -> prints a new namespace with an "id". Capture that id.
  # IF wrangler OFFERS to update wrangler.toml for you: answer NO.
  #   The binding name MUST be exactly `KV_LOG` (src/limiter.js and src/index.js read
  #   env.KV_LOG). We add the [[kv_namespaces]] line ourselves in STEP 2 with the
  #   binding name KV_LOG and the captured id.

  VERIFY:   npx wrangler kv namespace list | grep CHAT_LOG        # shows name + id
  ROLLBACK: npx wrangler kv namespace delete <id>                # only safe if nothing is bound to it yet

────────────────────────────────────────────────────────────────────────────────
STEP 2 — Set wrangler.toml: KV id + real TURNSTILE_SITE_KEY  (then commit it)
────────────────────────────────────────────────────────────────────────────────
  # Backup first — the .bak-<ts> file is UNTRACKED (matched by the root `*.bak*`
  # ignore), so ROLLBACK must `cp` it back rather than `git checkout`:
  cp wrangler.toml wrangler.toml.bak-$(date +%Y%m%d)

  # Edit wrangler.toml (2 lines):
  #   [[kv_namespaces]] binding="KV_LOG"   id = "<id from STEP 1>"
  #   [vars]   TURNSTILE_SITE_KEY = "<real SITE_KEY>"          (GEMINI_MODEL and DAILY_CAP=300 stay as-is)

  VERIFY:   grep -nE 'id\s*=|TURNSTILE_SITE_KEY' wrangler.toml
           # id must be the real 32-hex id (not REPLACE_WITH_LOG_KV_ID)
           # site key must be the real 1x0... (not REPLACE_WITH_TURNSTILE_SITE_KEY)

  COMMIT the chat-worker (specific path — NEVER `git add -A`). First make sure the
  local-only artifacts are IGNORED so `git add chat-worker` cannot sweep them in:
  cd /home/nextagi/public_html
  printf 'smoke-results.json\nflood-results.json\ncheckpoint-chatbot.md\n' >> chat-worker/.gitignore
  git add chat-worker && git status --short
  #    review the staged list: .dev.vars, *.bak*, smoke-results.json,
  #    flood-results.json, checkpoint-chatbot.md must ALL be ABSENT (ignored, not staged)
  git commit -m "chat-worker: initial + KV_LOG id + TURNSTILE_SITE_KEY"
  ROLLBACK (toml): cp chat-worker/wrangler.toml.bak-<ts> chat-worker/wrangler.toml

────────────────────────────────────────────────────────────────────────────────
STEP 3 — (removed — secrets are now added AFTER the chat worker exists, in STEP 5)
────────────────────────────────────────────────────────────────────────────────
  Rationale: `wrangler deploy` (STEP 4) CREATES the `apposight-chat` worker in Cloudflare.
  `wrangler secret put` is then run in STEP 5 with a value already piped on its STDIN
  (via `read -rsp` + `printf '%s'`). If the worker does not exist yet, `secret put` can
  prompt to create it and consume STDIN — which would swallow the key we just piped and
  store an empty/malformed secret. Deploying first removes that ambiguity: the worker
  exists, so `secret put` has nothing to prompt about.

────────────────────────────────────────────────────────────────────────────────
STEP 4 — Deploy the CHAT worker FIRST (this CREATES it in CF; routes are MORE specific
         than the main worker's /*, so everything else keeps serving)
────────────────────────────────────────────────────────────────────────────────
  cd /home/nextagi/public_html/chat-worker
  npx wrangler deploy
  # -> note the deployment id / version id from the output (needed for rollback)
  # The worker now EXISTS in CF. Secrets are added in the NEXT step (STEP 5), and the
  # final content checks are STEP 6.

────────────────────────────────────────────────────────────────────────────────
STEP 5 — wrangler secret put x2   (AFTER the worker exists, in STEP 4 — NEVER printed)
────────────────────────────────────────────────────────────────────────────────
  cd /home/nextagi/public_html/chat-worker
  # GEMINI_API_KEY = the NEW key created in STEP 0. NOT the key in .dev.vars — that stays local.
  # HOW: read -rsp  ->  -s suppresses the echoed input, -p prints the prompt; the value
  #       is stored in a bash VARIABLE (never a command-line arg, so it never enters
  #       shell history).  printf '%s'  ->  pipes it to wrangler's STDIN with NO trailing
  #       newline, so the secret is stored byte-exact.  (wrangler 4.92.0 has NO --path
  #       flag — verified via `wrangler secret put --help`.)  The worker already exists
  #       (created in STEP 4), so `secret put` will NOT prompt to create it and will NOT
  #       steal the value from STDIN.
  read -rsp 'GEMINI_API_KEY  (NEW key, press ENTER): ' gk;  printf '%s' "$gk" | npx wrangler secret put GEMINI_API_KEY
  read -rsp 'TURNSTILE_SECRET (real s0x…, NOT the test pair, press ENTER): ' ts;  printf '%s' "$ts" | npx wrangler secret put TURNSTILE_SECRET
  unset gk ts        # drop the vars from the shell as soon as they are uploaded

  VERIFY:   npx wrangler secret list              # lists NAMES only (GEMINI_API_KEY, TURNSTILE_SECRET); values masked
  ROLLBACK: npx wrangler secret delete GEMINI_API_KEY
           npx wrangler secret delete TURNSTILE_SECRET

────────────────────────────────────────────────────────────────────────────────
STEP 6 — Content checks (proves the CHAT worker — not the main-worker catch-all — is
         serving /api/chat*)
────────────────────────────────────────────────────────────────────────────────
  # NOTE: a bare 200 is MEANINGLESS here. The main worker's catch-all returns 200 for
  # ANY path (it serves the homepage HTML). Before the chat worker is routed in, even
  # /api/chat-widget.js "200"s with the homepage. So every check below asserts the
  # BODY / CONTENT-TYPE, not just the status code.

  # --- /api/chat/health  -> must be a JSON body with "ok":true ---
  curl -s https://www.apposight.com/api/chat/health
  #    and require it to be valid JSON (either of these, pick one):
  curl -s https://www.apposight.com/api/chat/health \
       | python3 -c "import sys,json; json.load(sys.stdin)" && echo 'health: valid JSON'
  curl -s https://www.apposight.com/api/chat/health | grep -o '"ok":true'   # must print "ok":true

  # --- /api/chat/config  -> must be a JSON body carrying the real site key ---
  curl -s https://www.apposight.com/api/chat/config
  #    require valid JSON:
  curl -s https://www.apposight.com/api/chat/config \
       | python3 -c "import sys,json; json.load(sys.stdin)" && echo 'config: valid JSON'
  curl -s https://www.apposight.com/api/chat/config | grep -o '"turnstile_site_key"'   # present

  # --- /api/chat-widget.js  -> must be JS (not homepage HTML) ---
  # content-type must START with application/javascript (worker sets
  # 'application/javascript; charset=utf-8', src/index.js:609):
  curl -s -D - -o /dev/null https://www.apposight.com/api/chat-widget.js \
       | grep -i '^content-type:' | grep -i 'application/javascript' && echo 'widget: JS content-type OK'
  # AND the body's first line must START WITH "/*" (the served widget text,
  # src/widget.js:3 = export default "/*\n * AppoSight Chat Widget — v1…":
  # a homepage-HTML fallback would start with '<' or '<!doctype', never '/*'):
  curl -s https://www.apposight.com/api/chat-widget.js | head -c 2 | grep -q '/\*' && echo 'widget: first line is /*'

    IN-ROUTE 404 CHECK — target a path INSIDE /api/chat* that the worker does not
    map, so the request is served BY the chat worker and hits its own 404 handler
    (src/index.js:697  return json({ error: 'not_found' }, 404)):
    curl -s -o /dev/null -w '/api/chat/no-such (expect 404)  %{http_code}\n' \
         https://www.apposight.com/api/chat/no-such                                                 # 404
    # WHY /dev is NOT a valid check (reported 2026-10-05, read-only):
    #   * The chat worker's routes are ONLY `apposight.com/api/chat*` and
    #     `www.apposight.com/api/chat*` (wrangler.toml lines 10-13). A top-level
    #     /dev path does NOT match, so CF routes it to the MAIN worker, which has a
    #     catch-all that returns the homepage (200) — confirmed live today:
    #         https://www.apposight.com/dev  -> 200 (main-worker homepage HTML)
    #         https://apposight.com/dev      -> 301 (redirects to www)
    #   * The chat worker's own `/dev` 404 branch (src/index.js:689) is unreachable
    #     in prod because the route never dispatches there. So `/dev` can only be
    #     "404" on the chat worker if you hit it via `wrangler dev` locally, where
    #     DEV_ORIGIN is set. The correct in-prod 404 proof is the unmapped
    #     `/api/chat/no-such` path above.

    LIMITER HEALTH — exact production JSON body (src/index.js:616-626, limiter
    reachable — the HEALTHY case). This is the ONLY shape you should see in prod
    (fetch it with the /api/chat/health assertion above):
      -> {"ok":true,"daily_used":<int>,"today":"YYYY-MM-DD","ts":"<ISO-8601>"}
      • daily_used  = the per-day limiter counter (KV key `daily:<YYYY-MM-DD>`),
        read by ChatLimiter.stats() (src/limiter.js:83-86). This is the expected
        limiter field.
      • today       = the UTC date string the counter is keyed by.
      • ts          = the server timestamp of the probe.
    DEGRADED (Durable Object unreachable — src/index.js:621-624): the worker does
    NOT 503 the health probe; it still returns HTTP 200 but ADDS a fifth field:
      -> {"ok":true,"daily_used":0,"today":"YYYY-MM-DD","ts":"...","limiter":"unavailable"}
    The fail-closed 503 ("chat_unavailable") is returned by the /api/chat HANDLER
    (src/index.js:371,381,399,466), NOT by /api/chat/health. A 503 here would be a
    bug — investigate before continuing.

    (fetch with the /api/chat/config assertion above) -> JSON:
    {
      "turnstile_site_key": "<real 1x0...>",
      "max_message_chars": <int>,
      "contact_path": "/api/contact"
    }
    # (turnstile_site_key must be the real 1x0...; NO secret value; model is NOT
    #  in this response — it is a [vars] env, see wrangler.toml.)

  ROLLBACK (chat worker only — nothing else is affected):
    # FIRST-DEPLOY CASE (no previous version exists — `wrangler versions list`
    # returned an error / empty in STEP 0): the only rollback is to DELETE the
    # worker so the /api/chat* routes fall through to the main worker again.
    npx wrangler delete apposight-chat        # name is POSITIONAL (no --name flag; verified via --help)
    #   (add --dry-run first to preview, --force only if other workers depend on it)
    # AFTER-FIRST-DEPLOY CASE (a previous version exists): redeploy it.
    npx wrangler versions list | head                      # use the version recorded in STEP 0
    npx wrangler versions deploy <previous-version-id>     # redeploy the last-known-good chat worker

────────────────────────────────────────────────────────────────────────────────
STEP 7 — Headless sanity (proves the ROUTE is live and the worker validates — no browser)
────────────────────────────────────────────────────────────────────────────────
  curl -s -o /dev/null -w '%{http_code}\n' -X POST https://www.apposight.com/api/chat \
       -H 'Content-Type: application/json' -H 'Origin: https://www.apposight.com' \
       -d '{"messages":[{"role":"user","content":"What does AppoSight do?"}],"cf_turnstile_response":""}'
  # -> 403 turnstile_failed is EXPECTED (no real token) = worker is LIVE and validating.
  #    A 404/5xx here would mean the route is NOT active.
  # (Real browser verification is STEP 10.)

  ROLLBACK: n/a — this is a verification step, no state is changed.

────────────────────────────────────────────────────────────────────────────────
STEP 8 — Deploy the MAIN worker (this is what ships the 14× <script src="/api/chat-widget.js"> tags)
────────────────────────────────────────────────────────────────────────────────
  cd /home/nextagi/public_html/worker
  npx wrangler deploy
  # -> note the deployment / version id (rollback reference)

  VERIFY — 14 public pages carry the widget (12 FIXED + 2 DYNAMIC); /admin carries ZERO
  (the widget must NOT leak into the admin console). Each page must show widget=1:
  #   FIXED (12):      /  /about  /Use-Cases  /use-cases/* (8)  /briefings
  #   DYNAMIC (2):     /weekly-analysis/<latest-slug>  and  /briefings/<latest-slug>
  for p in "/" "/about" "/Use-Cases" \
           "/use-cases/entrasync" "/use-cases/cis-benchmark-auditor" \
           "/use-cases/entra-cis-v2" "/use-cases/ad-onboarding" \
           "/use-cases/dc-azure-deployment" "/use-cases/dc-upgrade" \
           "/use-cases/dc-azure-security" "/use-cases/aks-employee-portal" \
           "/briefings" "/weekly-analysis/<latest-slug>" "/briefings/<latest-slug>"; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "https://www.apposight.com$p")
    w=$(curl -s "https://www.apposight.com$p" | grep -c 'chat-widget.js')
    printf "%-44s http=%s widget=%s\n" "$p" "$code" "$w"
  done
  # -> the 12 FIXED pages: http=200 widget=1 each.
  # -> the 2 DYNAMIC pages: replace <latest-slug> with the NEWEST slug from the
  #    /weekly-analysis and /briefings listings; each must also be http=200 widget=1.
  curl -s -o /dev/null -w '/admin (expect 0 widget)  http=%{http_code}\n' \
       https://www.apposight.com/admin
  curl -s https://www.apposight.com/admin | grep -c 'chat-widget.js'   # -> 0

  # (commit B — the main-worker tag commit — is ALREADY DONE: `b9be78c main-worker:
  #  add 14 chat-widget tags`, on top of commit A `22a0a62 baseline before chat-widget
  #  tags`. Both were made separately in PART 1; git log shows them. Do NOT re-commit
  #  here — the 14-tag state is already the committed HEAD of worker/src/index.js.)

  ROLLBACK (main worker only):
    npx wrangler versions list | head
    npx wrangler versions deploy <previous-version-id>                # the version recorded in STEP 0
    # Git safety net (separate from the CF version rollback):
    #   commit A = pre-tag baseline is in git history (22a0a62 "baseline before
    #   chat-widget tags"); commit B = the 14-tag state (b9be78c) is HEAD. If the tags
    #   must be stripped from the source, `git checkout 22a0a62 -- worker/src/index.js`.

────────────────────────────────────────────────────────────────────────────────
STEP 9 — Cache purge (edge cache can serve stale HTML up to 24h after a deploy)
────────────────────────────────────────────────────────────────────────────────
  Primary (dashboard — no token needed):
    Purge Everything in the dashboard: Caching > Configuration

  Optional API variant (full-zone purge; I will fill in the three Authorization lines):
  #   ZONE=<apposight.com zone id>
  #   curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/purge_cache" \
  #        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  #        -H "Content-Type: application/json" -d '{"purge_everything":true}'
  #   # -> expect {"success":true,"errors":[],"messages":[],"result":null}

  VERIFY (site is fresh, widget still present):
    curl -s -o /dev/null -w '%{http_code}\n' https://www.apposight.com/    # 200 (fresh)
    curl -s https://www.apposight.com/ | grep -c 'chat-widget.js'          # 1 (not a broken purge)

  ROLLBACK: n/a — a purge is non-destructive (worst case: content is stale again until the next purge).

────────────────────────────────────────────────────────────────────────────────
STEP 10 — Real browser widget test (canonical acceptance)
────────────────────────────────────────────────────────────────────────────────
  Browser (real network, incognito preferred — the real Turnstile challenge auto-passes in a real browser):

  1. Open https://www.apposight.com  -> chat bubble appears bottom-right; click it.
  2. Ask 3 questions, one at a time, wait for each streamed answer:
       a. "What does AppoSight do?"              -> streamed answer
       b. "How long did the DC upgrade take?"    -> qualitative answer, NO exact day/week figure
       c. "pricing"                              -> lead form appears (name / email / message)
     CHECK after each: text renders token-by-token; footer reads:
       "AI assistant. Chats may be processed by Google. Don't share sensitive information.
        Questions are logged to improve this assistant.  Contact us"
  3. Submit ONE lead form: real name, real email, short test message
     (e.g. "deploy verification — please ignore") -> Send.
     CHECK: "Thank you! We'll get back to you soon." appears in the widget.
  4. Verify Brevo delivery:
     - admin inbox: one new email with the name + test message; no duplicate, no error.
     (Optional, read-only: the main worker logged
      "New contact from <name> <email> - ID <uuid>" — wrangler tail | grep "New contact")
  5. Negative control: in one minute, the 21st question -> expects the rate-limit
     message (PER_IP_PER_MINUTE=20), not a crash.

  ROLLBACK: n/a — test only. If the WIDGET is broken, roll back the MAIN worker
           (STEP 8 ROLLBACK); if the CHAT API is broken, roll back the CHAT worker
           (STEP 6 ROLLBACK).

  /api/contact — verified facts (worker/src/index.js handleContactForm, worker/wrangler.toml):
    • RATE-LIMITED: yes — binding RATE_LIMIT exists on the main worker; 10 POSTs per IP
      per 30 minutes (KV key contact_rate:<ip>, TTL 1800s) -> 429 "Too many requests".
    • WIDGET PAYLOAD ACCEPTED: yes — required: name, email (format-validated), message;
      phone is OPTIONAL: the widget sends phone:'' and the worker maps it to null.
      Widget body {name, email, phone:'', message:'…\n\n(via AppoSight chat assistant)'}
      passes validation; all fields are sanitized before KV store + Brevo send.

────────────────────────────────────────────────────────────────────────────────
POST-DEPLOY WATCHLIST
────────────────────────────────────────────────────────────────────────────────
  • KV alert log (status-code-only, safe to read): look for keys m_model_404_* and m_model_error_429_*
      cd /home/nextagi/public_html/chat-worker
      npx wrangler kv key list --remote --binding KV_LOG --prefix m_
      # flags verified against `npx wrangler kv key list --help` (wrangler 4.92.0):
      #   --namespace does NOT exist; valid flags are --binding / --namespace-id + --remote.
  • should be EMPTY if healthy.
  • m_model_error_429_* = Gemini quota exhausted (free-tier RPD/RPM burned) — wait for the
      midnight-Pacific reset, or verify your key's live limits in AI Studio before re-testing.
  • If you ever see m_model_404_*, the configured GEMINI_MODEL was deprecated:
      bump [vars] GEMINI_MODEL to a current model, redeploy chat worker (STEP 4), re-verify.
  • Rate limits: PER_IP_PER_MINUTE=20 (code constant), DAILY_CAP=300 (wrangler.toml [vars] — changeable without a code edit).
      To change the per-IP cap: edit PER_IP_PER_MINUTE in src/index.js, redeploy, re-run flood_run.py.
  • /api/contact (main worker): 10 POSTs/IP/30min via RATE_LIMIT KV — if STEP 8's lead
      email never arrives, check this cap and the Brevo inbox/spam first.
  • If the /api/chat* routes STOP being served by the chat worker (STEP 4 VERIFY starts
      returning the main-worker homepage), the first thing to check is whether someone
      ran `wrangler delete apposight-chat` (see STEP 6 ROLLBACK) — re-deploy the chat
      worker to restore the routes.
