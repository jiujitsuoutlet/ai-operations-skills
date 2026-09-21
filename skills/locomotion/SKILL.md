---
name: locomotion
description: Use for ALL work on character movement and walk mode in the Excelsior app (STRIDE arc)... tap-to-move navigation, character controllers, pathing on the dojo ground plane, third-person follow cameras, walk-mode entry/exit, proximity interaction with lesson nodes, or movement input handling. Triggers on words like walk mode, tap-to-move, pathfinding, navmesh, character controller, follow camera, third person, ground plane, destination marker, proximity, interaction radius, dojo floor. Self-scoped to Excelsior only.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# locomotion... walking is the reward layer, never the toll booth

Movement craft law for STRIDE. AVATAR-STRIDE-DECISIONS.md (private design doc, not included) owns the
architecture; game-feel-camera owns the camera math this skill builds on; the
MAD wins on any conflict.

## The inviolate law, restated procedurally

Map-first entry never changes. Before any locomotion PR merges, prove:
every galaxy entry still lands on the map... tap-to-dive still opens a
lesson in the same number of taps as before the PR... "Continue My Path"
still never touches the galaxy. Walk mode is entered only by its explicit
affordance and exited from anywhere in one gesture. If a change makes
walking necessary to reach any lesson, the change is wrong... stop.

## Tap-to-move (plan of record)

- Raycast the tap against the ground plane; invalid ground (off-mesh,
  behind set dressing) shows a soft rejection tick at the tap point, never
  silent nothing... every input acknowledged (game-feel law).
- Valid destination: place a destination marker (portal-fx visual family),
  character paths there. Direct line on open floor; if the dojo gains
  obstacles, waypoint around a coarse walkable polygon... never ship a full
  navmesh library before a measured need exists (bundle discipline).
- A new tap mid-walk retargets smoothly... no stop-and-restart hitch. Tap
  ON a node is a node tap (interaction wins over movement)... disambiguate
  by hit-test priority, node first.
- Speeds, turn rates, arrival easing: named constants, stated values,
  retunes in numbers. Arrival decelerates over the last stretch...
  characters that stop dead read robotic.
- Tap-vs-drag discrimination uses the SAME thresholds as the map camera
  (game-feel-camera constants)... one gesture language app-wide, never a
  second set of magic numbers.

## Follow camera

Third-person follow in the game-feel-camera family: drag orbits around the
character, pitch clamped floor-to-sky, pinch zoom bounded, inertia and
clamping per the skill's laws. The map (ORBIT) and corridor (PANORAMA)
camera code is never edited... locomotion mints its own controller and the
existing cameras re-prove by regression. Mode transitions (map -> walk ->
map) go through the portal-fx grammar, and camera state restores on return
to map... members never lose their place.

## Proximity interaction (the bridge to lessons)

- Walking within a measured radius of a node surfaces the SAME lesson card
  and ENTER LESSON grammar the corridor uses... one card system, zero
  parallel UI. Leaving the radius dismisses it gently.
- Radii are named constants proven at measured distances (evidence frames
  at radius-minus and radius-plus).
- Entering a lesson from walk mode routes through the identical
  service-layer call as tap-to-dive... diff the call sites to prove it.
  Locomotion grants nothing: no points, no progress, no heartbeat contact,
  ever. If a task wires movement to the ledger in any way, stop... that is
  a production-ledger-boundary violation.

## Input integrity

Real touches only, as everywhere: movement controls join the touch census;
proof runs in the Playwright WebKit iPhone touch profile with real taps and
drags... synthetic dispatched events remain banned as proof. Walk-mode
affordance, destination taps, node taps mid-walk, exit gesture: all
census members.

## Proof recipe (runs with excelsior-verify)

Map-first laws re-proven (top of this file)... tap-to-move at 8 headings
with real touches... retarget-mid-walk smooth (frame capture)... node-tap
priority over move... proximity card at measured radii... 60fps in-page
during walk + camera drag simultaneously... service-layer call-site diff on
record... standing batteries green (demo spine, Second Member 5/25, Marble
floors, ATLAS routing).
