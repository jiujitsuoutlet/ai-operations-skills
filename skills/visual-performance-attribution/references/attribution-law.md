# Performance attribution law

## Evidence hierarchy

1. Valid physical-device production run under governed conditions
2. On-device controlled feature toggle within the same accepted scene
3. Browser/GPU counters and profiler traces
4. Desktop/WebKit regression signal
5. Static cost projection

Never promote a lower tier over contradictory higher-tier evidence without explaining the instrumentation defect.

## Comparison law

- Compare identical feature sets and exact commits.
- Use the absolute device target and tail law; do not rely on median-only reporting.
- Interleave A/B order when session drift could bias one build.
- Repeat and cool when the effect size is not clearly larger than spread.
- Treat rejected target measurements as calibration only when scene equivalence is proved.
- Report dead passes as paid-for-nothing cost, but any composer change still follows frozen-opening law.

## Recovery accounting

Bank only measured recovery. Keep structural improvements that lack measurable recovery labeled `banked candidate`, not `delivered headroom`.
