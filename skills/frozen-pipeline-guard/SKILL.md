---
name: frozen-pipeline-guard
description: Prove that a proposed Excelsior visual slice stays outside the exact systems frozen by the current MAD amendment. Use before implementation, before commit, and before merge when composer, post-processing, tone mapping, exposure, bloom, vignette, DPR, cameras, orb materials, brightness envelopes, routing, playback, completion, topology, or other protected surfaces may be affected.
---

# Frozen Pipeline Guard

The canonical MAD names what is frozen. This skill detects possible openings; it does not redefine the list.

## Establish the guard

1. Read `MAD.md` and every applicable dated amendment from the exact base commit.
2. Quote the frozen list into the slice ledger. Include named calibrations and envelopes, not shorthand summaries.
3. Map each frozen item to files, exports, uniforms, configuration keys, tests, snapshots, and runtime invariants. Store project-specific patterns using [references/guard-config.md](references/guard-config.md).
4. Record the comparison base and intended slice paths.

## Run the guard

1. Before editing, decide whether the requested result logically requires a frozen opening. If yes, stop before implementation.
2. Run `scripts/check_frozen_diff.py --base <base>` as a tripwire.
3. Inspect the complete semantic diff. Keyword absence is not proof: indirect shared constants, material factories, render-target wiring, shader includes, camera laws, and generated assets can alter a frozen result.
4. Re-run the canonical invariant tests and image/measurement batteries named by the amendment.
5. Classify every frozen item as `unchanged`, `opened by explicit amendment`, or `forbidden change detected`.

## Decision law

Any unapproved opening is a hard stop. Do not hide it inside a visual slice or call a recalibration a refactor. Draft a separate dated amendment proposal and wait for the founder's ruling.

Report the exact base commit, protected paths/patterns, matched lines, semantic review, invariant results, and final classification.
