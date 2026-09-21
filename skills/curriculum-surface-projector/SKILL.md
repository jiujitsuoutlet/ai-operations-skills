---
name: curriculum-surface-projector
description: Re-project an existing Excelsior curriculum topology onto replacement world geometry while preserving all lesson identities, branch relationships, ordering, progression state, touch targets, and camera behavior. Use when replacing or transforming a tree, branch carrier, root system, socket, or other learning surface without redesigning the curriculum.
---

# Curriculum Surface Projector

Move the carrier, never the curriculum contract.

## Invariants

- Preserve the exact station count, stable lesson IDs, branch membership, order, parent/child relationships, availability, completion meaning, and routing.
- Preserve camera laws and touch precedence unless separately ruled.
- Read progression from existing member state. Do not invent state or mechanics.

## Projection workflow

1. Snapshot the source topology and interaction census before transforming geometry. Use [references/station-contract.md](references/station-contract.md).
2. Finish the carrier's scale, root-footprint centering, orientation, and world transform before projecting stations.
3. Build a spatial query structure over the final visible surface. Project each station from a governed seed and reject backfaces, hidden interiors, ground discs, or foliage unless explicitly intended.
4. Offset the visual station and its hit carrier along the resolved surface normal. Keep the physical intersection or recess required by the approved art direction.
5. Route helix/path channels over the surface rather than through open space. Smooth paths without changing station order or topology.
6. Recompute labels and leaders only through the existing reveal/collision system. Preserve final governed label rects where frozen.
7. Verify all station IDs, positions, normals, carriers, labels, and hit targets after serialization and production build.

## Required proof

- exact before/after topology checksum;
- exact station count and zero duplicate/missing IDs;
- projection distance and normal sanity report;
- real touch census at map and focus distance;
- completion spine and return-pose proof;
- visual crops showing embedded contact rather than floating or buried stations.

If an asset cannot carry the real topology without hiding content or corrupting touch precedence, reject the asset or seek a separate ruling. Do not quietly move, delete, or merge stations.
