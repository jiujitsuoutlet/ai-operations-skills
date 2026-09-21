# Asset Intake Contract

## Required manifests

Produce one manifest for the raw source and one for the shipped derivative:

- Source filename and content hash
- Generator and glTF version
- Scene, node, mesh, primitive, and material inventory
- Vertex and triangle totals
- Connected components with bounds and planarity ratios
- Maximum triangle span and area
- Every removal rule with candidate count and removed count
- Final triangle target and achieved total
- Runtime transform, world bounds, and root placement diagnostics

## Safe removal order

Prefer explicit identity over heuristics:

1. Named unwanted node
2. Dedicated primitive
3. Disconnected component proven non-subject
4. Coplanar triangle island proven non-subject
5. Geometric heuristic with retained-geometry tests and a reviewed manifest

If the asset contains one mesh and one welded component, do not claim a separate plane without triangle-level proof.

## Reproducibility

Keep cleanup in the checked-in intake or decimation script. Record tool versions and arguments. Regenerate the final GLB from the original source, never by hand-editing the shipped binary.

## Required controls

- Candidate-only render at the offending pose
- Tree-only render at the same pose
- Full render before cleanup
- Full render after cleanup
- Raw-versus-processed topology comparison

Removing the whole bark mesh is attribution evidence, not candidate proof.
