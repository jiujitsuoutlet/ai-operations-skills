---
name: glb-asset-foundry
description: Intake, inspect, compare, decimate, and prepare GLB assets for a governed Excelsior WebGL world without losing provenance or visual truth. Use for Meshy or artist-supplied trees, landmarks, foliage, sockets, roots, or world props when candidates need structural inspection, live-world comparison, silhouette-preserving reduction, cost reporting, and founder selection before integration.
---

# GLB Asset Foundry

Preserve the raw source. Optimize only a selected candidate, and judge it in the real world.

## Intake

1. Copy every source byte-for-byte into the project intake area. Record filename, hash, source, date, license/provenance, and whether it is a raw generate or textured derivative.
2. Prefer raw generate variants for geometry when project materials will replace generated paint.
3. Run `scripts/inspect_glb.py` and inspect the scene graph, meshes, primitives, accessors, materials, textures, animation, and estimated triangles.
4. State structural limits honestly. A single welded mesh cannot support per-node foliage toggling; it requires semantic geometry splitting or a separate layer.

## Compare

1. Establish viable candidates before decimation.
2. Render candidates in the same production world, camera poses, lighting, topology, and interaction state.
3. Report triangles, draws, texture memory, projected material cost, orb/channel occlusion, root fit, silhouette, and likely device risk.
4. Preserve a contact sheet at HERO-1 and at least two governed orbit poses. Do not select from isolated turntables alone.

## Prepare the selected asset

1. Remove source ground discs or presentation geometry that does not belong in the world.
2. Center using the meaningful physical footprint, such as root flare, not a canopy-skewed bounding box.
3. Decimate progressively. Measure silhouette retention at governed views and inspect terminals, crotches, roots, thin features, UVs, normals, and material seams after every step.
4. Prefer adequate smooth topology over uniform high radial density. Spend geometry only where screen-space silhouette requires it.
5. Archive rejected candidates in the intake record and remove them from the production world path.

## Foliage decision

Cost baked canopy geometry and a separate instanced leaf layer independently. State whether foliage is decorative or member-state driven. Any new progression meaning requires a separate product ruling; display-only foliage does not invent progression.

Use [references/intake-gates.md](references/intake-gates.md) as the acceptance record. Physical-device milliseconds, not triangle count alone, decide whether an integrated asset ships.
