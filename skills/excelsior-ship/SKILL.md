---
name: excelsior-ship
description: Use for any commit, branch, PR, merge, migration, deploy, or production promotion in the Excelsior repo. Triggers on words like commit, push, PR, merge, deploy, promote, ship, migration, db push, release.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Excelsior Ship Discipline

The MAD is canonical... on any conflict between this skill and the MAD, the MAD wins.
This skill encodes the shipping procedure, not the architecture.

## PR law

- EVERYTHING rides a PR, including docs, build-log entries, amendment texts,
  diagnosis notes. No direct commits to main, ever.
- Flow: branch → commit → PR → Paul's word (or standing authorization for that
  class of change) → merge.

## Lane rider (prove it, don't assert it)

- App work runs from `<APP_LANE>` on an app-lane branch. Agent work runs
  from `<AGENT_LANE>`. NEVER build/test/deploy across lanes.
- At slice start: record the other lane's HEAD as a baseline. At slice close:
  prove it byte-identical. Include branch + worktree path in the first gate report.
- A session rooted in the wrong lane self-corrects by adding the correct worktree...
  never by "always allow"-ing past the sandbox guard.

## Authored-text law

- Ellipses, never em-dashes... in code, comments, commits, docs, PRs, everything
  authored.
- Donor design-reference files stay byte-identical verbatim, em-dashes included.
  Byte-identity is the port's own proof. Never reformat, never "fix" them.

## Migrations

- Migrations, never dashboard clicks. Additive, never breaking.
- Migrations mint from 14-digit timestamp slots (e.g.
  `20260831220800_sms_consent_events.sql`). The old slot registry (the
  agent block 20260706000001-000099) is stale... never mint from it. Run
  `supabase migration list` against the target project BEFORE any db push to
  catch collisions.
- No hard-delete of any row referenced by real member progress or ledger
  history... unpublish/hide instead.

## Deploy recipe (Vercel is NOT git-connected)

1. Build the bundle.
2. Secrets scan the BUILT bundle... only the browser-safe publishable key ships.
   Any other credential match aborts the deploy.
3. Copy the bundle into a folder named EXACTLY like the Vercel project
   (`<VERCEL_PROJECT>`)... Vercel keys the project off the literal folder name;
   a mis-named "deploy" folder once created a stray Vercel project.
4. Promote the prebuilt bundle from that folder explicitly with --prod.
5. Capture production evidence IMMEDIATELY after promotion (the live URL serving
   the new bundle, plus the slice's closing measurements against production
   itself). Previews sit behind Vercel login and expire fast... capture preview
   evidence immediately too.

## Secrets hold (never bend)

- Credentials live only in gitignored .env files, Supabase Edge Function
  secrets, and Cloudflare Worker secrets (hold 1, MAD v2.55). Never in a
  repository, never pasted in any chat. Code writes .env, not Paul.

## Governance sequencing

- Read the MAD in full before any task. Stop on conflict.
- Named slices are logged as dated MAD amendments and shown to Paul BEFORE any
  code is written. Numbering law (MAD v2.53, Section 10): an amendment number
  is assigned when its pull request opens, never when a draft is written. No
  reserved numbers. v2.9 is retired unused and is never minted.
- Permission prompts: Allow once. Never "Always allow" on git push, web search,
  or anything that widens a standing grant, including cross-lane file access.
  Deny compound commands mixing cd with redirection.

## Flag-flip cutover (making a gated surface the default)

When a surface has been built behind a flag (e.g. ?cosmos=1) and a slice flips it
to default-on, the flip is its OWN gated step, never bundled into the feature commit,
and it is proven by these five things in order... proven, not asserted:

1. **Single documented toggle.** The flip is one source of truth (a `cosmosEnabled()`
   -style function or one constant), not a scattered set of conditionals. Route every
   consumer through it before flipping. If the flip touches more than one place, that
   is the bug to fix first.
2. **Cold no-flag boot is the real proof.** The surface has only ever run WITH people
   deliberately turning the flag on. Prove the FIRST-RUN boot with NO flag anywhere
   in the URL... portal → auth → the surface... lands correctly. This is the path the
   flag was hiding; it is where a board-assumption regression lives. The in-app loop
   passing proves nothing about the boot path.
3. **Both rollbacks proven.** The runtime kill-switch (?flag=0 forces the retired path
   back) AND the code-level revert (a single constant flip returns to the old default).
   Prove both live, not by reasoning.
4. **Retire, never delete.** The old path goes default-OFF, not removed. It is the
   rollback. Deleting it forfeits the one-revert safety the whole flip depends on.
5. **Full spine on the flipped default.** Re-run the demo spine with the flag defaulted
   on and no URL param... the member's actual boot. Byte-identical return state where
   the slice promised it.

Every role that boots into the surface must be proven, not just the primary one. If
members AND coaches both land on the flipped surface by design, prove BOTH cold boots...
a role that still assumes the old default is a real regression, not a flake (see
excelsior-verify's stale-assertion law... a standing battery encoding the old default
will fail on the flip and must be updated to the proven new reality, never force-passed).

## Close-out

At slice close, update the monthly build log (docs/BUILD-LOG-YYYY-MM.md...
currently docs/BUILD-LOG-2026-07.md; append, never create a parallel log file)
via PR: what shipped and was PROVEN, architecture decisions with why, open
loops on Paul's hands, deferred decisions.
