---
name: perf-measurement-hygiene
description: Use when measuring frame rate, rendering, or latency in a browser, OR building/debugging any determinism proof (a sweep, a battery, a flaky-vs-stable test), OR trusting any pass/fail metric inside a harness... the contamination sources that fake regressions, the ways a "clean" result can be a false pass, the rule that a metric proven unable to fail gets REMOVED not repaired, the layered-assertion trap (clearing the primary law but not the stricter calibrated regression floor is a false green), and the rules for numbers you can trust. Triggers on words like fps, frame rate, slow, jank, regression, profile, benchmark, measure performance, requestAnimationFrame, throttled, deterministic, bit-identical, flaky, false pass, control group, contaminated, argmax, suspect metric, invalidated metric, regression floor, margin, judged by eye.
---

# Performance Measurement Hygiene (browser)

Bad numbers cost more than no numbers... every rule below exists because a fake
regression was chased, or nearly believed, on a real build.

## Measure fresh, on final code

- A long-backgrounded tab suspends requestAnimationFrame ENTIRELY; any fps read
  from a stale tab is fiction. Measure in a fresh session.
- Numbers measured before a later code change are stale... re-measure on the
  FINAL state, never splice old readings into a closing report.
- A/B comparisons inside one contaminated session lie; comparable numbers come
  from fresh runs of each side.

## Suspect the platform before the app

- Preview/staging deploys often carry injected platform chrome the production
  build will not have (e.g. Vercel injects its vercel.live feedback widget into
  every preview, absent from production). A preview measuring far below its
  proven fps is usually the widget, not a regression: diff the served HTML
  against your own built HTML, and confirm production carries no injected line.
- Confirm the page got a real GPU context (a hardware renderer string, not a
  software fallback) before comparing numbers across runs or machines.
- Confirm you are measuring the right served bundle at all... a name-resolved
  dev server can silently serve a different checkout (see
  `parallel-claude-lanes`).

## Keep the harness out of the measurement

- Drive animation and interaction in-page during fps capture so test-runner IPC
  round-trips don't pollute frame pacing.
- Other media on the machine interferes: a live video iframe playing in another
  tab can flake timing-sensitive tests... park other tabs somewhere inert
  before the run.
- Screenshots contaminate any fps counter averaging over their window... an
  in-app HUD read 46fps during a capture session while clean in-page sampling
  of the same pose read 61 in every config. Bisect a scary HUD number with
  in-page rAF counting (feature on/off) before believing it.

## Count what actually rendered

- An fps counter running its OWN requestAnimationFrame loop keeps reporting
  60 while the render loop crashes every frame... it counts browser ticks,
  not frames. Increment inside the render loop after the draw call, and wrap
  the loop body so the first thrown error is recorded, not swallowed.
- Multi-pass pipelines (post-processing composers, pre-passes) reset
  `renderer.info` between internal render calls by default... draw-call and
  triangle counts then describe only the LAST sub-pass. Disable auto-reset
  and reset manually once per frame, or the proxy metrics lie.
- A dev-tier machine is usually vsync-capped AND out-classes mobile GPU
  fill-rate in both directions... rig fps is a floor-check, never the device
  verdict. Ship tier knobs (layer/step/resolution URL params) so the real
  device can bisect its own budget.

## Numbers discipline

- Single-shot readings carry noise; hold results to floors WITH margin rather
  than shaving past them by a point.
- Never optimize from a hypothesis: measure per-call cost first
  (performance.now around the draw path, call tallies) and find the actual hot
  spot before changing anything.

## Determinism proofs: freeze the scene, prove the freeze took

- A proof that isn't bit-identical across runs is either measuring noise or
  measuring the wrong thing... freeze every mover except the one system under
  test, drive that system explicitly (never by wall-clock), and ASSERT the
  freeze took instead of assuming it. A sweep pinning two independent clocks
  reported a perfect bit-identical result on identical code because an
  unrelated reduced-motion guard elsewhere in the render loop silently
  skipped the exact functions the pins were meant to drive... it rendered ONE
  frame N times and called that determinism. The tell was in the output the
  whole session: the best/worst value landed on the FIRST sample every
  single run. **A sweep whose argmax is always sample zero is a dead sweep,
  not a stable one**... assert the argmax moves, or that two samples actually
  differ, before trusting a suspiciously clean result.
- A control that shares the contamination it's meant to cancel doesn't cancel
  it, it launders it. A "does the effect exceed 2x its own baseline" proof
  measured that baseline on a LIVE, un-stilled scene... unrelated ambient
  motion inflated both sides by different, uncorrelated amounts each run
  (measured: ~98% of the baseline's magnitude was ambient noise, not the
  thing the control represented), so the ratio flipped pass/fail for reasons
  unrelated to what was under test. Freeze the SAME things on both sides of a
  control comparison, not just the side being probed.
- If "freeze everything" would also disable the feature you need animating
  (e.g. an accessibility guard that legitimately stops motion under a
  reduced-motion signal), that's a real incompatibility to surface, not a
  corner to cut. Fix it with an explicit pin the guard honors even when it
  would otherwise skip... never wrap the test in a mode whose entire point is
  "nothing moves," then act surprised nothing moved.
- A metric normalized against a fixed absolute (a pixel count, a frame
  budget) is really normalized against whatever produced that absolute...
  change the underlying scale and a stale absolute fails a result that's
  visibly fine. Normalize against something the system carries with it (its
  own on-screen footprint, its own baseline measured fresh on the current
  build), and derive the bar from measured endpoints, never a number picked
  to fit or inherited from a prior build.

## A metric that cannot fail: REMOVE it, don't repair it

- A whole-frame luminance score meant to flag "this scene rendered empty"
  returned 0/14 suspect while TWO of the 14 frames were a visible void...
  because always-on HUD text and UI chrome floor the luminance no matter
  what the 3D scene behind them does. The metric had never been validated
  against a single known-broken frame; it was born unable to fail, and its
  clean output was read as coverage for a whole gate round.
- The fix is not a better threshold. Once a metric is proven unable to
  detect the failure it exists for, DELETE it from the harness and say the
  judgment is by eye... a removed metric is honest, a "repaired" one that
  was never re-validated is the same trap re-armed. Leave a comment at the
  removal site forbidding its return without a demonstration that it FAILS
  on a known-broken input first (the positive-control law, applied to the
  metric itself).
- Corollary for anything with layered assertions: a system can carry BOTH a
  primary law ("A must exceed B") and a stricter calibrated regression
  floor ("by at least X, the accepted-class margin"). Clearing the primary
  bar and reporting "HOLDS" without checking the floor is a false green...
  a real one shipped mid-arc (margin 0.0053 passed the primary law, failed
  the 0.006 floor, caught only because the full battery ran before merge).
  Before declaring any margin safe, grep the batteries for EVERY assertion
  that reads the same quantity, and clear the strictest bar, not the first
  one found.

## Related

`verify-before-asserting` (a measured number beats a remembered one) ·
`parallel-claude-lanes` (the served-bundle check) ·
`cosmos-render-pipeline` (private skill, not published) (the render-specific instance this section was
generalized from... a rope-flow determinism proof that shipped a real false
pass mid-slice).
