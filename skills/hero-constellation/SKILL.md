---
name: hero-constellation
description: "The repeatable recipe for minting a hero-figure constellation into the Excelsior COSMOS sky... martial-arts legends drawn in living stars, the sky's own mythology. Use whenever Paul drops new hero art (\"add a hero\", \"mint hero N\", \"new constellation\", \"legend in the sky\", \"put X in the stars\"), whenever a brand mark or emblem joins the sky, or when tuning an existing hero's placement, brightness, or nodes. Encodes the gold-standard technique proven across five heroes and a CLOSED gate (PR #17 merged 2026-07-12, accepted in full): standing laws for billboarding and GPU texture warm-up, the composition doctrine (galaxy exclusion zones, separation minimums, discover-one-at-a-time, scale hierarchy, the disclosed-exception pattern), the clean-art generation spec that landed heroes 4 and 5 in one pass, geometric marks as distortion probes, and the doctrine change that deleted the generic pencil-web constellations sky-wide. Self-scoped to Excelsior only."
---

# Hero Constellations... Minting Legends into the COSMOS Sky

Five legends live in the sky as of 2026-07-12: hero 1 (the fighter, the
accepted gold standard for the technique), hero 2 (the star boy), hero 3
(the JJO emblem), hero 4 (the champion), hero 5 (the young champion). The
sky's OTHER population is real starfield and the two procedural galaxies
only... the generic pencil-web constellations that used to fill the rest
of the dome are GONE, deleted sky-wide on Paul's doctrine order (round 4),
not hidden or per-hero culled. **PR #17 is CLOSED, merged to main
2026-07-12... Paul's gate verdict was "accepted in full": mist, all five
heroes, sky composition, billboarding, the sky-wide web deletion.** This
skill is no longer describing work in flight; it is the recipe for hero
N+1. The MAD and the standing COSMOS laws (orbs-brightest, reduced-motion,
60fps floor, frozen holds) outrank everything here.

## Hero N is config, not code

`app/src/pol3d/environment.js` carries a `HEROES` array... one entry per
figure: `{ asset | procedural, dir, angularHeight, bgSubtract, nodeCount,
tint?, opacity? }`. `buildHeroConstellation(hero, reduce, seedOffset,
renderer)` consumes an entry; `buildSkyRich` builds them all. Minting
hero N is adding an entry and tuning its values... the array survived
five minting rounds without restructuring (it briefly carried a `cullDeg`
field for per-hero generic-web culling; deleted in round 4 along with the
webs themselves, see the doctrine change below). Two art paths:

- **`asset`**: a PNG filename in `app/src/pol3d/assets/` (repo-pinned,
  Vite-bundled... the deliberate ordered exception to the procedural-only
  environment convention; never a CDN). For figures... drawn characters,
  painterly art.
- **`procedural`**: a function returning a canvas, for GEOMETRIC marks
  (logos, emblems, sigils). **Never derive a geometric mark from an SVG
  export... this failed TWO consecutive gate rounds** (round 1: the full
  lettered logo leaked through; round 2: a hand-cleaned geometry-only SVG
  STILL leaked a stray remnant and a wrong line, each costing a full gate
  cycle to spot). Canvas 2D drawing makes the failure impossible by
  construction: the code can only draw what it's told. The emblem's
  `buildEmblemCanvas()` (circle + outer triangle + inner triangle, dots at
  vertices as node seeds) is the model.

## The sky-wide cleanup (round 4 doctrine change, 2026-07-12)

Through round 3, generic pencil-web constellations (nearest-neighbor
lines over 260 random points, `buildSkyCheap`) filled the dome as
placeholder mythology, culled within each hero's `cullDeg` as heroes
moved in. Paul's order at round 4: delete them ALL, everywhere, not
per-hero-cull... "the sky's population is now exclusively: real
starfield, the two galaxies, and the heroes." `buildSkyCheap` now
generates ONLY the point starfield (kept, it's real content); the
line-web generator, the per-hero `cullDeg` field, and the
extract-and-cull block in `buildSkyRich` are deleted outright, not
flagged off. A hero no longer "replaces" anything on placement... it
just needs to satisfy the composition doctrine below. Regression proof
is a DIRECT SCENE-GRAPH COUNT, not a pixel heuristic: a first attempt
thresholded a luminance/saturation band for the old webs' color
(0x6a7ca6) and caught 17-21% of every frame as false positives (the
mist and sky gradient share that same band). `window.__cosmosWorld.
counts().lineSegments` traverses the live scene for any `THREE.
LineSegments` and must read exactly 0... unambiguous, and it would catch
a regression that re-adds webs through any code path, not just the
deleted one.

## What Paul supplies per hero

For a FIGURE hero: two files, and the order names where they go:

1. **The figure art**: a PNG drawn as constellation linework with BRIGHT
   STAR NODES at the anatomical points (fists, shoulders, joints, crown,
   or whatever the figure holds... hero 5's medals were natural anchors
   the same way hero 1's fists were). ~800-1200px on the long side keeps
   fine hatching crisp at sky-gaze zoom. Transparent background is ideal
   but not required... **verify alpha at load by sampling border pixels,
   never assume either way**: hero 2 shipped real alpha (corners 0,
   figure ~254... `bgSubtract: false`); heroes 1/4/5 shipped opaque
   black or parchment grounds (`bgSubtract: true`, border-median
   subtraction... a near-no-op on a pure-black ground, but keeps the
   pipeline uniform rather than special-cased per hero).
2. **A placement mock**: his walkthrough screenshot showing which sky
   region and roughly what sky-fraction the hero occupies. **This has
   arrived inconsistently... heroes 4 and 5 BOTH shipped without one**
   (the order named a mock file that never reached Downloads). When it's
   missing, build from the verbal spec + composition math, flag the gap
   explicitly in the commit, and pin the mock retroactively if it
   surfaces later. Don't block the mint on a file that isn't coming.

For a GEOMETRIC mark: no art file... he names the shapes, the code draws
them. Pin whatever reference he sends into
`evidence/cosmos-world/reference/` before any code (standing law).

### Clean art, the spec that landed heroes 4 and 5 in one pass

Heroes 1, 4, and 5 shipped with zero asset-content gate rejections; hero
3 (the emblem) failed twice before switching to procedural drawing. The
difference, distilled into a spec for any new figure art:

- **A flat, near-black (or otherwise uniform) ground, not a baked scene.**
  `bgSubtract`'s border-median subtraction assumes the border ring is one
  roughly-uniform color... a source image with its OWN baked glow, gradient,
  or nebula behind the figure leaves visible residual haze after
  subtraction, because there is no single "background level" to remove.
  Plain black (or transparent, see below) is not a style preference, it's
  what makes the loader's math correct.
- **No lettering, no filled color badges, no baked logo treatment.**
  This is the specific lesson hero 3 paid for twice: any mark meant to
  read as constellation linework must actually BE linework at the source,
  not a flattened graphic-design asset with a linework aesthetic. If the
  content is geometric (a mark, not a figure), draw it procedurally
  instead of sourcing art at all... see `procedural` above.
- **Transparent OR opaque ground both work, but only if declared
  correctly.** Hero 2 shipped real alpha; heroes 1/4/5 shipped opaque.
  Neither is "more correct"... what matters is verifying which one you
  have (sample border pixels, don't assume) and setting `bgSubtract`
  to match.
- **Bright, distinct nodes at the anatomical (or geometric) high points.**
  Fists, shoulders, joints, crown, medals, or a geometric mark's own
  vertices, DRAWN bright enough that the luminance x alpha extraction
  pass finds them without hand-tuning per hero.

### Geometric marks double as distortion probes

A side effect worth using deliberately: a precise geometric shape (a
circle, a triangle) makes a rendering distortion immediately,
unambiguously visible in a way irregular figurative linework does not. A
foreshortened fist is easy to miss; a circle that reads as an oval is
not, even to a non-technical eye... this is exactly how Paul caught the
build-time-`lookAt` foreshortening bug in round 2, on the emblem, not on
a figure. If a future session suspects a projection, foreshortening, or
distortion defect anywhere in the billboard-plane pipeline, the fastest
confirmation is to render (or reuse) a geometric probe shape and check
it against its own known aspect ratio, rather than trying to eyeball the
error on organic art.

## The technique (hybrid... BOTH layers, neither alone works)

1. **The figure plane**: the art on an additive `MeshBasicMaterial` plane
   at radius ~462 (INSIDE the sky dome at 500, BEYOND the terrain at
   ~428... terrain, branches, and roofline depth-occlude him exactly like
   all sky). Tint ~(0.62, 0.68, 0.88) at opacity ~0.85 for figures;
   geometric marks run cooler and fainter (the emblem: 0.55/0.60/0.78 at
   0.42). `anisotropy 8` + mipmaps. **The plane BILLBOARDS the live
   camera every frame** (see the gotcha below)... never a build-time
   `lookAt` only.
2. **The living stars**: extract the art's own brightest pixel nodes
   COMPUTATIONALLY (never hand-guessed): luminance x alpha, 20px-cell
   local maxima, threshold ~0.55, top `nodeCount` with 30px
   min-separation. Seat them as a `THREE.Points` child OF THE PLANE
   (local coords ride its transform) with the per-node twinkle shader:
   slow sin (0.45 rad/s), per-node random phase, additive, star palette.
   He is MADE of stars, not pasted on them. Figures take ~18 nodes;
   geometric marks take FEW (the emblem: 6, both triangles' vertices...
   drawn as bright dots in the procedural canvas so the same extraction
   pass finds them, no special-casing).
3. **Placement is pure composition doctrine now** (below)... no web
   bookkeeping since round 4, nothing to replace, only headings to clear.

## Sky composition laws (hardened across rounds 2 and 4)

Round 2's rejection: all three heroes and the galaxy crammed into one
wedge, "the best element in the sky buried under traffic." Composition
doctrine is four things, together, every time a hero is placed or moved:
a measured exclusion zone around each galaxy, a measured separation
minimum from every other occupant (hero or galaxy), the discover-one-
at-a-time consequence that separation minimum exists to guarantee, and
a deliberate scale hierarchy across the roster. All four are
battery-enforced as pure-geometry assertions (no rendering needed):

- **The galaxy owns its zone.** The sky shader's two galaxies sit at
  `(-0.68, 0.40, -0.58)` (grand) and `(0.16, 0.50, -0.85)` (rose) in
  SKY_FRAG. The shader hard-cutoffs at 75.5deg but the visually
  meaningful glow is ~20deg. No hero enters it uninvited.
- **>=55deg separation between EVERY pair is the target**: hero-to-hero
  AND hero-to-galaxy. Check each new hero against the galaxies AND every
  existing hero, not just the one being placed. A member orbiting the
  courtyard discovers them ONE AT A TIME... never two heroes dominant in
  one browsing-pitch frame.
- **The law can run out of room... disclose the exception, don't force
  it.** Hero 1 is grandfathered at his accepted 18.5deg from the grand
  galaxy (fists brushing the halo was the point, not a defect). Hero 5
  needed to sit "low, just above the mountains" per explicit order; a
  full sweep of the low-elevation band against all four existing heroes
  + both galaxies found a best-available minimum of ~37deg, not 55...
  the dome was simply full at that elevation with four heroes already
  seated. Measure the true best-available number, use it (floored at
  ~30deg, comfortably past the galaxy's real ~20deg glow radius, the
  thing the law actually protects), and write the tradeoff into both the
  code comment and the battery assertion rather than silently forcing
  elevation up to manufacture 55deg... Paul's explicit placement
  instruction for a specific hero outranks the general target.
- **Scale hierarchy is intentional**: descending angularHeight = tiers of
  discovery depth (fighter 158 = champion 158 > boy 108 > young champion
  96 > emblem 62). Two heroes CAN share a scale tier (peers, not a
  strict ladder) when the order says so explicitly.
- **Elevation floor ~26-42deg, and it's asset-dependent.** A hero seated
  too low reads as almost entirely occluded by the tree canopy at
  browsing pitch... this happened TWICE (the boy at 30deg, hero 5 at
  20deg) and was caught faster the second time by checking sooner. Live-
  test canopy clearance from inside the ring before calling a placement
  final; raise the minimum needed while re-checking composition
  separation barely moves (it's nearly flat across a +-10deg elevation
  band in practice). Occasional branch interleave at some headings is
  parallax truth ("discovered, not pasted"); wholesale occlusion is a
  placement bug.

## The measured gotchas (each cost a debug loop... read before repeating them)

- **Additive blending hides BLACK, not grey.** Opaque-ground art reads as
  a floating RECTANGLE. `bgSubtract: true` runs border-median subtraction
  + re-gain at load; real-alpha art skips it entirely. Verify which case
  you have by sampling, never assume.
- **The camera-aim yaw formula is `atan2(dir.x, dir.z) + Math.PI`**...
  the battery's hero rows carry it literally. Re-deriving it from scratch
  and negating the args AGAIN double-applies the PI and points the test
  camera 180deg off. Caught only by cross-checking against hero 1's
  known-good pose as a control... always sanity-check new placement math
  against an accepted hero first.
- **Billboard the plane, never orient it once.** `plane.lookAt(0,40,0)`
  at build time is correct from exactly one camera position; any other
  orbit angle foreshortens the flat card for real (a circle reads as an
  oval... Paul caught it on-device). Fix: `plane.lookAt(camPos)` every
  frame via the hero group's `setCamera` hook, wired through the same
  world.js call site the mist's camera-proximity fade uses. NOT
  reduced-motion gated... it corrects geometry to the member's own view,
  same rule as the shaft/mountain pitch fades.
- **Force the GPU texture upload at load** (`renderer.initTexture(tex)`).
  Upload + mipmap generation is otherwise deferred to FIRST render use...
  with heroes spread across the dome, a member's first fast orbit reaches
  an unrendered hero and pays it live (measured: one ~29-38ms frame vs an
  18ms floor, first orbit of a fresh session only). Clustered heroes HID
  this cost inside the boot wait; spreading them surfaced it. Note
  `compileAsync` does NOT fix it... shader compilation is not texture
  upload.
- **Placement needs a sign probe, not a guess.** One capture at an
  intermediate yaw tells you which frame edge the hero exits, then set
  azimuth off the mock heading's center on the correct side.
- **Avoid azimuths near yaw ~= 2*PI.** A reproducible renderer seam
  (solid black band, diagonal cutoff) lives at the yaw wraparound
  boundary, content-independent, not yet root-caused... keep hero
  headings clear of it; flag it to whoever next touches yaw-wraparound
  code in world.js.
- **Retune brightness when art density changes.** Dimming tuned for a
  dense filled badge (opacity 0.20) rendered sparse unlettered strokes
  invisible; the same mark as bare linework needed 0.42. Opacity is
  per-art, not per-slot.
- **Pixel-color heuristics are fragile for scene-content regression
  proofs; scene-graph counts are not.** Proving "zero generic webs
  anywhere" by thresholding a luminance/saturation band for the webs'
  known color caught 17-21% of every frame (mist and sky gradient share
  the band). `window.__cosmosWorld.counts()` traversing the live THREE
  scene for `.isLineSegments` and asserting exactly 0 is unambiguous and
  survives future rendering changes the color band wouldn't.
- **Test discoverability from INSIDE the pavilion ring** (member orbit
  radius ~74). A strip shot from outside has the roofline eating the
  upper sky and reads as a false failure.
- **A low HUD fps during captures is screenshot-overhead contamination.**
  Bisect with in-page rAF counting (`?hero=off` as the control) before
  believing any cost. And guard every count-style dev param against
  falsy zero (`Number.isFinite(x) ? x : default`).
- **Device-vs-harness aspect mismatch is an open question.** Paul's
  device screenshots have run ~820x1393 (aspect 0.589); the WebKit
  iPhone test profile is 390x844 (0.462). A ~12% circle deviation
  measured in one of his captures could not be fully reproduced by
  projection math at the test aspect. If a stretch report survives the
  billboard fix, chase that mismatch... don't re-touch the art.

## Laws, per hero, non-negotiable

- **Billboard every hero plane, every frame, no exceptions.** Not a
  figure-only technique and not an optimization... `plane.lookAt(camPos)`
  via the hero group's `setCamera` hook is required for ANY hero,
  geometric or figurative, from the first commit that adds it. A
  build-time-only `lookAt` is a defect on arrival, not something to
  discover later; round 2 shipped one and it read as a stretched oval on
  Paul's own device.
- **Force the GPU texture upload at load, per hero, every time**
  (`renderer.initTexture(tex)`). This is not a tuning knob... skipping it
  defers a real, measured frame-time cost onto the member's own first
  fast orbit rather than paying it during boot.
- **Orbs-brightest gains a pose per hero**: a facing row in
  `cosmos-atmosphere-battery.mjs`'s luminance matrix (yaw =
  `atan2(dir.x, dir.z) + PI`, pitch to center, radius 74). Battery 3x
  minimum, margins reported.
- **Composition assertions ship with the placement**: the battery's
  angular-separation block (pure math) mirrors the HEROES dirs + galaxy
  dirs... update it in the same commit that moves a hero, so composition
  can't silently regress. If the hero is a disclosed exception (below
  55deg), assert the true measured floor explicitly rather than omitting
  the check.
- **Reduced-motion stills the twinkle** (frozen uTime by construction...
  the battery's byte-identical assertion catches any leak; billboarding
  survives it because a static camera means a static aim).
- **Zero generic webs, scene-graph proven**: `counts().lineSegments ===
  0`, one battery assertion, cheap to run every gate from round 4 on.
- **Evidence per round**: side-by-sides vs the art AND the placement mock
  (when one exists) in `reference-compare/roundN/` (keep rejected rounds
  as the record... never delete them), an inside-ring discoverability
  strip, a `hero=off` control at the same framing, and a full 8-heading
  360deg composition strip at browsing pitch. Capture-compare-iterate;
  Paul's eye is the gate, always. GATE-PENDING until his walkthrough
  word, never self-merged.
- **Texture memory disclosed per asset** at the gate (~1.4-8.0MB GPU per
  figure depending on source resolution, ~1MB for a 512x512 procedural
  canvas... plus source bytes in the flag-gated lazy bundle).

## Related

`cosmos-render-pipeline` (private skill, not published) (the render-path terrain this sits in) ·
[excelsior-ruled-slice](../excelsior-ruled-slice/SKILL.md) (the mock-driven iterate-to-his-eye loop) ·
[excelsior-preview-gate](../excelsior-preview-gate/SKILL.md) (getting it onto his phone + token hygiene) ·
[perf-measurement-hygiene](../perf-measurement-hygiene/SKILL.md) (the screenshot-contamination rule above) ·
[pixel-forensics](../pixel-forensics/SKILL.md) (locate/attribute/bisect for any rendered defect) ·
[excelsior-verify](../excelsior-verify/SKILL.md) (proof law behind the battery/evidence steps)
