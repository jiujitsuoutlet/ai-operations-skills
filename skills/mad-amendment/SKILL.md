---
name: mad-amendment
description: How to draft, present, and land a MAD amendment for the Excelsior app... the numbering law, changelog mechanics, riders, the approval gate. Use when any work changes phase scope, schema, interaction models, or locked rules, or when a spec says "MAD amendment first." Triggers on words like amendment, MAD version, changelog, version bump, reserved slot, rider, decision zero.
---

# MAD Amendment Mechanics

The MAD is canonical; nothing about scope, sequencing, or non-negotiables
changes inside a build session... only here, with Nejat's explicit approval and
a dated changelog entry. This skill is the procedure; the MAD itself is the
law. (The flag-conflicts skill routes here when an operator decision changes a
written rule.)

## The gate sequence (never compress it)

1. **Draft the FULL text first**... changelog entry verbatim, body-section
   edits identified, amendments/ document... and present it in chat. Plain
   English, WHY before WHAT (Section 9): each decision gets its reasoning, and
   the load-bearing interpretation gets named explicitly.
2. **Name any boundary being interpreted as "decision zero."** Example: v2.54
   scoped the Section 11 pricing rule to JJO's own pricing, so a third-party
   academy's published drop-in fee is a logistics fact. Write the
   interpretation into the amendment so a future session can neither refuse
   the work by strict reading NOR cite it as precedent for the thing the
   boundary actually forbids. Kill both failure modes in the text.
3. **STOP. Do not edit MAD.md until Nejat's word.** He may approve with
   riders... incorporate them verbatim into the text (a rider that states a
   rule becomes its own numbered decision or a closing sentence of one),
   and say where each landed.
4. Apply exactly what was approved, commit with a message summarizing the
   riders, and ride a PR (PR law in excelsior-ship). Show the diff.

## Mechanics of the edit

- **Changelog**: entries newest-first as `### vX.Y to vX.Z (date)`, numbered
  bold-led decisions, house voice (ellipses, never em-dashes; plain-English
  WHY inline). One-line pointer to the full text in
  `amendments/YYYY-MM-DD-vX.Z-slug.md`.
- **Status line**: update the supersedes chain. `Version:`/`Date:` reflect the
  LATEST canonical state.
- **Body edits**: minimal and additive. Section 3 ships/does-not-ship lines,
  Section 5 schema entries in the existing table-prose style. Never rewrite a
  prior entry's text... prior changelog entries are history, not living prose.
- **amendments/ document**: the full reasoning, riders marked as incorporated,
  acceptance criteria (gates) at the end.

## Numbering law (MAD v2.53, Section 10)

An amendment number is assigned when its pull request opens, never when a
draft is written. No number is reserved for unwritten work, for any lane.
Write the draft without a number (e.g. `amendments/YYYY-MM-DD-slug-DRAFT.md`).
When the PR opens, take the next number not already held by main or by an
open amendment PR, and put it in the filename, the changelog heading, and the
status line. v2.9 is the cautionary case: it was reserved on 2026-07-06 for a
Tournament Scout amendment that was never written, and migrations cited an
amendment that did not exist. v2.9 is retired unused. Never mint it, fill it,
or cite it as a ruling (also stated in excelsior-ship).

## What rides along

- **Migration numbering** changes are amendment material. Migrations mint
  from 14-digit timestamp slots (e.g. `20260831220800_...`)... the old agent
  block slot registry is stale. Mirror any rule change in the excelsior-ship
  skill so sessions that never open the MAD still obey it.
- **Cross-cutting doc sync**: after landing, fix any code-adjacent or vault
  doc the amendment contradicts (e.g. a scope or contract doc that still
  states a rule the newly merged amendment changed). A repo that argues with
  its own MAD breeds wrong sessions.
- **Verify canon before drafting**: fetch origin/main and read the CURRENT
  version header + recent changelog... branches go stale fast here (a branch
  sat at v2.4 while main reached v2.7 in one day). Amendment numbers and
  reasoning must be written against main's reality, not the branch's.
