---
name: excelsior-gate-release
description: Orchestrate the corrected-build proof and founder handoff for an Excelsior visual or game-world slice after implementation is complete. Use for frozen-pipeline checks, sequential touch and WebGL batteries, orb-margin and contrast floors, plane separation, production builds, Second Member verification, before-after galleries, walk previews, device-gate URLs, GATE-PENDING reports, or instructions to stop before merge or production.
---

# Excelsior Gate Release

Layer this over `excelsior-verify`, `perf-measurement-hygiene`, `excelsior-ship`, and `excelsior-preview-gate`. The MAD and slice-specific gate stack remain canonical.

## Freeze the candidate

Before running batteries:

1. Confirm the exact branch, commit, worktree, server cwd, and served bundle.
2. Confirm the intended implementation diff contains no unrelated changes.
3. Capture the final station state and geometry diagnostics.
4. Generate or check the protected-surface snapshot using `scripts/frozen-pipeline-guard.mjs`.
5. Stop editing production code. Any later edit invalidates every downstream measurement.

## Run the stack sequentially

Read [references/gate-stack.md](references/gate-stack.md). Run every WebKit, auth, or GPU-heavy battery alone. Preserve each command, exit code, manifest, artifact path, minimum, and delta.

Report actual current census totals. When a ruling names an older denominator, distinguish the required legacy subset from the current expanded census rather than silently changing either number.

## Build and identity proof

- Run the production build against the frozen candidate.
- Scan the built bundle for secrets.
- Verify Second Member remains exactly at the protected fixture state.
- Record the local bundle hash.
- Deploy a preview only. Never use `--prod` for a founder walk.
- Verify the preview serves the same bundle hash in a real browser session.

## Entry-route reliability extension

When the slice adds or changes a wheel-spoke world, portal, wormhole, staged
asset, or mobile WebGL entry, use `excelsior-world-entry-reliability` before
the founder walk. Its arrival budget, motion-continuity, local-fallback, and
stable-alias checks are release gates, not visual polish. A target world that
eventually looks right but freezes, redirects Home, or waits beyond its stated
budget is not ready for handoff.

## Package the founder walk

Read [references/founder-handoff.md](references/founder-handoff.md). Include exact before-and-after poses, required close crops, the full orbit gallery, machine-readable manifests, minimum margins, census results, performance deltas, and the build-log entry.

Provide two distinct URLs when required:

- Walk URL for visual review
- Device-gate URL for the mandatory device workflow on the new commit

An older commit's device gate never transfers to a corrected build.

## Stop law

At the requested gate:

- Mark the slice `GATE-PENDING`.
- Provide the new commit, walk URL, and device-gate URL.
- Do not merge, promote, deploy production, revoke a still-needed walk credential, or continue into another concern.
- Await the founder's explicit verdict when the requested next action has not
  already been authorized. If a founder-approved ruling or standing
  authorization records the same action and unchanged scope, carry it forward
  in the release ledger and proceed without requesting the same approval
  again. Do not use a standing authorization to expand into a different
  project, member-facing decision, credential, or production target.

If a required gate cannot run, do not substitute a nearby test. Name the missing proof and stop without a green conclusion.

## Closeout integrity

Reconfirm the other worktree or agent lane remains at its recorded baseline. Commit and push only the intended branch. Log claimed versus proven results and disclose every delta, warning, rerun, or environment limitation.
