---
name: excelsior-diagnose
description: Use at the start of ANY Excelsior app fix, bug, or repair slice BEFORE writing code... trace and name the real mechanism, capture BEFORE evidence, and detect when a fix needs a human stop. Triggers on words like diagnose, root cause, why is this broken, trace, mechanism, Phase 1, before/after, fix, bug, repair, jumbled, wrong, degraded.
---

# Excelsior... Diagnose Before Fix

The most expensive Excelsior failures were fixes applied before the mechanism was named.
The most successful slices (Marble, Weave, Lumen) all won because Phase 1 named the real
fork first. This skill is that motion, made repeatable. It is procedural only... the MAD
wins on any conflict, and this never overrides a slice spec's own gates.

## The law: no fix before a named mechanism

You may not edit a line of fix code until you have written a one-paragraph diagnosis that
names the FILE and the MECHANISM, and that diagnosis is confirmed by the fix working. A
build succeeding is not a diagnosis. "Looks broken here" is not a diagnosis. "Function
computeLayout() pushes orbs up to 38px off-centerline via a random sideways term" is a
diagnosis... it names where and how.

## The five-step motion

1. **Reproduce first, at the reporter's exact conditions.** If Paul red-circled a frame,
   reproduce THAT frame at THAT angle/screen/width on the real WebKit iPhone profile and
   capture it as BEFORE evidence before reading a single line of code. You cannot fix what
   you have not reproduced. Evidence goes in evidence/<slice>/before/.

2. **Read the whole implicated file, not the grep hit.** The mechanism is usually in how
   several formulas interact, not the one line that matches the symptom. Read the function
   end to end. Name every input it trusts.

3. **Name the mechanism in one paragraph.** File + function + the specific formula/branch
   that produces the defect. If there are multiple contributing formulas, name each and
   how they compound. Write it down (docs/<SLICE>-DIAGNOSIS.md, committed).

4. **Classify: is the data lying or is the render lying?** Check whether the underlying
   data (schema, membership, order, counts) is correct and sufficient. If the data is
   correct and only placement/display math is wrong → render-side fix, proceed. If the
   data model or a topology rule must change → this is a STOP: the fix has grown past the
   slice's assumed scope and Paul rules before you proceed. Most defects are render-side;
   say so with evidence, don't assume.

5. **Predict the fix's blast radius before writing it.** Name what else touches the
   mechanism you are about to change. A seating fix moves orbs → the material battery and
   frame rate must be re-proven. A routing fix touches player/wheel → the demo spine must
   be re-proven. State the batteries the fix will require BEFORE writing it, so verification
   is designed in, not bolted on.

## The conditional-stop reflex

Every diagnosis ends with an explicit call: "render-side, proceeding" OR "needs data-model
change, stopping for Paul." Never silently expand scope past a spec's stated fork. The
slice spec's own conditional-stop clause always wins if it is stricter than this one.

## Anti-patterns (each has burned a real session)

- Measuring against the wrong build. Confirm the dev server's process cwd and served bytes
  match the worktree you intend before trusting any number (a session once measured the
  agent lane's stale code for a full battery run and reported invalid results). When in
  doubt, curl the served bundle and diff.
- Fixing the first hole you find and declaring victory... a symptom often has multiple
  contributing formulas (Weave's jumble was three distinct under-constrained formulas in
  one function; fixing one would have left two).
- Trusting a structural argument instead of measuring. "Orbit-invariance comes free by
  construction" may be true... prove it with the measurement anyway.
- Stale evidence. A number measured before a later code change is void. Re-measure against
  the current tree, per verification law.

## What this skill is NOT

Not a verification skill (that's excelsior-verify... this hands off to it once a fix
exists). Not architecture (that's the MAD). Not a license to skip a slice spec's Phase 1
gate... it is how you execute that gate well.
