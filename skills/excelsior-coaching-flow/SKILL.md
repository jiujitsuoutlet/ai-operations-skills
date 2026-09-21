---
name: excelsior-coaching-flow
description: How to build a guided Excelsior coaching dialogue... a temple guardian speaks first, the member taps preset options, and every event sentence is composed server-side from authored templates plus approved rows (the Tournament Master pattern, MAD v2.53 and v2.54). The member app never calls a model. Use when adding a guardian, a dialogue branch, a specialist flow (nutrition, S&C, gear), or any "Excelsior asks first" feature. Triggers on words like coaching flow, guided dialogue, guardian, Tournament Master, dialogue graph, preset options, tap options, specialist, Excelsior asks, intake question, templates, Origin node, place search, coverage request, quest state.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Building a Guided Coaching Dialogue

Survey stamp: written against Excelsior main 3e29f99 (MAD v2.54) on 2026-09-14.
The founder ratified the pattern. The guardian dialogue is not on main yet. The
slice that builds it refreshes this skill at close-out.

## The law (read first)

- The member app never calls a model, in any slice (MAD v2.53).
- No model prose ever reaches a member. Members see approved rows rendered by
  authored templates.
- ALMANAC (MAD v2.54) is the separate events and academies data product. It
  uses models in ALMANAC's back office only. A human approves each row before
  it publishes one way into the app.
- The ratified pattern is MAD v2.53 decision 2 plus MAD v2.54 decision 8.
  Replicate it. Do not invent a new shape.

Doctrine: beginners do not know what to ask, so the guardian asks first.
Authored question, tapped answer, approved data, templated result, next door
opened.

## Never use these as a template

- **v2.9.** It was reserved for a Tournament Scout amendment that was never
  written. It is retired and is never minted.
- **The "structured-fields carve-out"** (model output fills validated fields).
  It was never ratified. It is not a permitted path in the member app.
- **PR #8**. It was closed as
  abandoned on 2026-09-13. Its edge function, chat tools, model fallback parse
  and deno tests describe a design the founder rejected.
- **The dormant AI-era artifacts:** a usage-counter table,
  its increment function, a profile flow-state column and
  its setter function. They have no live caller and are not a
  specification. Quest state never extends the dormant flow-state column.

## Governance first

- A new branch or a second guardian costs a content file, not engine work
  (MAD Section 3).
- These need their own dated MAD amendment before any build (mad-amendment
  skill): a new table, column or RPC, any typed member input other than the
  Origin node, and any points payout.
- Every flow passes its own build gates in this order: spec in the vault, MAD
  check, build and tests, card un-greyed only when the flow works end to end,
  five-line operator checklist for Nejat.

## The anatomy

1. **Dialogue graph (content data).** Author the dialogue as JSON graph data:
   nodes, options and edges. A node holds the text the guardian speaks. An
   option is a preset reply the member taps. An edge names the next node for
   an option. The engine only selects which node fires next, from data plus
   rules. If a sentence is not in the graph or in a template, a member never
   sees it.
2. **The guardian speaks first.** At a key moment the guardian opens with
   authored text. The member replies only with a tap on a preset option. No
   free-text box, no parse, no model call, no model key. The Origin node is
   the one exception (item 4).
3. **Compose event sentences server-side.** Compose every sentence that
   carries event data on the server, from an authored template plus approved
   rows. Re-verify each row at emit time and drop a row that fails:
   - `status = 'approved'` and a date that has not passed.
   - An HTTPS registration URL.
   - Once the publish pipe ships, `link_checked_at` within the last 72 hours.

   Dates, cities and the gi / nogi / kids flags render literally. URLs pass
   through byte for byte. If zero rows survive, fire an authored branch. Never
   show an error and never invent a row.
4. **The Origin node (the only typed input).** The Tournament Master's Origin
   node has one city field.
   1. The member types a city.
   2. `place_search(p_query)` trims the input. It rejects input shorter than
      2 or longer than 64 characters. It rejects characters other than letters
      in any script, spaces, periods, apostrophes and hyphens.
   3. It returns at most 8 candidates from `places`, by prefix match on
      `place_search_names.name_key`, largest population first.
   4. The member taps one candidate.
   5. `excelsior_set_origin(p_place_id)` writes the canonical values of that
      `places` row to the caller's own profile, or writes nothing.

   The app never stores the typed text. No model and no external call exist
   on this path. Show the MAD v2.54 attribution line on every surface that
   shows place data.
5. **"Your lands are unknown to me."** This branch calls
   `coverage_request_create(p_place_id)`. The call writes one
   `coverage_requests` row per member per place. A member reads their own rows
   only. ALMANAC receives aggregate counts per place per day, with no member
   identity. A coverage request grants zero points and writes nothing to the
   ledger.
6. **Quest state.** `tournament_quests` holds member-owned rows only. A member
   reads and writes their own rows only. "I registered" is a self-report
   journal flag, never a verified fact. Quest state grants zero points and
   writes nothing to the points ledger. A quest payout is a new ledger reason
   and needs its own amendment and slice.

## Data side: approved rows only

- Tournament rows are event logistics, not learning corpus. They never enter
  the POL, are never recommended as content, and never touch the content
  metadata schema.
- Approved means `status = 'approved'`, written only server-side. No boolean
  approval flag exists. An edit to an approved row's content returns it to
  `needs_review` (`tournaments_demote_on_edit`). A `stale` row is not
  approved.
- Once the publish pipe ships, the ALMANAC console is the only write path for
  tournaments. The app never pulls. Rows arrive through the signed
  `almanac-ingest` edge function.
- Rank same state first, then soonest date. When both the row and the
  member's Origin place carry coordinates, rank nearest first by great-circle
  distance, then soonest date.

## Storage and migrations

- Migrations are additive only and mint from a 14-digit timestamp slot (e.g.
  `20260831220800_...`). Put RLS and base GRANTs in the same file. Run
  `supabase migration list` against the target before any db push
  (excelsior-ship).
- Write member state only through SECURITY DEFINER RPCs that write canonical
  values or nothing. New profile columns get no client update grant, so a
  direct PATCH fails server-side with 403 / 42501 (evidence recipe in
  excelsior-staging-proof (private skill, not published)).

## The security gate

The gate is input validation plus the touch census plus RLS isolation proven
by a member token's rejection. Run each proof. Do not infer it.

1. **Input validation.** Call `place_search` with 1 character, 65 characters,
   digits, `<script>`, `;`, `%` and an emoji. Each call returns a rejection or
   zero candidates. As positive controls, "O'Fallon" and a city name in a
   non-Latin script return candidates. Call `excelsior_set_origin` with an id
   that is not in `places`. It writes nothing.
2. **Touch census.** Every new control (each option, the city field, each
   candidate) passes a real-tap census on the WebKit iPhone profile
   (excelsior-verify).
3. **RLS isolation.** With member A's token, read and write member B's
   `tournament_quests` and `coverage_requests` rows. The server rejects each
   call. An admin token that succeeds proves nothing (excelsior-security (private skill, not published)).
4. **Approved rows only.** A draft, a stale row and a past-dated row are
   invisible in the member read. The server rejects a member token's direct
   write to `tournaments`.
5. **Zero model.** The built bundle and the app's edge functions hold no model
   key and make no model call.
6. **Zero ledger.** A quest state change and a coverage request add zero
   `points_ledger` rows.

Store the evidence in `evidence/guardian/`. The founder's device walk is the
only acceptance gate.

## Close-out

Append to the monthly build log through a PR (excelsior-ship). Update
`app/src/service/CONTRACT.md` if the service layer changed. Give Nejat the
five-line manual checklist before you ask to un-grey anything. Refresh the
survey stamp at the top of this skill.
