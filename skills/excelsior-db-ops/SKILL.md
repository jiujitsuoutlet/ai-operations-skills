---
name: excelsior-db-ops
description: Use for any Supabase database, auth, RLS, migration-replay, project-provisioning, data-migration, fixture-staging, OTP/Twilio, or environment-cutover work in the Excelsior build. Triggers on words like RLS, policy, migration, provision, cutover, production database, export, import, seed, fixture, service role, OTP, Twilio, edge function, secrets rotation.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Excelsior Database and Security Operations

MAD wins on conflict. The four holds govern everything here: secrets, ledger
boundary, RLS proof, phase walls. This skill is HOW those holds get executed.

## RLS proof methodology (rejection is the proof)

- Proving isolation means a MEMBER token being rejected server-side: another
  member's JWT (or a forged/expired one) requesting protected rows gets 401/403/
  empty per policy design. An admin or service-role token succeeding proves
  NOTHING about isolation.
- Test both directions per table: read (other-member rows invisible) and write
  (direct client insert/update rejected where a server function is the only
  legitimate path... e.g., tournaments approval, profile region columns).
- Every new table ships base GRANTs alongside its RLS policies... the twice-bitten
  staging lesson: RLS without GRANTs fails open-or-broken in confusing ways.
- Status-gated visibility (draft/approved patterns): re-verify row state AT EMIT
  TIME in the serving function, not just at query time... the allowlist pattern.
- Route the final RLS judgment to the strongest judgment model available in the
  session (Fable 5, else Opus 4.8, at time of writing)... security proof is
  never a build-model formality.
- The runnable rejection recipe (session mint + four-call attack pattern) lives
  in excelsior-staging-proof (private skill, not published)... use it rather than re-deriving curl calls.

## Migration discipline

- Migrations only, never dashboard clicks (exceptions: project creation, key
  minting... dashboard-native by nature). Additive, never breaking.
- Check the slot registry in the MAD and run supabase migration list against the
  target BEFORE any db push... collisions are caught by reading, not by failing.
- Replay order is repo order. Reserved/unmerged slots do NOT replay onto fresh
  projects... only what main carries.
- No hard-delete of any row referenced by real member progress or ledger history.
  Unpublish/hide instead.

## Data migration (the export/import pattern)

- Allowlist, not denylist: published/approved content migrates by explicit WHERE;
  everything else dies unchased.
- FK order on import: courses → modules (parent_module_id after parents exist) →
  lessons. Preserve UUIDs across the move so topology edges survive intact.
- Parity floors after import: row counts AND topology edge sets verified by query
  output saved to evidence... eyeballing a tree is not proof.

## Fixture staging (the legitimate-path law)

- Demo fixtures (Second Member at exactly 5 completions / 25 pts) are re-staged
  ONLY via the legitimate server path: the real completion flow, or a service-role
  script that calls the same RPC the engine calls. Hand-inserted ledger rows are
  banned... a fixture created by cheating proves the system can be cheated.
- After staging: freeze and verify the fixture after every subsequent slice.
- Ledger integrity check on any new environment: attempt a double payout and
  watch the idempotency constraint refuse it. The refusal is the proof.

## Secrets choreography (hold #1 in practice)

- New keys are minted in the dashboard and written into Vercel env and gitignored
  .env BY CODE... values never appear in chat, commit, log, or evidence. Name
  keys in plans; never quote them.
- After any environment swap, secrets-scan the built bundle BOTH ways: the new
  publishable key present, the old environment's key ABSENT.
- Edge-function secrets set via CLI (supabase secrets set), never committed.
- Service-role credentials for out-of-repo agents (e.g., the scout) live in
  environment outside ANY repo... never the vault (it's shared), never committed.

## Auth/OTP wiring

- Twilio is transactional OTP only, via the Supabase Send SMS Hook. HighLevel is
  CRM/marketing only, written AFTER phone verification, exactly once per member.
- Test numbers (`<TEST_PHONE_N>` + codes) are Supabase auth config, not
  data... re-wire them on any fresh project before any battery runs.
- A real-OTP proof is a full round-trip on the target environment: SMS arrives,
  auth completes, member row created, GHL push fires once. Anything less is a
  config claim, not a proof.

## Cutover discipline (irreversible-change law)

- One irreversible change per slice, ever: database swap and DNS swap never
  couple.
- Before any cutover, write the one-line rollback FIRST (re-point env vars /
  revert DNS record) and keep the old path alive: staging survives >= 7 days
  after a DB cutover; the vercel.app door stays open after a domain cutover.
- Immediately after any cutover: full acceptance battery ON the new path (census,
  spine, RLS spot-battery, fixtures), evidence captured against the live target.

## CLI + maintenance recipes (learned on this build, previously unwritten)

- Browser-called edge functions deploy `--no-verify-jwt`... the gateway's JWT
  check breaks the CORS preflight. Auth is enforced INSIDE the function via
  getUser(), so the flag moves the check, it doesn't remove it.
- If the local Docker bundler fails (exec format error on this machine), deploy
  with `supabase functions deploy <fn> --use-api`.
- A fresh worktree/checkout needs `supabase link --project-ref <PROJECT_REF>`
  once before CLI commands aim at the right project.
- Cleaning test rows guarded by the append-only points_ledger trigger: disable
  the trigger via the management API as superuser, delete, re-enable, then
  CONFIRM `tgenabled='O'` by query. Done twice on this build... the confirm
  step is the point; a trigger left disabled is a silent integrity hole.
- The portable, any-project edition of these gotchas lives in
  `supabase-field-notes`.

## Known failure modes (this build's history)

- GRANTs missing under correct-looking RLS (staging, twice).
- The staging OTP 500 from the deployed SMS hook... any auth battery that hits a
  hook error names its current status (reproduced-and-diagnosed or resolved-by-X),
  never silence.
- Measuring against the wrong environment/lane... verify the served bundle and
  process cwd before trusting any number.
