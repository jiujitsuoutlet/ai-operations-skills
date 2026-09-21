# Station projection contract

Record one row per curriculum station.

| Field | Required meaning |
|---|---|
| stable_id | Canonical lesson/content identifier |
| branch_id | Existing curriculum branch |
| order | Existing order within branch/topology |
| source_position | Governed pre-transform world position |
| projected_position | Final visible carrier position |
| surface_normal | Normal used for station and hit carrier |
| projection_distance | Distance from governed seed to surface |
| state_source | Existing member-state field only |
| hit_target_id | Existing routed interactive carrier |
| label_id | Existing label/collision participant |

## Automatic failures

- Missing, duplicated, or changed stable IDs
- Changed branch/order/parent relationships
- Projection onto hidden or discarded geometry
- Station buried beyond the ruled physical intersection
- Station or label carrier no longer reachable by real touch
- New progression semantics introduced during projection
