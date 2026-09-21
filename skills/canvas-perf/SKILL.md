---
name: canvas-perf
description: Use when optimizing canvas rendering performance in the Excelsior galaxy... sprite caches, offscreen rendering, frame budgets, pixel-equivalence proofs, draw-cost profiling, memory budgets. Triggers on words like sprite, cache, offscreen, fps, frame budget, paint cost, blit, equivalence, memory footprint, invalidation.
---

# Canvas Performance Craft (Excelsior galaxy)

MAD wins on conflict. Marble's material floors are law: performance work changes
WHEN pixels are painted, never WHAT they look like. pol-renderer (private skill, not published) holds the terrain
map... read it first.

## The known root cause (measured, 2026-07-06)

The 158-orb fixture ceiling (~31fps idle, ~23fps moving) is per-frame canvas-
gradient rebuild cost across all simultaneous marble bodies. It predates Orbit,
is identical at idle, and is NOT a camera/gesture cost. Real-data density holds
61fps. Any fix targets the gradient rebuild, nothing else.

## Sprite cache pattern

- Key: (moduleColorId, radiusBucket, lessonState, palettePhaseBucket). Miss →
  paint once via the EXACT shipped marble recipe into an offscreen canvas → blit
  with drawImage thereafter.
- Radius buckets dense enough that zoom scaling reads continuous... start at 2px
  steps to 24px, 4px steps above, and interpolate by drawing the nearest-larger
  bucket scaled DOWN (down-scaling hides bucket seams; up-scaling shows them).
  Visible popping during zoom is a defect.
- devicePixelRatio-aware: render sprites at physical resolution, or retina
  devices get soft marbles.
- THE PALETTE TRAP: the marble palette cycles (~72s hue drift). A cache keyed
  without palette phase serves stale hues that snap on refresh. Either quantize
  the cycle into phase buckets (enough that stepping is invisible... measure it)
  or re-tint via a cheap per-frame operation on a hue-neutral base sprite. Decide
  by measurement, disclose the choice.
- The focused node's live particle flourish stays real-time... donor law. Cache
  bodies, never the flourish.

## Invalidation

- State change (lesson completes, tier changes, lock/unlock) refreshes affected
  sprites within one frame budget... a completed orb never wears a stale body.
  Prove with a scripted state-flip test.
- Eviction: LRU with a hard byte budget. Unbounded caches are a defect even when
  memory "seems fine."

## Memory math (do it before building)

- Sprite bytes = width x height x 4 (x dpr squared for physical-res sprites).
  Sum the worst-case matrix (colors x buckets x states x phase buckets) BEFORE
  implementation; budget <= 32MB at the 158 fixture. If the matrix busts the
  budget, cut phase buckets or share state overlays as composited layers...
  report the trade.

## Pixel-equivalence proof (the gate that protects Marble)

- Cached vs live-painted, measured on the isolated readback at 48px minimum (the
  Marble normalization... small radii cannot express the floors in physical
  pixels).
- Floors: mean per-channel delta <= 2/255; structural similarity below visible
  difference (SSIM or equivalent, reported); then the FULL Marble battery
  (73/73, 21/21) re-run against cached output, plus Orbit's angle set.
- Route the equivalence judgment to the strongest judgment model available in
  the session (Fable 5, else Opus 4.8, at time of writing)... pixel-faithfulness
  to a shipped gold standard is a judgment gate, not a diff printout.

## Profiling discipline

- Measure per-call paint cost directly (performance.now around the draw path,
  drawn-count tallies) before optimizing... never optimize from a hypothesis.
- Isolate harness overhead: drive the camera in-page when measuring fps so
  Playwright IPC doesn't pollute the number (the proven technique from Orbit).
- Verify the served bundle and process cwd before trusting any measurement...
  the wrong-lane preview trap is real and documented.
- Fresh-session measurement on the FINAL code state; earlier numbers are stale.

## Banned moves

- Any visible material change (this craft ships zero aesthetic delta).
- Buying fps with reduced orb counts, particle budgets, or draw fidelity.
- Caching the focused node's live flourish.
- Declaring equivalence from a build succeeding or a spot-glance.
