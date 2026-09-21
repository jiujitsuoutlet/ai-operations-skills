---
name: supabase-field-notes
description: Portable Supabase and Postgres production gotchas from live-fire build work... RLS vs table GRANTs, edge function CORS and deploy flags, auth hooks and test OTP numbers, append-only trigger maintenance, secrets placement. Use on ANY Supabase project, not just Excelsior. Triggers on words like Supabase, RLS, GRANT, policy, edge function, CORS, OTP, auth hook, service role, anon key, publishable key, trigger, migration.
---

# Supabase Field Notes (portable gotchas)

Everything below was learned the hard way on a live build. Project-specific
procedure belongs in that project's own skills; these are the parts that hold
on any Supabase project.

## RLS and GRANTs are separate systems

- Row Level Security policies do NOT grant table access. A new table needs
  explicit GRANTs to `anon` / `authenticated` / `service_role` alongside its
  policies... defaults often don't apply them, and correct-looking RLS without
  GRANTs fails in confusing open-or-broken ways. Bitten twice in one session on
  the source build; now checked on every migration that adds a table.
- Rejection is the proof of isolation: a MEMBER token being refused (401 / 403 /
  SQLSTATE 42501) is evidence. An admin or service-role token succeeding proves
  nothing about isolation.

## Edge functions

- Functions called from browsers deploy with `--no-verify-jwt`, because the
  gateway's JWT check breaks the CORS preflight (OPTIONS carries no auth
  header). Enforce auth INSIDE the function via `getUser()` instead... the flag
  moves the check, it does not remove it.
- If the local Docker bundler dies (an "exec format error" is the tell), deploy
  with `supabase functions deploy <fn> --use-api`... the API-side bundler
  sidesteps the local toolchain entirely.
- A fresh checkout or worktree needs `supabase link --project-ref <ref>` once
  before CLI commands aim at the right project.

## Auth without an SMS bill

- Fixed test phone numbers (fake 555 numbers with fixed codes) in Supabase auth
  config let you build, test, and demo the entire OTP flow with NO SMS provider
  wired. They bypass send hooks entirely, so they keep working even while real
  delivery is broken or pending approval.
- The Send SMS Hook pattern for real delivery: verify the Standard Webhooks
  signature, rate-limit via an attempts-log table, and fail CLEAN with a named
  outcome when downstream config is missing... never crash the auth flow.
- A provider API accepting the send is not delivery. SMS especially: the API
  reports "sent" while carriers silently filter (US A2P campaign approval is a
  separate, later gate than number purchase). Prove delivery at the far end...
  the message arriving, the auth completing.

## Sign-out does not kill the access token

- `signOut()` revokes the REFRESH token. The already-issued ACCESS token is a
  signed JWT that PostgREST verifies by signature + `exp` only... no session
  lookup... so it keeps working until its own expiry (default 1 hour),
  sign-out or not. Found by live probe, not docs.
- Proving a credential is dead requires bypassing the SDK: capture the raw
  `access_token` before sign-out, then raw `fetch` with a manual
  `Authorization: Bearer` header. The SDK's own post-signOut calls use its
  CLEARED local state... they report "no session" and tell you nothing about
  what the server still accepts on the wire.
- If the post-signout window is unacceptable for your product: shorten the JWT
  expiry (costs more refresh traffic) or add revocation-aware checks (e.g. a
  session claim verified against `auth.sessions`, costs a lookup per request).
  Either way, decide the posture explicitly... never design as if `signOut()`
  were a security boundary.

## Append-only trigger maintenance

- To clean test rows guarded by an append-only trigger: disable the trigger via
  the management API as superuser, delete, re-enable, then CONFIRM
  `tgenabled='O'` by query. The confirm step is the point... a trigger left
  disabled is a silent integrity hole.

## Secrets placement

- Edge-function secrets go in via `supabase secrets set` only... never
  committed, never pasted in chat.
- Only the browser-safe publishable key may appear in a shipped client bundle.
  Grep the BUILT bundle for secret-key patterns before every deploy (see
  `secretless-static-deploy`).

## Related

`verify-before-asserting` (rejection-as-proof and delivery-at-the-far-end are
instances of it) · `secretless-static-deploy` (the bundle scan).
