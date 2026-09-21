# Double-Helix Contract

## Centerline

Parameterize the polyline by cumulative distance. Resample at fixed arc-length intervals, then evaluate a centripetal Catmull-Rom curve with alpha 0.5. Preserve station anchors as constrained samples so smoothing cannot change orb positions.

## Rotation-minimizing frames

Seed the first lateral vector from the projected surface normal and tangent. For each subsequent tangent:

1. Compute the minimal rotation carrying the previous tangent to the current tangent.
2. Apply that rotation to the previous lateral vector.
3. Project the result into the current tangent plane.
4. Re-normalize and recover the third axis by a cross product.
5. Handle nearly parallel and nearly opposite tangents explicitly.

Do not independently derive each frame from a cross product and do not use a Frenet frame. Both allow sign flips on noisy geodesics.

## Phase lock

At station `k`, require `sin(phase_k)` to equal positive or negative one, giving maximum separation. Between stations choose an integer half-twist count `h_k`:

```text
phase_(k+1) - phase_k = h_k * pi
```

Choose parity so the strands exchange sides as intended. The midpoint phase must be an integer multiple of pi, producing a crossing. Interpolate phase by arc length within the interval rather than by sample index.

## Offsets

For strand sign `s` in `{-1, +1}`:

```text
position = center
         + lateral * (s * separation * sin(phase))
         + surfaceNormal * (baseLift + s * weaveLift * cos(phase))
```

Keep lift small relative to orb radius and branch thickness. If points are reprojected to the bark after offsetting, the reprojection must not collapse separation or destroy over-under order.

## Geometry and value

- Use a ribbon or a tube with no more than six radial segments.
- Merge all paths sharing a material into one geometry where feasible.
- Preserve per-path color through vertex colors or the existing material partition.
- Keep depth behavior and material ownership consistent with the approved pipeline.
- Measure strand-versus-orb luminance at every declared proof pose.
