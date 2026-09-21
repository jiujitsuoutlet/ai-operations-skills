---
name: excelsior-galaxy
description: Use when placing, seating, or spacing lesson orbs on strands in the POL galaxy, rendering strands/ropes, or reasoning about how orbs sit under the map orbit camera. Triggers on words like orb, strand, rope, seat, seating, placement, spacing, clump, jumble, centerline, trunk, canopy, helix, node position, LOD, canvas galaxy. Complements game-feel-camera (which owns the camera/gesture math); this owns what sits IN the world.
---

# Excelsior... Galaxy Seating and Strand Laws

game-feel-camera owns how the camera moves. This owns what sits in the world the camera
looks at: where every orb seats, how strands render, how the tree stays coherent. Procedural
only... the donor CLAUDE.md's 10 locked properties and the MAD win on any conflict. The
marble MATERIAL is owned by MARBLE law (do not restyle orbs here); this is about POSITION.

## The one-orb-one-seat law

Every lesson orb sits ON its own module's strand centerline, in lesson order, evenly
distributed along the rope's usable span. One orb, one seat, one rope. The Duolingo gold
standard is the felt spec: a clean readable path, never a pile.

Concretely, when computing an orb's position:
- **On the centerline.** Orb center within a tight tolerance of the strand centerline (WEAVE
  used 0.35 x orb radius, measured from rendered pixels). No random sideways push... a
  sideways offset term is how orbs end up floating beside their rope.
- **In order.** Position along the rope follows lesson order from the data. Never seeded-
  random position... random means out-of-order and uneven.
- **Evenly spread across the USABLE span.** Distribute across the rope's usable length, not
  marching at fixed spacing from one end. Fixed spacing overflows a short rope (orbs walk
  past the end into the parent junction = clump) and under-fills a long rope with few
  lessons (both orbs huddle at one end = sparse clump). Compute seats as fractions of the
  usable span so 2 lessons spread and 12 lessons spread, both correctly.
- **Never into the junction.** Reserve clearance at the parent-junction end so no module's
  orbs land on the pile where sibling ropes converge.

## Shared-rope span ownership

A root module (Foundations) has no incoming rope, so its lessons want to seat along its
OUTGOING rope... the same physical rope its child's lessons march down from the other end.
Two modules interleaving orbs on one rope with no span ownership is a clump generator. Split
the shared rope into DISJOINT spans: each module owns a contiguous fraction, with clear air
between the last orb of one and the first of the next. The root's span reads as the tree's
root, not as lessons crowding the child's driveway... bias the split so the root sits toward
the trunk.

## Orbit-invariance by construction

If orbs and ropes both draw from the same world coordinates under the same camera transform,
a centerline seat stays seated at every rotation angle and pinch level... invariance comes
for free. Design placement in world space, not screen space. Then PROVE it anyway: measure
seat accuracy across a rotation sweep (WEAVE used 8 angles x 3 pinch levels). A structural
argument is a hypothesis until the pixels confirm it.

## The trunk strand

The tree has a visual root: a strand below/into the root module (Foundations) that feeds the
whole canopy, same strand material as every other rope, carrying no orbs until pre-root
content exists. A tree with no visible root reads as floating. The trunk is not optional
decoration... it is the visual anchor the donor tree always implied.

## Topology laws (from ATLAS/data-driven build)

- Single connected tree. Every module descends from the root or another rooted module, or it
  renders as a disconnected island with no rope. There is no free-floating module.
- Fully data-driven. Labels, orb counts, and membership bind 1:1 to real published content.
  Sparse gaps on long ropes fill as content is authored... a gap is a content state, not a
  render bug (but prove the existing orbs seat correctly regardless of gaps).
- Real per-lesson completion wins over path order for badge/done state (standing audit fix).

## Verification hooks (hand off to excelsior-verify)

- Seat accuracy, order, spread, and orbit-invariance are measured from rendered canvas pixels
  via the instrumented probe/offscreen readback, never eyeballed.
- Any placement change re-runs the MARBLE material battery (moving orbs must not harm the
  material) and holds frame rate on the WebKit iPhone profile.
- Paul's eye at the map angle overrides any tolerance number... "on the rope" is the standard.

## What this skill is NOT

Not camera/gesture math (game-feel-camera). Not orb material/color/specular (MARBLE law in
the MAD). Not map fit/labels (ATLAS, shipped). Not a license to touch donor files (byte-
identical law).
