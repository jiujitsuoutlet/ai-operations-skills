---
name: excelsior-ruled-slice
description: The end-to-end operating loop for a Paul-ruled Excelsior slice... a PROJECT spec doc (pillars, gated phases, banned outcomes, self-score) or annotated production screenshots whose red ink IS the ruling. Use whenever a slice arrives as a named project (LOOM/BEADS/CANOPY/ATLAS style), whenever Paul sends marked-up screenshots of the app, whenever a spec says "Paul's eye is the gate" or "his word promotes", and whenever iterating a visual surface against his exact angle. Also use when he asks "are you positive?"... that phrase triggers the re-audit protocol here. Triggers on words like ruling, annotated screenshot, red pen, red circle, money shot, reference-delta, gated phases, banned outcomes, self-score, stacked preview, promote on my word, supersedes.
---

# Excelsior Ruled Slices... spec in, evidence out, his word promotes

Distilled from the Loom → BEADS → CANOPY → ATLAS run (2026-07-05/06). The MAD is
canonical; `excelsior-ship` owns git/PR mechanics; `excelsior-diagnose` owns
diagnosis depth; `excelsior-verify` owns proof tooling. This skill is the LOOP
that strings them together, plus the casebook of causes that run uncovered.

## What a ruling is

Two forms, same authority:
- **A project spec**: pillars, gated phases with explicit gates, floors table,
  banned outcomes, a self-score rubric, and a final acceptance naming Paul's
  eye. Read the WHOLE spec before acting. A later spec can supersede an earlier
  instruction mid-flight... reconcile in-flight work to it and say so.
- **Annotated screenshots**: every red circle is a defect claim, every caption a
  requirement. Treat each mark as a row in a diagnosis table that must end with
  a NAMED cause and a re-shot twin of that exact frame.

Never ask Paul to lower the bar. Infeasible → nearest feasible alternative +
DEVIATIONS.md entry with numbers. If a ruling overrides the donor or the MAD's
letter, log the deviation with his name on it ("Paul brightness ruling").

## The loop

1. **Gate zero, only if scope changes.** New scope (schema, member-visible
   capability, locked-rule change) needs a MAD amendment approved BEFORE build
   (see `mad-amendment`). Renderer-geometry repair inside ratified scope needs
   none... say which case you're in.
2. **Diagnose before touching anything.** Instrument first: overlay plots,
   attachment-distance censuses, canvas pixel sampling, A/B against the donor
   or the prior commit. The gap between measured sets IS the diagnosis. Write
   it Paul-readable, mapped one-to-one to his marks, no fixes yet. Desk
   theories multiply; numbers converge... every wrong hypothesis this run
   survived until a measurement killed it.
3. **Build to measured floors.** Turn the ruling into numbers before coding
   (span %, trunk line %, overlap count, attachment px, lum/sat, fps). After
   the fix, re-measure and RECORD the numbers as regression floors in the
   build log. Paul's eye overrides every number... floors are the guardrail,
   not the gate.
4. **Reference-delta re-shoot.** Re-capture Paul's EXACT angle (same screen,
   same module, 375x812 WebKit iPhone profile), place it beside his annotation,
   and ask: can his red pen still land? Iterate the top problems and re-shoot
   until it can't. The money shot is the deliverable, not a paragraph.
5. **Battery every phase close** (see `excelsior-verify`): touch census with
   REAL WebKit taps (new controls become permanent members), fps floors at
   real density AND the 158-orb fixture, frozen-surface diff proofs for
   anything the spec froze, secrets scan of dist.
6. **Stack and ship as one.** Follow-on slices stack on the unpromoted branch;
   each iteration deploys ONE fresh preview link that supersedes the last;
   Paul's iPhone is the gate; his single word merges and promotes the ENTIRE
   stack via PR (`excelsior-ship`). Update the project-state memory with the
   current preview URL every time it changes.

**When a from-scratch build fails his device twice, stop iterating it.** Step
4's "iterate the top problems and re-shoot" is for narrowing defects WITHIN an
accepted construction. Two device-level fails on a build that replaced the
prior accepted state wholesale is a different signal... the failures may not
even share a root cause, and a third attempt reopens every degree of freedom
the first two never implicated. Recover by narrowing, not rewriting again:
CLOSE the failed branch unmerged (no partial credit, no "round two of the same
form"), branch fresh off the last-accepted state, and re-scope as an ADDITIVE
PATCH... name the smallest set of changes that plausibly explains his verdict,
leave everything else exactly as it shipped. RANGE-2 is the worked example: a
from-scratch terrain rewrite failed twice; the branch was closed unmerged on
his order, and patching the accepted horizon in place (silhouette reshape +
two depth planes + form-light multipliers, nothing else touched) passed on the
first attempt. This is the ruled-slice instance of `excelsior-diagnose`'s
conditional-stop reflex... the stop condition here is "the construction
itself failed judgment," not "the fix needs a data-model change."

## The re-audit protocol ("are you positive?")

That question is never rhetorical. Do not reassure... re-verify every claim
made since the last checkpoint, hunting specifically for: state keyed on the
wrong source of truth (this run: completion badges keyed on path order, not
real status), transient UI shown at stale positions, and any measurement taken
BEFORE the last code change. Report findings as findings, fix, re-run the
battery, redeploy. Finding real defects builds more trust than a confident yes.

## Measurement discipline (hard-won)

- **Fresh sessions for fps.** A long-lived measurement page accumulates render
  loops and lies (25fps readings that were 60 in a clean session). A/B any
  perf question: same measurement, two ports/commits, fresh browser each.
- **A backgrounded Chromium tab suspends rAF entirely**... never conclude
  perf from the preview pane; use headless WebKit runs.
- **HMR races produce black frames.** A capture taken seconds after an Edit
  can photograph a half-reloaded app. Re-shoot in a fresh load before
  diagnosing anything from a broken frame.
- **Point samples mislead near junctions.** Sample where geometry is isolated
  (a lone strand), not where six ropes legitimately stack.
- **The pose you gate is not the pose he walks.** A showcase/drag pose chosen
  to sell drama and the member's actual default viewing pose can render the
  SAME geometry completely differently (grazing incidence at a higher, more
  distant eye flattens value contrast a face-on close pose reads fine).
  RANGE's gate-1 stills used the drag pose and passed; his device walkthrough
  browses from `flyHome` and read "flat dark bands"... reproduced exactly on
  the rig once the right pose was used, so it was a pose-class gap, not a
  device or rendering difference. Every visual gate now captures BOTH: the
  showcase pose AND the pinned default/home pose, and any no-repeat/no-drift
  battery row runs at both.

## Casebook... causes this run named (check these FIRST on similar symptoms)

- "Video crops to top third": YT.Player built without width/height defaults to
  a fixed 640x360 iframe inside overflow:hidden. Lock iframe to the frame in
  CSS AND pass 100%/100%.
- "Orbs/sprites render transparent no matter the color": a prior `stamp()`
  left `ctx.globalAlpha` low; canvas painters must reset alpha defensively at
  entry and after any stamp call.
- "Names stack at center screen": the donor tier-spread formula gives tier 1
  zero lateral spread on shallow trees... spread every tier above the root for
  trees of 4 tiers or fewer.
- "Overview fps sinks with many labels": DOM text inside the transformed world
  re-rasterizes every live-canvas frame. Labels live in a SCREEN-SPACE layer,
  repositioned on camera settle... native size, no --ls inflation, no
  invalidation.
- "Pale module colors bleach to glass under the pov haze": chroma-boost the
  tint (spread channels from their mean) before painting; pastels don't
  survive additive white washes.
- "Coach video validation": oEmbed 200 = embeddable; 401/403 = Draft/Private
  or embedding off (tell the coach to flip to Unlisted in YouTube Studio);
  404/400 = deleted/cut-short link. oEmbed has NO duration... read it from a
  hidden muted IFrame player client-side, and let healDuration + the
  null-duration completion refusal cover the failure path.
- "Member sees a completed thing as locked": the galaxy's traveled/current/
  locked accents key on linear path order (donor convention); real per-lesson
  status must win wherever a badge claims completion.
- "A gap/void between two rendered things reads empty, build a fill": verify
  the space is actually empty BEFORE building anything to fill it. Three
  iterations of taller foothill terrain (RANGE-2's "moat") drew, executed,
  and changed zero pixels because the geometry it was meant to fill already
  occupied that space contiguously... the "void" was really the existing
  content's own unlit near face. Before/after stats identical to three
  decimals across multiple size attempts is the tell that new content isn't
  reaching daylight, not that the change is too subtle. Full forensics and
  the fix in `cosmos-render-pipeline`'s "The range" section (private skill, not published).
- "A subtle lift/tint creates a stripe or ring instead of blending in": on
  cylindrical, radial, or otherwise repeating/symmetric geometry, any
  treatment keyed to the coordinate that repeats (altitude on a ring, angle
  on a wheel) traces that symmetry as a visible band BY CONSTRUCTION,
  independent of how small the magnitude is. Key the treatment to an
  aperiodic field instead (noise, position hash, the same low-frequency
  field already shaping the surface) so it varies like the real thing does.
- "A shipped surface reads wrong on his phone, he wants a different feel":
  don't rebuild. Diagnose at his real conditions (flyHome pose family, crush
  twins) to NAME the failure axis, then offer him a stills comp of options
  that ISOLATE that axis... HORIZON showed (A) revert the geometry vs (B)
  keep the geometry, crush the values, and his eye picked the value axis in
  one look. Geometry and values fail independently; a comp that separates
  them lets his ruling be precise instead of "redo it." Ship the pick as an
  inverted dev knob (`?horizon=lit` keeps the old ladder), never a deletion.
- "He says an animated element is invisible / too hot": trust his eye over
  your pixel-diff. On an additive/bloom surface near clip, a brightness
  change is measurable but not perceived... motion reads by CONTRAST (a
  traveling dark trough), and a subtle head next to a trough reads 2-3x
  hotter than it measures. Full law in `pixel-forensics` section 5.
- "Callout/label washes out over glowing content": contrast, not size. A
  dark pill badge behind the text + throwing it sideways onto dark world
  fixes it; enlarging bare type doesn't. (RTS lesson callouts, three rounds.)

## Structuring the ruling (offer the axis, not just the redo)

When a shipped surface fails his eye, the fastest path to a clean ruling is
a stills comp whose options each isolate ONE decision axis, so his pick
names the fix precisely. Diagnose to find the axis first (crush twins at his
real pose family), present current / option-A / option-B / reference at the
same crop, and STOP. He rules the axis; you build only the picked one. This
turns "it's wrong, redo it" (every degree of freedom reopened) into "the
values, keep the geometry" (one axis moved). Same discipline as the additive
patch-over-rewrite law: never reopen a freedom the failure never implicated.

## Standing style (pointers, not repeats)

Ellipses never em-dashes in authored text; donor files stay verbatim. Plain
report-back after every change (`report-back`). Everything, including docs,
rides a PR (`excelsior-ship`). App lane only... if the session is rooted in the
agent lane, move it (EnterWorktree) before touching anything.
