---
name: radiance-geometry
description: Build and verify imported tree geometry and curriculum strands for Excelsior RADIANCE after diagnosis authorizes a geometry-side change. Use for GLB intake or decimation cleanup, connected-component stripping, geodesic centerlines, uniform arc-length resampling, centripetal Catmull-Rom smoothing, rotation-minimizing frames, paired double helices, orb-station phase locks, merged strand draws, or station immutability proof.
---

# Radiance Geometry

Use only after `radiance-diagnose` classifies the repair as authorized geometry work. Read the current MAD amendment and `cosmos-render-pipeline` (private skill, not published) first. Do not infer permission to touch the focus canvas, composer, camera, routing, player, progression, or touch precedence.

## Choose the lane

- For asset cleanup, read [references/asset-intake-contract.md](references/asset-intake-contract.md).
- For surface strands, read [references/double-helix-contract.md](references/double-helix-contract.md).
- When both apply, finish and prove asset intake before regenerating surface paths. Geometry changes can invalidate every projection.

## Preserve invariants before editing

Capture a machine-readable station snapshot containing stable ID, module ID, local ordering index, world position, hit target, and any progression key. Preserve the exact pre-change snapshot as evidence.

After the change, run:

```bash
node scripts/station-lock-check.mjs before.json after.json
```

Any identity, ordering, target, or position drift is a failure unless the amendment explicitly opens that invariant.

## Asset-intake law

1. Inspect raw and processed assets separately.
2. Identify every node, primitive, component, material, triangle count, and bound.
3. Prove stray geometry by isolating its exact source triangles or component.
4. Remove confirmed non-subject geometry in the reproducible intake or decimation step.
5. Regenerate the shipped GLB and its audit manifest.
6. Re-run projection, touch, performance, and orbit proofs against the regenerated asset.

Never ship a runtime visibility hack for unwanted source geometry. Never strip by a broad rule such as "remove all planar components" without retaining positive evidence that legitimate tree geometry survives.

## Strand-construction law

Build from each path's ordered station-bearing centerline:

1. Resample at uniform arc length.
2. Smooth with centripetal Catmull-Rom without moving station anchors.
3. Construct rotation-minimizing frames by parallel transport. Do not use Frenet frames on noisy paths.
4. Project the lateral axis into the local surface tangent plane and normalize it.
5. Generate two strands 180 degrees out of phase.
6. Add a small alternating surface-normal lift so the strands visibly weave.
7. Lock every station to maximum lateral separation and every midpoint to a crossing.
8. Choose an integer number of half-twists between consecutive stations.
9. Keep the orb on the unchanged centerline between the strands.
10. Merge all compatible strand geometry into the minimum draw count while retaining per-path colors.

Use ribbons or tubes with at most six radial segments. Keep strand value below orb value across the declared pose battery.

## Proof before handoff

- Station-lock check passes.
- No NaN, zero tangent, frame flip, or sudden lateral-axis sign inversion exists.
- Every station has maximum separation within tolerance.
- Every inter-station midpoint crosses within tolerance.
- Triangle and draw budgets are reported as before, after, and delta.
- Close views show two legible strands rather than one scribbled cable.
- The orb-margin minimum remains above its floor.

Hand the final code state to `excelsior-gate-release`. Evidence measured before the last geometry edit is stale.
