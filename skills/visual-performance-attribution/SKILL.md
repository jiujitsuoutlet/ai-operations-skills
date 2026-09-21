---
name: visual-performance-attribution
description: Attribute the real rendering cost of an Excelsior WebGL visual change before choosing an optimization. Use when physical-device feel conflicts with harness FPS, when draw calls, triangles, fill rate, post effects, transparency, shaders, JS, load jank, drag tails, DPR, or thermal/cadence variance must be isolated and ranked with honest visual tradeoffs.
---

# Visual Performance Attribution

Diagnose first. Do not change production code unless optimization is separately authorized.

## Establish comparability

1. Record exact commit, full rendered feature set, viewport, DPR, device, browser, cadence, thermal/cooldown state, power state, session, and script.
2. Confirm every comparison renders the same accepted stage. A spike with dead/missing atmosphere or a stale dist is not a valid calibration.
3. Measure absolute locked-cadence behavior and tails. Cross-run median differences are secondary when cadence or thermal state differs.

## Attribute

Measure or isolate:

- live and submitted draw calls, material/program switches, triangles, lines, and points;
- render-target pixels, DPR, post passes, samples, clears, and fullscreen bandwidth;
- transparent/atmospheric layer count, screen coverage, blend order, and overdraw;
- texture dimensions, formats, mip levels, residency estimate, and uploads;
- shader variants, instruction/texture-fetch pressure, and recompilation;
- per-frame JavaScript, scene traversal, allocations, GC, layout, and UI callbacks;
- load-to-first-stable-frame, scripted orbit/focus, trusted drag, P95, worst frame, long-frame clusters, and cadence misses.

Use controlled toggles and instrumentation that do not replace the accepted scene. Run interleaved A/B trials when differences approach run variance. See [references/attribution-law.md](references/attribution-law.md).

## Report

Use [assets/perf-report.md](assets/perf-report.md). Rank cost centers by measured or defensibly projected recovery, confidence, implementation risk, and art-direction cost. Distinguish:

- steady-state median cost;
- orbit/drag tail instability;
- boot/upload/compile cost;
- structural savings, such as draw reduction, that did not yet produce measurable milliseconds;
- frozen-list openings and MAD requirements.

Do not assume geometry is expensive, pixels are free, or a projected saving is banked. Physical-device measurement decides. If no option fits the protected reserve, state the honest choices: reduce scope, fund performance through an approved opening, or hold the slice.
