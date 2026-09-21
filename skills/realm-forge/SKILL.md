---
name: realm-forge
description: Use for ALL work on multiple learning worlds/realms in Excelsior (REALMS arc)... realm themes, environment definitions, realm gateways and transitions, the realms table, loading/unloading worlds, or adding a new learning path world (nutrition, workouts, tournaments, etc.). Triggers on words like realm, world, arena, environment theme, gateway, world transition, nutrition world, workout world, tournament world, theme loader, realm selector. Also triggers on any proposal to build a second explorable environment. Self-scoped to Excelsior only.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# realm-forge... worlds are data, or the design is wrong

Craft law for REALMS. AVATAR-REALMS-CHARTER.md (private design doc, not included) owns the architecture locks;
the MAD wins on any conflict. This skill exists mostly to stop rebuilds
before they start.

## The test that runs before any realm work

Before writing any code for a new realm, answer in writing: does this realm
ship as (a) a new rooted tree in the existing content engine, (b) a theme
definition consumed by the existing loader, and (c) a row in the realms
table... and NOTHING else? If any part of the realm requires new engine
code beyond the theme loader itself, stop and take the finding to Paul as a
fork gate. Never absorb engine work silently into "just adding a world."

## Theme definition discipline

A realm theme is one declarative document (sky treatment, ground/floor,
lighting palette with the scene's warm-cool tension expressed in stated
values, ambient set-dressing manifest, audio hooks if any). Themes are
validated against a schema at load... a malformed theme fails loudly at
authoring time, never silently at member runtime. The first realm (the
dojo) gets retro-fitted INTO this format as the reference theme before a
second realm is ever authored... one loader, proven on the world that
already ships.

## Content precedes environment (the gate, procedurally)

No environment art, no gateway, no theme work for a realm until its
curriculum is authored and published in the content engine (courses ->
modules -> lessons, rooted per the root-module law, create parent before
child). Procedure: verify the realm's tree renders complete and connected
in the flat/map interface FIRST... a realm's world is a costume on a
curriculum that already works, never a promise of one.

## Transition and memory law

- Realm gateways fire the existing portal/tunnel grammar
  (enter/nodeZoom/returnFx family)... never a new transition system.
- One realm resident in memory at a time. Entering a gateway disposes the
  outgoing realm's GPU resources explicitly and lazy-loads the incoming
  realm's chunk... prove disposal with before-after snapshots in evidence.
  Phones do not hold two worlds.
- Member position and camera state in the departed realm persist (server
  or local per the spec of the day) so returning feels like coming back,
  not starting over.

## Progression stays global (procedural checks)

One ledger, one tier ladder, Gamer Points... across all realms, always.
Any per-realm display of progress is server-count-driven and
client-displayed only, same law as tier progress. Grep-level check on
every realm PR: no new point-granting paths, no realm-scoped currencies,
no realm-completion payouts that bypass the one-payout-per-completion law.
If a task implies realm-specific points, stop... that is a ledger-boundary
violation wearing a costume.

## Proof recipe (runs with excelsior-verify)

Realm tree connected and complete in the flat interface before world
work... theme validates against schema... gateway transition round-trip
with disposal proven... position persistence proven... 60fps in-page inside
the new realm with character live... cross-realm ledger integrity (complete
a lesson in realm 2, exactly one payout, global tier count moves)...
standing batteries green.
