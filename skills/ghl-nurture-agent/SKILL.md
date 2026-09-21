---
name: ghl-nurture-agent
description: Build and operate a GoHighLevel lead-nurture / call-list / reactivation agent (gather the interested-universe from pipelines + tags... filter... Claude rank... Telegram), and the hard-won GHL gotchas behind it. Use when building, fixing, or extending a GHL-driven outreach agent, architecting candidate intake as a pipelines+tags union, excluding members from a lead list, rotating fresh leads daily with a cooldown, building a tag-triggered outreach tagger (bot tags, HighLevel workflows send), staging a live rollout behind a DRY_RUN flag, adding transient-retry resilience to the shared GHL client, gathering a large pool cheaply via paginated search, scanning an agent bundle before pushing, or diagnosing why a scheduled GHL/Claude/Telegram job failed. Triggers on words like GoHighLevel, GHL, LeadConnector, call list, nurture agent, reactivation, tagger, lead list, pipeline stage, opportunity, contact tags, member exclusion, hygiene filter, DND, suppression, cooldown, rotation, idempotency, DRY_RUN, ReadTimeout, retry, token error, contact search, pagination, Telegram bot, GitHub Actions cron, `<NURTURE_REPO>`.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# GHL Nurture Agent (build + operate playbook)

Everything below was learned live building the JJO call-list agent
(a private GitHub repo): a scheduled GitHub Action that gathers the
interested-lead universe from GoHighLevel, filters it, ranks by
likelihood-to-answer via Claude Haiku, and posts a rotating daily call list
plus an appointment report to Telegram. The project-specific tag/pipeline names
are JJO's; the patterns hold for any GHL outreach agent. Pairs with
[verify-before-asserting](../verify-before-asserting/SKILL.md), [report-back](../report-back/SKILL.md), [secretless-static-deploy](../secretless-static-deploy/SKILL.md) (the
secrets-scan spirit), and the commerce-wing guardrails
(private note, not included).

## Architecture (the shape that worked)

`main.py` runs top-to-bottom on a schedule:
1. **Gather** the candidate pool as a deduplicated UNION of two cheap, paginated
   sources (see the intake section below): pipelines (A) + interest tags (B),
   keyed by contact ID.
2. **Filter cheaply** off the search payloads (no per-contact calls): member/`<offer-code>`
   exclusion, phone-required, DND/STOP, then the 14-day cooldown rotation.
3. **Rank** a bounded top-slice through Claude (Haiku is the right cost tier for
   lead-ranking... do NOT reflexively upgrade the model).
4. **Enrich survivors only** ... fetch full detail (notes, granular DND) for just
   the ~30 that make the final list, never the whole pool.
5. **Deliver** to Telegram; echo a phone-masked copy + the funnel counts to the
   run log. Listed contacts get tagged `call-list-<date>` (the cooldown reads
   this back); suppressed ones `hygiene-suppressed`.

Secrets are all `os.environ[...]` (`GHL_TOKEN`, `GHL_LOCATION_ID`,
`ANTHROPIC_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`), injected by the
workflow from GitHub repo secrets. Never hardcoded, never in the repo.

## Where the interested-universe actually lives: pipelines + tags, not conversations

Lead every intake rebuild with this correction. The original intake read interest
from the conversations + calendar endpoints on a 90-day window and saw only under a hundred
contacts. That endpoint **silently returns only recent threads**, so a probe
against it reports a confident wrong denominator... well over a thousand tagged-but-quiet
contacts were invisible to it, and the under-a-hundred reading nearly killed a correct
rebuild. A full contact **CSV export** (ground truth when a probe and the
operator's instinct disagree... see [measure-before-build](../measure-before-build/SKILL.md)) settled it: the real
universe is **more than ten times that in the pipelines+tags union, about three-quarters callable after
filters**. Interest in this CRM lives in the **pipelines** and the **tag
universe**, not in recent messages. Rebuild intake as a deduplicated union, then
filter (member / phone-required / full DND) → 14-day cooldown → rank:

- **Source A (primary) ... pipelines.** Walk the target lead pipelines, pull
  every opportunity's contact from all stages EXCEPT converted/member stages
  (reuse the one `stage_is_member()` definition so "converted" means the same
  thing here and in the member-suppression scan).
- **Source B (secondary) ... tags.** Sweep the whole contact base for any of the
  interest tags (`replied`, `challenge`, `new lead`, `jjo free class`, `trial`,
  `scheduled`, `scholarship-*`, `facebook *`, `not engaged`, `cold`, ...).
- **Dedupe by contact ID**, merging fields (union tags, keep the richest record).
- Don't trust one endpoint's view as "all-time." The conversations endpoint
  returned under a hundred "complete" and was simply the wrong lens... measure the pool from
  the source it actually lives in (pipelines + tags), or from an export.

## Gather cheap, enrich only survivors (the API-volume law)

A 1,000+ pool with the naive one-GHL-call-per-contact pattern is thousands of
sequential calls per run... rate-limit death, twice a day. The safe shape:

- **Gather candidate IDs + filterable fields via paginated SEARCH**, never
  per-contact GETs. `POST /contacts/search` (tag filter, paginate via the
  `searchAfter` cursor) and `GET /opportunities/search` (per pipeline stage,
  page-based) both return `tags` + `phone` per record ... enough to filter the
  whole pool for free.
- **Apply every cheap filter from the search payload**, tracking a funnel count
  at each step (source A total, source B total, after dedupe, after each filter,
  final). Print it on the first run.
- **Fetch full per-contact detail ONLY for the ~30 survivors** that make the
  ranked list (notes for the reason lines, and the granular DND re-check below).
  Enrichment is bounded to ~list-size per run, not pool-size.
- **The ranker can under-return.** Asked for top N, Haiku may hand back fewer.
  Backfill the list to CALL_LIST_SIZE from the deterministic pre-sort (recency +
  fresh-before-cooling + hot-before-cold), with a derived reason line for the
  backfilled entries.

## Cooldown rotation: fresh leads daily, no repeats, never empty

The list rotates so a contact called today doesn't resurface for two weeks:

- **Stamp** every listed contact `call-list-<date>` at delivery.
- **Read those tags back** at the top of the next run and exclude anyone stamped
  within the last 14 days... that read-back IS the rotation.
- **Backfill guard so the list never empties.** If the 14-day exclusion would
  starve the list below CALL_LIST_SIZE (a small pool, or a stretch of heavy
  recent calling), relax the cooldown oldest-stamp-first until the list fills,
  rather than ship a short list. A rotation that can silently empty is a rotation
  that silently stops.
- This is a DIFFERENT backfill from the ranker-under-return one above: that one
  guards against Haiku handing back too few, this one guards against the cooldown
  starving the pool. Two guards, both needed.

## Tag-triggered outreach: the bot tags, an external system sends

The reactivation tagger (`reactivate.py`, own morning schedule) never sends SMS.
It selects leads and applies tags; HighLevel workflows trigger on those tags and
do all sending. Clean split... no new API scopes, and the bot's only write is
the same add-tag it already does. When the "sender" is a workflow you don't own,
the agent's job is to feed it the right contacts safely. That safety stack:

- **Add-tag semantics, never write the full tag array.** `POST /contacts/{id}/
  tags` with `{"tags":[...]}` ADDS; a PUT of the whole array clobbers tags other
  systems own. Two tags (`REACTIVATION_TAG` + `bot-texted-<today>`) in one add.
- **A cooldown that is the anti-harassment guarantee, not a tuning knob.**
  `SMS_COOLDOWN_DAYS` (14) MUST exceed the external drip length (~7d), or you
  re-text someone mid-drip. It is a separate rotation from the call-list cooldown
  (texting and calling rotate independently, own tag prefix `bot-texted-<date>`).
- **NEVER relax a safety limit to hit a number.** Pool-exhaustion failsafe: count
  genuinely-fresh eligible after the cooldown; if below a floor (`MIN_FRESH_TO_
  RUN`), tag NOBODY and post a skip notice... do not reach into the cooldown to
  fill the cap. Under-fill (partial batch) or skip. The day partial/skip starts
  firing is the day you've found the pool's true sustainable daily rate.
- **Idempotency guard: top up, never double.** Count contacts already carrying
  `bot-texted-<today>`, subtract from the cap. A same-morning rerun fills to the
  cap, never 2x it. Known caveat: it counts within the current intake pool, which
  drifts run-to-run, so it can overshoot the cap by the drift (~1). Approximate,
  not exact... to make it exact, count today's stamp via a whole-base tag search.
- **A failed tag apply must not burn a cooldown.** Retry once; on hard failure,
  do NOT apply `bot-texted-<today>` to that contact... a lead who never entered
  the drip must stay eligible tomorrow, not sit out 14 days for a write that
  never landed.

## Staged live rollout (never blast on day one)

An outbound action that fires real messages ships behind a flag and scales in
proven steps, not straight to full volume:

- **`DRY_RUN` ships true.** First runs apply nothing, post the would-be batch +
  funnel to Telegram. Flip to false only after clean previews.
- **Scale the cap in steps with a write-landed proof at each.** 10 → 35 → 50.
  After the first LIVE run, re-read the tagged contacts from GHL and prove both
  tags actually landed (a read-back, separate from the run's own logs). "Applied"
  in a log is a claim; a re-read is evidence.
- **Prove the cooldown round-trip across real days** before trusting the number:
  hold the cap steady for two mornings and watch the same leads drop out of the
  fresh pool via `bot-texted-<date>` before raising volume.

## The load-bearing lesson: members are tracked by TAGS, not reliably by stage

The single hardest bug. A paying member appeared on the cold-call list twice.
Excluding by pipeline stage alone did NOT catch them, because in this GHL
instance membership lives in **contact tags**, and a member can carry a member
tag with no opportunity in any member pipeline at all.

- **Exclude by tag pattern, not an exact list.** Match any normalized
  (trimmed + lowercased) tag that *contains* a member keyword. For JJO those
  keywords are `member` and `<offer-code>` (a paid-member offer tag),
  which catches `current-member-<location>`, `<brand> member`, `<location> <offer-code>`, and
  future location variants without a code change. Keep an exact-match set too for
  family tags that carry no keyword (`<brand> parent`, `<brand> family`, `<brand> student`).
- **Keep the stage-based exclusion as belt-and-suspenders** ... whole member
  pipelines (e.g. a member-onboarding pipeline, a staff pipeline) plus converted stages
  inside mixed pipelines (a "sold" stage, a location's member stages). It catches
  members who ARE tracked by opportunity. But tags are the primary signal.
- **The residual blind spot, stated honestly:** a member with none of these tags
  and no member-pipeline opportunity has no signal to catch. The exclusion is
  only as good as the CRM's tagging discipline. Say this out loud, don't imply
  airtightness you can't back.

## Diagnose before you guess: read-only probe workflows

The token lives in GitHub secrets, so you can't inspect GHL from your machine.
Do NOT hand-write intake/exclusion rules from assumptions ... every guess this
build made was wrong until probed:

- The four member-stage keywords first proposed (`won`/`active`/`enrolled`)
  matched ZERO real stages.
- The "all-time pool is under a hundred" reading was an artifact of the wrong endpoint.
- Guessing which fields a search returns would have silently dropped the DND
  safety filter.

So, before writing intake or a filter, ship a **read-only,
`workflow_dispatch`-only** probe and read reality first. Three probe shapes
earned their keep:

- **Stage/contact probe** ... lists every pipeline/stage with live counts, and
  looks up specific contacts by name to dump tags + opportunity stages (this is
  how the two member leaks were root-caused).
- **Pool-measurement probe** ... counts the true reachable universe per source
  so you size the architecture (does it need pagination? rate-limit backoff?)
  BEFORE building, not after.
- **Field-shape probe** ... hits each search endpoint once and prints the
  response's field NAMES + presence booleans + counts (PII-safe: names, not
  values). This is what confirmed tag-search returns `tags`/`phone`/`dnd` but not
  `dndSettings`, and made the rebuild correct first try.

This is [excelsior-diagnose](../excelsior-diagnose/SKILL.md)'s "name the mechanism first," applied to a CRM you
can only see through Actions. Confirm ambiguous stage/tag semantics with the
operator before excluding ... "is everyone in this pipeline / with this tag a paid
member?" A wrong guess either calls members or drops real leads. Probes are
scratch: remove them once you've built against their findings (keep the repo to
just the agent + its one workflow).

## Gotchas that cost real time

- **An Anthropic 400 "Bad Request" is often a billing/credit issue, not a code
  bug.** The body reads `"Your credit balance is too low..."`. Always
  `print(r.text)` (or `if not r.ok: print(status + body)`) BEFORE
  `raise_for_status()` so the log shows the real reason instead of a bare 400.
  Verify the model string and request schema are current, but check the balance
  before assuming a code fault. Topping up credits is the operator's money
  decision... surface it, don't try to cross it.
- **Pushing `.github/workflows/*` needs the `workflow` OAuth scope**, separate
  from `repo`. `gh auth refresh -h github.com -s workflow` ... and it must run in
  the operator's own interactive terminal (browser approval), not a sandboxed
  shell.
- **GHL note bodies are HTML** (`<p style="margin: 0px">...`). Strip tags and
  decode entities before feeding notes to the ranker or displaying them, or you
  waste the char budget on markup.
- **The cheap search payload has COARSE `dnd` but NOT `dndSettings`.** So the
  granular Call-DND check can't run at pool scale. Filter coarse `dnd` from the
  payload AND re-run the full `dndSettings.Call` check on the ~30 enriched
  survivors, dropping (and backfilling) any that fail. A Do-Not-Call contact must
  never survive to the list ... never trade the DND filter for speed.
- **`POST /contacts/search` paginates by the `searchAfter` cursor**, not a page
  number: pass the last record's `searchAfter` value as the next request's
  top-level `searchAfter`. `GET /opportunities/search` is page-based (`page`
  increment). Both stop when a page returns < the limit.
- **Members must be excluded at sweep scale.** The broad tag sweep pulls members
  in too (they carry interest tags); the same tag + stage exclusion catches them
  ... on JJO, a meaningful share of the sweep. Scan the masked list for member names/tags
  every run; don't assume the count means it worked.
- **Tag AFTER the Telegram send, never inside the message-assembly loop.** The
  call-list tagged all 30 leads while building the message, then sent... so a
  send failure left 30 leads carrying `call-list-<date>` and cooldown-suppressed
  for 14 days on a list nobody ever saw. Fired on 3 separate days, ~90 leads.
  `send_telegram(body)` first; `for c in final: tag_contact(...)` only after it
  returns. General form of this law: [outbound-rollout-safety](../outbound-rollout-safety/SKILL.md).
- **Telegram `sendMessage` caps at 4096 chars and 400s past it.** A 30-name list
  with reason lines plus note snippets lands ~4200-4300 chars... over. Chunk on
  newline boundaries (4000 limit leaves headroom), post sequentially, and let a
  failed chunk propagate so the caller does not tag on a partial delivery.
- **`parse_mode: "Markdown"` + unescaped contact data is the OTHER 400.** Names
  and note snippets come from GHL carrying raw `*` / `_` / backticks; an unmatched
  one is an identical `400 Bad Request` with a completely different cause. Do not
  assume length. (Known-open on this build: escaping was deliberately not added.)
- **The shared-client retry covers GHL, NOT the delivery leg.** `main.ghl` retries
  transient LeadConnector failures; `send_telegram` has no retry and no try/except
  anywhere up the stack, so a delivery 400 aborts the run outright. Two separate
  failure surfaces... hardening one says nothing about the other.
- **`raise_for_status()` throws away Telegram's explanation.** The run log shows
  `400 Client Error ... sendMessage` and no reason string, which is why
  length-vs-markup could not be separated from logs after the fact. Print the
  response body before raising (same lesson as the Anthropic-400 gotcha above).
- **GitHub Actions cron is UTC and does not shift with DST.** A "8am/1pm
  Central" schedule drifts an hour in winter. Note it; pin to exact local time
  only if the operator asks (the agent would have to check the date itself).
- **GHL (LeadConnector) fails transiently... put the retry in the shared client,
  not a per-caller shim.** Calls that succeed seconds later throw ReadTimeout,
  spurious 401, 429, 5xx. Retry those in `main.ghl` (the single choke point) with
  backoff and a bounded attempt count, so every caller inherits it... a runtime
  shim wrapping `main.ghl` from one module leaves the other agent unprotected
  (this is exactly why the scheduled call-list kept emailing failures while the
  tagger was fine). ONE resilience path. **But do not swallow a persistent 401:**
  a 401 on EVERY attempt is a dead/revoked token, not a blip... raise a loud,
  named error (`GHLTokenError`) after the attempts are exhausted so it surfaces
  instead of masquerading as transient. Retry transient; fail loud on genuine.
- **Triaging "failure emails for days": bucket, don't eyeball.** Pull the failed
  runs across the repo, grab the one decisive exception line each, and group.
  Usually it's ONE recurring class (here: transient GHL on the unprotected
  scheduled path) plus a few historic one-offs already fixed... the fix targets
  the recurring class, not each email.
- **`bad phone` suppressions are usually genuinely empty numbers**, not a
  too-strict regex. Prove it by logging a few raw values before "fixing" the
  filter... on this build all samples were `<empty>`, i.e. a data-entry gap, not
  a code problem.

## Operating discipline

- **Scan the bundle for secrets before the first push** ... no real `.env`, no
  hardcoded tokens/keys; confirm `.gitignore` excludes `.env` and `__pycache__`;
  confirm the workflow injects via `${{ secrets.* }}`. Push **private**.
- **Mask phone numbers in CI logs.** Echo the list to the run log with digits
  regex-masked so it's reviewable without opening Telegram; the real numbers go
  only to the delivery channel. Customer PII must not sit in build logs.
- **Test the risky logic before pushing.** A throwaway venv + a few asserted
  cases against the real function (member tags in every casing/whitespace
  variant, plus a genuine-lead control that must stay callable) catches a leak
  before production does. Delete the venv and gitignore `.venv*/`.
- **Verify, then report honestly.** Pull the masked list from the run log and
  scan for member names / member tags / "disqualified" reason lines before
  claiming zero members. When a leak survives, say so plainly and diagnose it
  ... this is [verify-before-asserting](../verify-before-asserting/SKILL.md) and [report-back](../report-back/SKILL.md) in force.
- **Commerce guardrail:** the CRM is the system-of-record; the agent reads and
  proposes. Money-adjacent or send actions are human-approved and logged in
  a run log (private note, not included). See the commerce guardrails (private note, not included).
