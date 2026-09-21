---
name: pixel-forensics
description: The measured way to root-cause any rendered-pixel defect, ANY project... intermittent visual failures, brightness/margin law violations, "something saturates/flickers/washes" bugs in canvas or WebGL scenes, unwanted banding/stripes on symmetric geometry, "added content that isn't showing up", and "it changes in the buffer but I can't see it / can't see the motion." Locate the exact offending pixel, attribute it by suppression matrix and crop, bisect with valid controls, then fix at the source by construction... and know when a change is MEASURABLE but not PERCEIVED (the additive/bloom-near-clip trap where brightness is a dead axis and only contrast/dimming reads). Extracted from consecutive wins on the Excelsior COSMOS build (sky saturation flake, mist orb-veil, ray pop, terrain moat/banding, invisible rope-flow current). Triggers on words like argmax, brightest pixel, saturate, blown out, intermittent visual, flicker, margin failure, luminance, suppression, bisect, veil, washed out, banding, stripe, ring artifact, void, gap that isn't a gap, invisible animation, can't see the motion, reads flat, additive, bloom, clipping, perceived vs measured.
---

# Pixel Forensics... Root-Causing Rendered Defects by Measurement

Guessing at visual defects burns iterations (two blind term-retunes failed
before this method landed its first win). The method is four moves, in
order, and the fix at the end is BY CONSTRUCTION, not by nudging.

## 1. Locate: argmax, not adjectives

Screenshot the failing pose (clip out UI chrome... HUD text and pills
contaminate both luminance samples and byte-compares). Scan for the
offending pixel (max luminance, or whatever the law measures) and record
its EXACT coordinates. Then crop a ~60px patch around it and LOOK at it...
attribution by appearance beats every hypothesis. On COSMOS the crop showed
a procedural star sitting on a galaxy halo... two prior "fixes" had been
aimed at the wrong term entirely.

## 2. Attribute: suppression matrix with honest controls

Re-render the same pose with each suspect system disabled (feature flags,
visibility toggles, dev URL params). The defect vanishing under exactly one
suppression is the attribution; identical numbers under a suppression mean
that system is INNOCENT... or your control is broken:
- **Falsy-zero trap**: `count || default` turns a `?layers=0` control into
  the default config, silently testing feature-ON twice. Guard every
  count-style param with `Number.isFinite(x) ? x : default`. This exact
  bug invalidated a control mid-investigation... identical four-decimal
  numbers on/off was the tell.
- Toggle ONE thing per cell. A matrix with compound cells attributes
  nothing.

## 3. Classify: deterministic or flaky... and distrust the flake

Run the measurement 5x. Deterministic-to-three-decimals means the defect is
geometric/static; run-varying means something time- or pose-unstable is in
the loop, and the FLAKINESS often has its own separate cause worth fixing
in the harness itself. COSMOS's "intermittent" saturation was two stacked
bugs: a real shader defect AND a battery that sampled a 900ms camera tween
at 600ms, so the pose itself jittered between runs. Settle animations/
flights before sampling (`waitForFunction` on the motion flag, then a
fixed settle), and re-classify after.

## 4. Fix at the source, by construction

A defect that is a SUM crossing a limit (additive blending, accumulated
scatter, bloom on top of a cap) is not fixed by rebalancing terms... a
rebalance leaves the worst case unproven and the next content change
regresses it. Impose a bound where the light is emitted: a hard ceiling
(`min(col, C)`), a bounded add (`min(contribution, B)`), a proximity fade
for view-dependent bleed. Then re-run the 5x measurement and require the
margin to be deterministic AND material (a 0.003 margin on a 1.0 scale is
a tie wearing a pass's clothes... open it or escalate the tradeoff).

**Pattern class beats magnitude on symmetric/repeating geometry.** On
cylindrical, radial, or tiled surfaces, a treatment keyed to the coordinate
that repeats (altitude on a ring, angle on a wheel, row on a grid) traces
that symmetry as a visible band or stripe BY CONSTRUCTION, no matter how
small its magnitude... a COSMOS terrain fix that read invisible at one
strength turned into glowing concentric terraces at a stronger one, because
it was keyed to height on an annular mesh and height contours on an annulus
ARE circles. Before tuning a candidate fix's strength, ask what shape it
traces as a pure function of the symmetric coordinate; key it to an
aperiodic field (noise, position hash, the low-frequency field already
shaping the surface) instead of the repeating one, and only then dose it
from the rendered read.

## 5. Measured is not perceived... the axis a pixel-diff can't see

A change can be REAL in the buffer and INVISIBLE to the eye, and a naive
pixel diff will confidently report the wrong verdict. This is a distinct
failure from a broken measurement (section 2)... the measurement is correct,
it just answers "did pixels change" when the question was "can a human see
it." Two moves keep you honest:

- **On an additive / bloom / HDR stack near clip, brightness is a dead
  axis... use CONTRAST.** A core already at/near 1.0 cannot get brighter
  where it's clipped, so a `+22%` lift moves only the dim fringe and a
  pixel-diff counts thousands of "changed" pixels the eye never registers
  (a COSMOS rope current measured ~20k changed px and read as not animating
  on the device). The fix is DIMMING, not lifting: a dark trough pulls
  saturated pixels DOWN out of clip, so the delta lands where a lift
  physically could not. Corollary: perceived brightness is RELATIVE to the
  neighbor, not the static field... once a dark trough exists, an adjacent
  unchanged crest reads 2-3x hotter (a subtle head becomes a fireball).
  Tune against the neighbor-relative read, not the absolute value.
- **Prove it in the MEMBER frame, not a proxy.** A color-buffer checksum,
  a vertex count, an `onBeforeRender` fire prove the machinery RAN, never
  that the result is legible. Measure the strong-change fraction (|dLum| >
  ~0.15, not the >0.02 that catches float noise) in the final composited
  frame with every OTHER mover frozen, so the signal is attributable. And
  freeze the CLOCK, not the pixels, when isolating one animator from
  another: a deliberately-pulsing element (a beacon) breaks a stillness
  compare unless you pin its phase while leaving it in frame... zeroing its
  visibility instead changes what's being measured.
- **Guard the checksum with a positive control.** If a "nothing moved"
  assertion leans on a hook (`_ropeColorSum` etc.), a broken hook that
  always returns the same value passes it silently. Add a paired check that
  the hook DOES differ when it should (two phases apart)... the control
  proves the method before the method proves the claim.
- **Continuous-watch signals need a max-over-windows, not one sample.** A
  traveling feature (a flow crest, a drift band) dips below threshold in
  whichever single window it crosses a dim gap; the member watches
  continuously, so the honest question is "does ANY moment read," i.e. the
  max over several windows, not a lucky slice.

## Traps that fake results (all hit live)

- Reading pixels from inside the page context can return uniform zeros...
  fall back to the driver's own screenshot + a PNG decode OUTSIDE the page.
- A separate rAF counter "measures 60fps" while the render loop is
  crashing every frame... count RENDERED frames (increment inside the
  loop after present), never independent ticks. Wrap the loop body in
  try/catch that records the first error.
- Multi-pass renderers zero their draw-call counters per sub-pass
  (`renderer.info.autoReset`)... disable and reset manually once per frame
  or the numbers describe only the last pass.
- Comparing frames for stillness/looping? Byte-compare the SCENE region
  only... any live HUD text breaks byte-identity while nothing visual
  moved.
- **"Added" content that draws but never reaches daylight**: a mesh proven
  to execute (an `onBeforeRender` hook fires, vertex counts check out
  offline) can still leave a scene's rendered pixels UNCHANGED if it sits
  inside geometry the scene already occupies at that depth range... a fill
  meant for a "gap" that turns out not to exist just gets buried. Before/
  after screenshots identical to three decimals across multiple size or
  strength attempts is that tell specifically, not a sign the change is too
  subtle... verify the target space is actually empty (map the existing
  content's real extent, don't eyeball it from one screenshot) before
  iterating on a fill's size.

## Related

`perf-measurement-hygiene` (the fps sibling of this skill... timing traps
where this one covers pixel truth) · `verify-before-asserting` (the
discipline both serve) · `real-input-proof` (interaction-truth sibling)
