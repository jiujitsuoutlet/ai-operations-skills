---
name: verify-before-asserting
description: Prove a claim by observing reality before stating it as done. Use before reporting any task complete, any fix working, or any state as true — across ANY project, not just code. If you're about to say "done," "fixed," "it works," or "that's the current state," verify it first.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Verify Before Asserting

Do not assert from reasoning or from reading. Observe the actual result, then report it. In the Excelsior work this habit — not code review — caught every real bug (missing DB grants twice, a heartbeat flush bug, a rendering staleness bug). The principle generalizes to every domain.

## The rule

Before you claim something is true, ask: *have I observed it, or am I inferring it?* If inferring, go observe:

- **Code / data:** run it, query the live state, drive the actual flow — don't trust the tool's noisy success message (e.g., a CLI that prints a scary trace but applied the change anyway). Check the source of truth, not the wrapper.
- **A sent message / created record:** confirm it actually exists where it should, with the right contents.
- **A "current state" claim (metrics, status, what a system holds):** read the live value now; don't repeat a remembered one.
- **An automation run:** check what it *did*, not what it was supposed to do.
- **An environment claim ("this is staging," "this points at prod"):** verify which backend the running app actually reads... grep the served/built bundle for the backend URL. Environment *names* lie: a project named "staging" can be production.
- **A provider API's success response:** the API accepting your request reports the provider's own step, not the outcome (an SMS API says "sent" while carriers silently filter). Confirm at the far end: the message arrived, the record landed.

## Report honestly

State what you observed, including partials and failures. "Tests fail, here's the output" beats a confident "done." If a step was skipped, say so. Never soften a partial into a success — name it (the Excelsior scorecard's honest ⚠️ entries are the model).

## Sub-law: an unreplicated determinism proof is measuring noise, or the wrong thing

A "deterministic" or "bit-identical" result that only ran once is not proof of determinism... it is one sample. Freeze everything except the one system under test, drive that system explicitly, and prove the freeze took (repeat the run, confirm the same number, confirm the swept quantity actually moved between samples). Full case study and the general form: `cosmos-render-pipeline` (private skill, not published)'s TOPOLOGY section, "NAMED LAW: freeze the scene, or your control is measuring ambient."

## Case studies (labels/fontload/bloomexclude arc, 2026-07-21/22)

The mechanism below is NOT "the model gets tired." It is two specific, checkable failure modes: asserting a checkable fact from memory instead of running the cheap check that would confirm or kill it, and (a separate skill, [context-hygiene](../context-hygiene/SKILL.md)) misrouting an action to the wrong lane under stacked worktrees or sessions. Every incident below is one or the other, not fatigue.

- **A dead sweep reported a false "deterministic 0.0081."** A 144-combo envelope sweep ran inside a `reducedMotion` context where the animate loop never called `ropeFlow`/`beaconPulse` at all... the sweep was setting variables nothing downstream applied. It reported a bit-identical margin of 0.0081 across three runs, which read as a clean pass. The true margin, once the freeze actually held, was 0.0076. THE TELL was already sitting in the sweep's own output the whole time: `worstT=0, worstPhase=0.00`, the first sample winning every single run. A 144-combo sweep whose argmax is the first sample is not a stable system, it is a system nothing is varying.
- **An ambient-contaminated control laundered its own contamination.** A rope-flow visibility proof used a "lift-only control" to normalize its metric. That control was ~98% ambient mist drift, not rope... the lift-only rope moved ~150px while the contaminated control scored ~8500, so "2x the control" actually meant "2x ambient drift," never measuring the rope at all. The slice spent real time tuning rope parameters against that noise before the control itself was diagnosed as the actual defect. Fix the instrument before touching the thing being measured.
- **"RTS 28/28, your 30/30 is stale" was inferred, not diffed.** Mid-arc, asked to re-run holds, the actual output was "RTS battery: 28/28 PASS, clean. (Your remembered '30/30' is just stale... current script has 28 checks total on merged main too, nothing to do with fontload or labels.)" That was wrong, stated with full confidence, and never checked against the one thing sitting right there that would have caught it: an unmerged LABELS branch, already open, whose own battery run WAS the source of the "30" Paul remembered. Once LABELS actually merged, RTS legitimately became 30/30 (two new LABELS-contract rows). The claim wasn't "stale," it was a preview of a real number from a branch nobody diffed against before dismissing it.
- **Token revoke: the recovery IS the pattern.** A `signOut(userId, "global")` call failed with "invalid JWT... token contains an invalid number of segments." First instinct was to suspect the service-role key itself (checked its length and format, found it short and unfamiliar, treated that as the likely cause). The key was fine... it was Supabase's newer `sb_secret_...` format, confirmed valid by a working `getUserById` call once actually tested. The real bug, found only by reading the library source instead of continuing to reason about the key: `signOut`'s first argument is a JWT (an access token), not a user id. A UUID has zero dot-segments; a JWT has three; the server's own error was naming the exact problem the whole time. The fix wasn't "trust the key less," it was "stop reasoning about which layer is broken and go read what the function actually expects."
- **A "pre-existing, unrelated to geometry" claim, per Paul's account.** A defect was characterized as pre-existing and unrelated to the geometry under discussion before it had actually been shown or checked against the current build. Flagged here on Paul's own description of the incident rather than a build-log quote... this session could not independently locate the exact source text to cite verbatim, and is not inventing specifics to fill that gap. If the precise record matters, it belongs in this entry with a real citation, not a paraphrase.

## The cheap tell

If your report contains "should," "presumably," or "I've made the change so it now…", you're asserting, not verifying. Go look. The same tell has a sharper edge under long context or a big remembered claim: the moment you're about to write "pre-existing," "unrelated," "I can't," or "deterministic," stop and name the one cheap check that would prove or kill it before you write the sentence.
