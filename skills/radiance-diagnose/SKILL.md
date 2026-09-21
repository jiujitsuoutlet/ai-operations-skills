---
name: radiance-diagnose
description: Diagnose camera-dependent visual defects in Excelsior RADIANCE and COSMOS before production edits. Use for orbit flashes, black frames, occluding quads, flicker bands, asset-versus-compositor disputes, exact-pose reproductions, scene-graph dumps, suppression matrices, 360-degree galleries, or any slice with a conditional stop tied to canvas, routing, or the frozen render pipeline.
---

# Radiance Diagnose

Apply this after `context-hygiene`, `excelsior-diagnose`, and the current MAD or amendment. Let stricter slice instructions win.

## Start with provenance

1. Confirm the intended repository, worktree, branch, PR base, and exact head commit.
2. Record pre-existing changes without touching them.
3. Confirm the server process cwd and served bundle marker before measuring pixels.
4. Extract opened surfaces, frozen surfaces, stop clauses, required poses, and proof floors from the governing amendment.

Do not edit production code until the mechanism is named and the conditional-stop decision is explicit.

## Reproduce the reporter's frame

- Match viewport, DPR, browser engine, camera target, radius, elevation, azimuth, query flags, fixture, and animation phase.
- Capture the exact reported pose before exploring adjacent poses.
- Freeze nondeterministic motion with existing diagnostic hooks. Never use member-reachable controls as test instrumentation.
- Record the app commit inside the artifact. Reject evidence from a mismatched commit.

## Attribute by suppression

Change one variable per cell and restore the full scene before every cell. Use this minimum matrix when relevant:

1. Full scene.
2. Suspected asset hidden.
3. Adjacent geometry hidden.
4. Owning group hidden.
5. Existing post-process pass disabled by its diagnostic switch.
6. Alternate browser engine at the same pose.

A hidden object only proves ownership of its contribution. It does not prove that the object's source geometry is defective. A pass-disabled control that removes the defect while the object remains visible attributes the mechanism to that pass.

## Audit imported geometry

Run:

```bash
node scripts/glb-audit.mjs path/to/asset.glb > /tmp/asset-audit.json
```

Read the scene graph, primitive counts, connected components, bounds, covariance planarity, maximum triangle span, and planar candidates. Then compare those source-space facts with the runtime mesh after intake transforms.

Treat these as different claims:

- A separate node or primitive is stray.
- A disconnected component is stray.
- Coplanar triangles are welded into tree geometry.
- Valid geometry triggers a compositor artifact.

Prove the exact candidate with a temporary diagnostic visibility split. Remove diagnostic production edits before the final diff. The shipped fix must remove confirmed stray geometry at asset intake or decimation, never hide it at runtime.

## Sweep the orbit

Read [references/orbit-sweep-contract.md](references/orbit-sweep-contract.md) before writing or running the capture harness. Analyze stills with:

```bash
node scripts/black-frame-metric.mjs evidence/stills/*.png
```

Keep machine-readable metrics beside the gallery. A 24-frame, 15-degree sweep is the default proof unless the slice declares a denser interval.

## Stop decision

End diagnosis with exactly one classification:

- `asset-side, proceeding`... source or intake geometry is proven responsible and the fix stays inside opened geometry surfaces.
- `render-side, proceeding`... the mechanism and opened render surface are both explicitly authorized.
- `conditional stop triggered`... the cause touches a frozen canvas, compositor, router, player, progression, or another forbidden surface.

When stopped, make no adjacent requested fix, commit, deployment, or gate URL. Report the reproduction, suppression results, topology facts, control that proved the boundary, and unchanged git state.

## Handoff

Once a fix is authorized, hand geometry construction to `radiance-geometry` and corrected-build proof to `excelsior-gate-release`.
