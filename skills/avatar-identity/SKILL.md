---
name: avatar-identity
description: Use for ALL work on the Excelsior member avatar identity system (PERSONA arc and beyond)... character creator UI, avatar config schema, deterministic portrait compositing, avatar surfaces (wheel, map marker, tier-up), the avatars table, or any change to how a member's character looks or is stored. Triggers on words like avatar, character creator, persona, portrait, config schema, skin tone, gi color, belt display, silhouette, compositor. Also triggers whenever a slice touches the avatars table or renders member identity anywhere. Self-scoped to Excelsior only.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# avatar-identity... one identity, rendered honestly

Procedural craft law for the member avatar. The MAD and the AVATAR docs
(PROJECT-PERSONA-spec.md (private design doc, not included), AVATAR-STRIDE-DECISIONS.md (private design doc, not included)) own the architecture...
this skill owns the how. On any conflict, the MAD wins.

## The config is the asset

The avatar is a config object, not pixels. Every renderer (2D compositor
today, rigged 3D character later) is a pure function of that config. Work in
this order, always:

1. Read the current schema (types.d.ts + the avatars table) before touching
   anything. Never invent fields inline.
2. Schema changes are ADDITIVE ONLY once shipped... new enum values append,
   fields never rename or remove. Bump schema_version on any addition and
   write the migration read-path for old rows in the same PR.
3. Every field must map cleanly onto a future 3D character parameter
   (material slot, mesh swap, blend shape). If a proposed field can only
   ever be 2D, it is designed wrong... stop and re-derive.
4. Enums and curated palettes only. No numeric sliders, no free text, no
   uploads, no generated likeness. If a request implies any of these, stop
   and surface it as a spec conflict.

## Determinism law

Same config, same pixels... always. Procedure for any compositor change:

- Compose from layers in a fixed, documented z-order; layer order lives in
  one constant, never scattered.
- No Math.random, no Date, no device-dependent measurement in the render
  path. Fonts and images fully loaded before composite (await, don't race).
- Cache the composite keyed by hash(config + schema_version); invalidate on
  either changing.
- Proof: render the same config on two cold loads, hash both outputs, hashes
  match. This joins the evidence gallery of every avatar slice.

## Honesty laws (procedural, absolute)

- Belt color renders from server-derived rank state only... today that means
  white for everyone. There is no code path where the client chooses belt.
  If a task asks for belt selection in the creator, stop; that violates the
  earned-never-picked law.
- The default silhouette (no avatars row) is a first-class render path...
  test it explicitly on every slice, never assume the row exists. Second
  Member has no row on purpose.
- No guilt copy anywhere near the creator invitation ("your character misses
  you" class of copy is banned by GAME-DESIGN.md (private design doc, not included)). Invitation persists
  quietly; skipping costs nothing visible.

## Surface discipline

- Three surfaces (wheel portrait, map marker, tier-up moment) until an
  amendment adds more. Rendering the avatar on a new surface without an
  amendment is scope creep... stop.
- On the map: instrumented check that no avatar pixel exceeds orb material
  brightness/saturation. The path of learning owns the eye; the avatar is
  subordinate. Measure, don't eyeball.
- Portrait sizes render from one source composite scaled down, never
  re-composed per size... one identity, one render, many crops.

## Proof recipe (runs with excelsior-verify)

Determinism hash check... missing-row silhouette check... forged cross-member
avatar write rejected server-side... creator controls in the touch census at
the new count... map frame rate unchanged in-page... contrast >= 4.5:1 on
creator UI. Claimed vs proven, per line, in the close-out.
