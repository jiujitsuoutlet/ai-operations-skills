---
name: game-feel-camera
description: Use when building or tuning cameras, touch gestures, or motion feel in the POL galaxy... orbit/pan/zoom cameras, drag inertia, pinch math, tap-vs-drag discrimination, clamping, spring easing, hit-testing under a moving camera. Triggers on words like camera, orbit, drag, pinch, zoom, gesture, inertia, momentum, pan, game feel.
---

# Game-Feel Camera and Gesture Reference

This is reference math and mobile-game convention, not law. The MAD, the touch
census law, and Marble's material floors all outrank anything here.

## Camera model (orbit)

Represent the camera as spherical state around a target point:

    { yaw, pitch, radius, target: {x, y, z} }

- yaw: unbounded, wrap at 2π.
- pitch: HARD-CLAMPED to a range that never looks under the floor and never
  approaches ±π/2 (gimbal flip). A comfortable game range is roughly
  [-0.15, 1.25] radians depending on scene... tune to the ATLAS framing.
- radius: HARD-CLAMPED between a near bound (focus-entry distance) and a far
  bound (full canopy + margin). The ATLAS framed pose is the home pose.
- Derive the eye position from spherical coordinates each frame; build the
  view transform from eye → target. In Canvas 2D, project world points through
  this transform and painter's-sort by depth every frame.

## Gesture mapping

- One-finger drag: dyaw = -dx * k, dpitch = -dy * k, where k scales with
  radius so the world tracks the finger at any zoom (a good start:
  k = baseK * radius / homeRadius). The world must feel GLUED to the finger...
  latency budget is one frame from touchmove to camera update.
- Pinch: radius *= startDistance / currentDistance, clamped. Recompute the
  start pair on any finger add/remove to avoid jumps. Optional but premium:
  zoom toward the pinch midpoint by nudging target.
- Never mutate camera state inside the touch handler beyond storing input...
  integrate in the rAF loop. One writer, one loop.

## Inertia (the thing that makes it feel alive)

- Track velocity as an exponential moving average of the last few touchmove
  deltas (raw last-delta is noisy and causes flick spikes).
- On release: continue integrating velocity each frame with exponential decay,
  factor ~0.90-0.94 per frame at 60fps. Stop below an epsilon... never let it
  drift forever.
- Clamps still apply during inertia. On hitting a clamp, kill or reflect that
  axis's velocity... never let momentum grind against a wall visibly.

## Tap vs drag discrimination

- A tap is: total movement under a slop threshold (~10 CSS px) AND duration
  under ~300ms AND single-finger. Anything else is a drag or pinch... a drag
  NEVER fires a tap on release.
- Double-tap (two taps within ~300ms and slop) → animated tween home to the
  ATLAS pose, ease-out cubic, ~500-700ms, input suppressed or blended during
  the flight.
- preventDefault on touchmove within the canvas so the page never scrolls or
  rubber-bands under the gesture. Verify no passive-listener warning.

## Hit-testing under a moving camera

- Hit-test through the SAME projection used to render that frame... never a
  cached layout. Test tap-to-select from multiple arbitrary camera angles;
  the orb under the finger is the orb that focuses.
- Account for orb screen radius in the hit test (projected radius, not world
  radius) plus a small touch-target inflation (~8px) for fat fingers.

## Framing a chain on focus entry (the vertical-ladder law)

For "enter a linear run of nodes and have it read as a clean vertical ladder
rising away from you"... derived and shipped on COSMOS ASCENT, generalizable to
any camera that focuses a chain/branch/path of objects.

**Anchor on the end you want at your feet, not the one that was tapped.** If
seating walks a chain from its outward tip backward toward its root, then the
tapped/gateway node is the FAR end... anchoring the entry pose there and
pushing the target further along the axis produces "top of the chain, looking
down and away." Structurally the wrong end; no constant fixes it.

**Two properties decide whether a chain reads clean, and both must be
normalized PER CHAIN or identical constants give wildly different results:**

- **Obliquity**... the angle between the camera's look direction and the
  chain's own axis. Near 90deg (perpendicular) the chain projects at uniform
  scale and the nodes separate evenly. End-on, far nodes shrink and crowd while
  near nodes dominate the frame, which reads as "jumbled." Measured example:
  85.3deg read as gold, 61.3deg read as jumbled, same pose constants.
- **Screen fill**... what fraction of the viewport the chain's own line spans.
  A chain filling ~0.98 of frame height IS the frame and pushes neighbours to
  the periphery; one filling ~0.67 leaves a gap that neighbouring objects fill,
  which reads as clutter even though the chain itself is fine.

The law, one formula, no per-chain authoring:

    pitch_i  = OBLIQUITY_TARGET - elevation_i   (chain meets the look
               near-perpendicular regardless of its own world tilt)
    radius_i = FILL_K * chainSpan_i             (constant apparent fill
               whether the chain has 2 nodes or 6)
    target   = the chain's own midpoint         (centers the ladder)

**Calibrate the constants so the pose a human already ruled "perfect" falls out
of the formula by construction**, then verify it reproduces that pose to ~1%.
The blessed pose becomes the law's own output rather than a special case, which
is what keeps the rule honest and stops it decaying into hand-tuned poses.

**`radius_i` needs a MIN-RADIUS FLOOR, and the naive floor is wrong.** Chains
near-vertical (a trunk, a spine, any axis with ~zero horizontal extent) can
resolve too close under plain `span * FILL_K` and breach an orbs-brightest /
no-overlap render envelope, because near-vertical geometry often shares a
rope/edge corridor across multiple coincident-axis segments (stacked
additively) in a way a horizontally-fanned chain never does. Two traps when
picking the floor:
- **A single flat floor moves chains that were already fine.** Raising the
  general minimum to whatever value clears the near-vertical case will also
  drag every SHORT chain up to it, including an already-ruled-gold pose sized
  well below that floor (measured on ASCENT: bumping the floor to the trunk's
  safe radius would have moved 10 of 14 branch chains, wrestling's own gold
  pose included). Don't.
- **Span is NOT the discriminant.** Two chains can share the exact same span
  and the exact same raw resolved radius, with one perfectly safe and the
  other breaching the envelope (measured: a trunk segment and two branch
  chains resolved to the identical radius from the identical span; only the
  trunk failed). The real variable is verticality, not size. A smooth ramp on
  elevation over-corrects too... it can drag a legitimately-steep BRANCH
  (elev ~75deg, still safe) up toward the same floor a true-vertical trunk
  needs (elev 90deg), moving a chain that was never broken.

  Gate the extra floor on the chain's own near-zero-horizontal-extent test
  (whatever boolean already distinguishes "this axis has no meaningful
  horizontal direction" in your camera code... reuse it, don't invent a new
  threshold), not on elevation as a continuous ramp and not on a name/module
  check. `radius_i = max(span_i * FILL_K, elevated ? MIN_RADIUS_STEEP :
  MIN_RADIUS)`. Measure the actual safe floor per your own render envelope
  (don't guess a number)... on ASCENT that was 24 world units, margin 0.0073
  against a required 0.006, with the curve flat well above that point.

**Do not hand-author N poses.** If you find yourself special-casing individual
chains, the shape is wrong... go back and find the property that separates the
good one from the bad ones, and normalize THAT.

**Diagnose by measuring, not by staring.** Measure per chain: axis elevation,
obliquity, own-node screen-line fit (angle off vertical + perpendicular RMS),
screen bbox/fill, and foreign-object counts inside the frame and near the
chain's line. On ASCENT this immediately killed the intuitive hypothesis...
own-node scatter measured EXACTLY zero on every chain (perpendicular RMS 0.0px,
because the camera is coplanar with the chain by construction), so the "jumble"
was never scatter at all. Hours saved by one probe.

### The measured LIMIT of this law (unsolved, state it, do not paper over it)

**Chains that attach low on a trunk... inside surrounding object mass... cannot
be framed by this law.** The eye position that squares such a chain to the
camera (the entire point of the obliquity target) lands INSIDE the neighbouring
mass, so the frame fills with foreign objects and near-camera geometry no
matter what the pitch/radius formula produces. Perpendicular framing and
eye-clearance are in genuine conflict for these cases, not merely mistuned.

Escaping it means swinging yaw around the obstruction by a computed clearance
angle, which trades away the vertical-ladder read for exactly those chains...
a design tradeoff, not a tune. **Unsolved as of this fold-in.** When you meet
it: recognize it as structural, defer it as its own slice, and do NOT
hand-tune the offending chains into bespoke poses to hide it.

## Performance conventions

- All camera math in the rAF loop; touch handlers only record input.
- No allocation in the per-frame path (reuse vectors/objects).
- Labels and HUD reproject with the camera or hide during flight... never
  flash at stale positions (this exact bug shipped once and was caught in
  audit; it is a known failure mode).
- Measure fps DURING continuous drag and pinch, not at rest, on the WebKit
  iPhone profile, at both densities.

## Known local failure modes (from this codebase's history)

- Leftover canvas state (globalAlpha, composite ops) leaking between draw
  passes... defensive save/restore or explicit resets around each pass.
- Verification by synthetic dispatched events... banned; use the real WebKit
  touch profile.
- Floors claimed from measurements taken before the final code state... stale;
  re-measure fresh.
