# Orbit Sweep Contract

## Capture invariants

Record these in every manifest:

- App commit and served bundle marker
- Browser name and exact Playwright version
- CSS viewport, screen size, browser DPR, and renderer DPR
- Fixture identity without member PII
- Camera target, radius, pitch, and yaw
- Reduced-motion state and every frozen animation phase
- Query flags and feature flags
- Console and page errors

## Capture sequence

1. Authenticate with real Playwright locator actions on the WebKit iPhone touch profile.
2. Wait for the world-ready signal and the end of camera flight.
3. Freeze deterministic phases.
4. Set an absolute pose, wait a fixed settling interval, and capture.
5. Sweep absolute azimuth from 0 through 345 degrees at 15-degree increments.
6. Restore the full scene before each suppression cell.
7. Repeat the offending pose in Chromium only as an attribution control. WebKit remains the acceptance runtime.

Never drive camera motion by synthetic DOM events. Direct world diagnostic hooks may set exact poses because the sweep measures rendering, not gesture behavior.

## Black-frame metric

Report both pixel share and topology:

- Near-black pixel share
- Longest contiguous near-black run in any row
- Longest-run fraction of image width
- Bounding box of the largest near-black region when available

Choose and freeze thresholds before comparing the corrected build. Do not retune them after seeing results.

## Controls that must stay honest

- An object-hidden cell proves contribution ownership, not source corruption.
- A post-process-disabled cell must leave scene geometry visible.
- An alternate engine isolates engine-specific behavior only when all other capture inputs match.
- A one-frame capture cannot prove a once-per-orbit defect absent. Complete the full sweep.

## Artifact layout

```text
evidence/<slice>/orbit-sweep/
  manifest.json
  gallery.html
  stills/yaw-000.png
  stills/yaw-015.png
  ...
  suppression/full.png
  suppression/<candidate>-hidden.png
  suppression/<pass>-disabled.png
```
