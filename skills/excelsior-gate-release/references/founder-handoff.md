# Founder Handoff

## Required package

Lead with the outcome and include:

1. Exact corrected commit and branch
2. What changed and what remained frozen
3. Root-cause evidence
4. Gate table with measured minima and deltas
5. Before-and-after images at ruled poses
6. Full sweep gallery
7. Touch census result with denominator explanation
8. Second Member fixture result
9. Walk URL
10. Device-gate URL tied to the corrected commit
11. Explicit `GATE-PENDING` and stop statement

## URL discipline

- Use a preview deployment, never production.
- Append the required feature flag and temporary protection bypass.
- Verify the served Vite asset hash matches the local build in a real browser.
- Keep the walk and device-gate URLs distinct when they serve different workflows.
- Revoke temporary bypass credentials after the founder finishes, not before.

## Build-log entry

Record:

- Diagnosis and named mechanism
- Asset nodes, primitives, components, bounds, and triangle counts when relevant
- Geometry and draw-count deltas
- Every battery result and minimum
- Exact evidence paths
- Preview identity proof
- Commit and gate URLs
- Founder verdict when received

Do not write `accepted`, `gold standard`, `merged`, or `production` before the founder explicitly says so.
