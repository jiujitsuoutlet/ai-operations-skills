---
name: character-craft
description: Use for ALL work involving a rigged, animated 3D character in the Excelsior COSMOS renderer (STRIDE arc)... GLB character assets, skeletal animation, walk/idle/celebrate cycles, character materials and LOD, bone budgets, blend shapes, mesh swaps driven by the avatar config, character lighting in the scene, or evaluating character asset pipelines. Triggers on words like rig, rigged, GLB, skeleton, bones, animation clip, walk cycle, idle, blend shape, skinned mesh, character model, triangles, Draco, retopology. Self-scoped to Excelsior only.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# character-craft... the character earns the marble standard

Craft law for the STRIDE character asset. AVATAR-STRIDE-DECISIONS.md (private design doc, not included) owns the
architecture locks; the MAD wins on any conflict. This skill owns the
procedures that keep a 3D character Blizzard-grade on a phone.

## Budget envelope (hard walls... verify before import, not after)

<= 20k triangles... <= 2 draw calls (body + head/hair share atlases)...
<= 40 bones... texture atlas <= 1024px... Draco-compressed GLB... three baked
clips minimum (idle, walk, celebrate). Procedure: on any candidate asset, run
an inspection pass FIRST (gltf-transform inspect or equivalent) and record
tris/draws/bones/texture sizes in the evidence folder before the asset
touches the scene. An asset over budget gets decimated or rejected... the
60fps in-page WebKit iPhone floor never moves to accommodate art.

## Material law (Marble analog, verbatim discipline)

LOD may economize computation, never material. Concretely:
- Distance LOD may reduce bone influence counts, shadow resolution, and
  update frequency (animate every 2nd/3rd frame at distance).
- Distance LOD may NEVER swap the character to a sprite, billboard,
  flat-shaded proxy, or lower-grade material. The character seen far away is
  the same character, smaller.
- One material family, PBR-consistent with the scene: the character responds
  to the same warm-cool light tension as the tree. No unlit shortcuts, no
  baked lighting that fights the live god-rays.

## Config binding (one identity, two renderers)

Every PERSONA config field maps to exactly one of: a material parameter
(skin_tone, gi_color, hair color), a mesh swap (hair style, accessory,
body preset), or a blend shape (face fields). Build the binding as one
declarative map in one file... never scattered per-field logic. If a config
field cannot bind cleanly, stop: the fix is an additive PERSONA schema
amendment, never a fork of identity storage.

## Animation craft (game-feel-juice extends to gait)

- Walk cycle carries weight: contact, down, passing, up... visible
  follow-through in the gi. A floaty walk reads janky; janky ships never.
- Root motion decision stays consistent app-wide: the controller drives
  position, clips animate in place (matches tap-to-move pathing). Document
  it once in the STRIDE spec, never mix modes.
- Blend times between clips are named constants with stated values...
  retunes stated in numbers, never by feel alone.
- Celebrate clip fires on tier-up only... never on a randomized schedule
  (dark-pattern wall: no variable-ratio reward).
- Reduced-motion: character idles in a still pose, camera cuts replace
  glides. Test it explicitly.

## Loading discipline

Character GLB lazy-loads only when walk mode is entered... never on map
entry, never in the boot path. Loading shows the portal-fx grammar, not a
spinner invention. Memory: one character resident; entering a realm or
returning to map disposes GPU resources explicitly (geometry, textures,
mixer)... prove disposal with a heap/GPU snapshot before-after in evidence.

## Pipeline evaluation (when asked to compare asset sources)

Present commissioned artist vs licensed base mesh vs generated+retopo with
real numbers each: cost, turnaround, rig quality, license terms for a
shipped commercial app, and revision path when PERSONA's schema grows.
Budget envelope above binds all three. The pick is Paul's; the numbers are
yours to gather honestly... unknown means "I don't know, here's how I'd find
out," never a guess.

## Proof recipe (runs with excelsior-verify + canvas-perf)

Asset inspection numbers on record... 60fps in-page during walk with full
atmosphere... material integrity at 3 distances x 4 headings captured as
evidence frames... disposal proven... reduced-motion proven... standing
batteries green.
