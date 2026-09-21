---
name: cosmos-floor-authoring
description: "Laws and the proven recipe for authoring ANY walkable ground surface in the Excelsior COSMOS world... mats, mat islands, pavilion floors, zen-garden ground, future zone floors. Use when proposing or building a floor layout, authoring floor colors or materials under the night rig, deciding gloss/specular on a walkable surface, laying panel grids, or designing floor gates and batteries. Encodes the mats-slice gold standard (PR #18, f49b050): the reference-photo-is-the-spec prime law, the mat recipe, mockup-vs-in-engine gate doctrine, backward color derivation + disclosed self-lift, the specular envelope law, no-repeat on aligned grids, the shard-arc forensics laws, and the knock-on checklist. Triggers on words like floor, mats, mat island, panels, tatami, walkable, ground surface, vinyl, grid layout, seams, gloss, specular floor, no-repeat, self-lift. Self-scoped to Excelsior/COSMOS only."
---

# COSMOS Floor Authoring... Laws for Walkable Ground

MINTED 2026-07-13 from Paul's ratified dictation at the close of the mats
slice (PR #18, merged at f49b050)... four verbal redirects and a forensics
arc bought these laws. Precedent is [hero-constellation](../hero-constellation/SKILL.md): proven recipe
becomes its own skill, so floor N is first-try instead of four redirects.
Scope: ANY walkable ground surface in COSMOS... mats, pavilion, zen
garden, future zones. Procedural only... doctrine stays in the vault docs,
and the MAD, FLAGSHIP, and frozen holds outrank everything here. Composer
chain and envelope math live in `cosmos-render-pipeline` (private skill, not published)... reference
it, never duplicate it.

## PRIME LAW... the reference photo is the spec

Words only translate the reference; when word and photo conflict, the
photo wins... flag the conflict instead of obeying the words. Evidence:
four verbal translations in the mats slice (concentric rings, 3:1 panels,
running bond, cut-panel frame), four misses, photo right every time. Pin
the reference photos into evidence/ BEFORE any proposal round.

## The mat recipe (gold standard as merged at f49b050)

- Mats are FURNITURE, not architecture... a straight rectangular island
  ON the floor; the room shape never bends the grid.
- ONE panel module everywhere, 2:1 real tatami proportion.
- Border = a picture-frame course of the SAME module in the accent color.
- Aligned straight grid... running bond is masonry language, revoked.
- Zero cut panels except geometry-forced trims.
- Hairline butt seams, an AO whisper, edge bevel catching light, subtle
  center dome.
- Gloss by specular response only, NO SSR.

## Gate doctrine

Flat mockups approve LAYOUT ONLY. Color and material approve only
in-engine, as rendered stills, in mist-on/mist-off pairs. A passed
battery is only clean AT THE POSES SWEPT... proof poses must include
where the human actually looks, close-base and orbit range both.

## Color authoring

Pick the target perceived on-screen value under scene lighting and derive
the albedo BACKWARD... never flat-pick a hex. If no albedo reaches the
read under the incident light, the sanctioned mechanism is texture-driven
self-lift, hue-true, always disclosed. Dark bases shift further under
additive decals than mid bases... retune the decals on any base change.

## Specular envelope law

Floor luminance INCLUDING specular peaks stays under orbs-brightest.
Probe the worst cases before flagging the human. Trade gloss before
brightness. Attribute stubborn peaks by invariance-under-material-change.
If one emitter cannot both gradient at distance and stay legal up close,
SPLIT the emitter.

## No-repeat on floors

Aligned grids read regularity hardest... per-panel mottle and micro hue
drift must vary unit-to-unit AND row-to-row, with the measured check
always in the battery.

## Forensics laws (from the shard arc)

- Fix by construction (cut the hole), never by offset tuning.
- Defects can be load-bearing for other defects... attribute and fix in
  dependency order.
- Clean surfaces reveal debt busy surfaces dithered away... expect new
  artifact classes on any simplification.
- Depth-precision defects are distance-dependent... close stills can
  never clear an orbit-range bug.
- Motion catches what stills structurally cannot... the temporal sweep
  gates the re-dealing classes.
- Calibrate every detector by reinstating the defect it exists to catch,
  and document detector failures honestly.

## Knock-on checklist (any floor change)

Warm decals retune... mist read re-verify... texture memory disclosed...
fps at battery only, never from still HUDs... reduced-motion untouched.

## Numbers that landed (cite f49b050, never re-derive)

The committed values are the record; re-derivation is how verbal drift
re-enters. Most live in `cosmos-render-pipeline` (private skill, not published) "The floor" section
(island half-side 54, module 10.8x21.6, 50 full panels, garden trim r=9,
roughness 0.55 / metalness 0, self-lift 0.30, envelope margins 0.988 vs
0.979 base and 0.978 vs 0.912 wide, 18-pose sweep at flip threshold
0.006)... reference the map, don't duplicate. Named constants at f49b050
`app/src/pol3d/environment.js` buildMats: `ISLAND_HALF = 54, FRAME_D =
10.8, PANEL_D = 10.8, PANEL_L = 21.6, GARDEN_CUT_R = 9`; material
`roughness: 0.55, metalness: 0, emissive: 0xffffff, emissiveMap: tex,
emissiveIntensity: 0.3`. Grey targets and the ember frame are PAINTED
into the albedo canvas per the color-authoring law (the frame authored
gentler than a straight 2x of #6e2430, measured under the warm wash)...
read them from f49b050's buildMats canvas code, not from any doc.

## Related

`cosmos-render-pipeline` (private skill, not published) (composer chain, envelope math, the floor
terrain map) · [hero-constellation](../hero-constellation/SKILL.md) (the proven-recipe-to-skill
precedent) · [pixel-forensics](../pixel-forensics/SKILL.md) (the argmax/suppression method the shard
arc ran) · [excelsior-ruled-slice](../excelsior-ruled-slice/SKILL.md) (Paul's gate mechanics) ·
[excelsior-verify](../excelsior-verify/SKILL.md) (battery and evidence law)
