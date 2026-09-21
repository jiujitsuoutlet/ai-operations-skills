---
name: webgl-brightness-guardian
description: Measure and protect rendered WebGL brightness hierarchy, label contrast, plane separation, material value structure, and orb-versus-environment envelopes. Use when changing bark, stone, mat, metal, sky, fog, landmarks, labels, modal chrome, bloom-adjacent surfaces, or any visual treatment that could make labels fall below 4.5:1 or environment pixels compete with governed brightest objects.
---

# WebGL Brightness Guardian

Measure the final rendered frame. Do not infer legality from material constants.

## Required proofs

1. **Labels:** sample every governed label against the actual brightest painted background it occupies. Require 4.5:1 unless the current MAD states a stricter floor. A fallback sample is not proof for a tracked defect.
2. **Brightest-object envelope:** capture identical poses with and without the governed bright objects. Compare maximum displayed luminance and report the minimum margin against the frozen floor.
3. **Focused envelope:** sweep the calibrated animation phases at the governed focus poses; do not measure a single convenient frame.
4. **Plane separation:** use object-suppression pairs to establish ownership before comparing trunk, mat, border, platform, mountains, or sky layers.
5. **Material hierarchy:** change local albedo, roughness, normals, AO, or geometry before proposing exposure, tone mapping, or bloom changes.

Read [references/measurement-law.md](references/measurement-law.md). Use `scripts/wcag_contrast.py` for deterministic RGB/luminance calculations; pixel selection still requires governed rendered evidence.

## Hard stops

Stop when the requested look cannot meet the floor without opening a frozen system. Present the brightest legal version beside the requested version and ask for a ruling. Never lower the floor or change the composer inside an ordinary material slice.
