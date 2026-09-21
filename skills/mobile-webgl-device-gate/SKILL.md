---
name: mobile-webgl-device-gate
description: Prepare, run, receive, and judge physical-phone WebGL performance evidence for Excelsior/COSMOS. Use when a visual slice needs an actual iPhone frame gate, when desktop Playwright FPS conflicts with device feel, when cadence, thermal, viewport, DPR, load, orbit, focus, or drag performance must be compared, or when a posted device artifact needs validation against v2.22/v2.23-style laws.
---

# Mobile WebGL Device Gate

Treat the physical device artifact as proof. Treat desktop harness numbers only as regression signal.

## Prepare

1. Build the production bundle from the exact commit under test; embed the full commit hash.
2. Serve persistently on the LAN with a live receiver. Verify the app boots in fresh WebKit, not merely that HTTP returns 200.
3. Reuse an existing authenticated test session. Request a new OTP only when no valid session exists and surface provider retry-after time.
4. Require the governed viewport, renderer DPR, Safari foreground, Low Power Mode state, cooled phone, and fixed script. See [references/device-protocol.md](references/device-protocol.md).

## Measure

Capture warmup cadence, load/first-stable-frame, fixed orbit, focus flight, and trusted finger drag. Report for every leg:

- median and P95 frame time;
- dropped-frame and cadence-miss percentage;
- long-frame count/percentage;
- worst frame and frame-time spread;
- inferred refresh cadence and device conditions.

Judge absolute locked-30 and tail stability. Do not compare medians across different cadence classes, viewports, thermal conditions, builds, or scene feature sets.

## Decide

- Validate the artifact with `scripts/summarize_device_report.py`.
- If the run is invalid, say why and rerun; never waive conditions after seeing the result.
- If a before/after difference is smaller than run variance, report it as unresolved.
- Do not spend projected milliseconds. Bank only recovery measured on the phone.
