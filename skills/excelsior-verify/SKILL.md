---
name: excelsior-verify
description: Use whenever proving, testing, or verifying anything in the Excelsior app... touch census, floor batteries, evidence galleries, regression checks, or any claim that a feature works. Triggers on words like verify, prove, test, census, floors, evidence, battery, regression, walkthrough.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Excelsior Verification Law

The MAD is canonical... on any conflict between this skill and the MAD, the MAD wins.
This skill encodes HOW to prove things, not WHAT the architecture is.

## The one sentence

A claim is not proof. A measured number, a real-device-profile behavior, a rejected
forged request, or a bit-for-bit reproduction is proof. Report claimed vs proven
explicitly in every gate report.

## Name what the battery does NOT cover (founder rule, 2026-09-15)

Before reporting that a battery passed, state the shapes it never exercised.
A passing count says "the cases I thought of behaved as I expected", not "this
works". Report both halves, always:

1. The count, and what each part proves.
2. The shapes the battery did not touch, listed plainly.

Where this rule came from: a console battery of 15 browser tests passed, and
the founder's first hand-entered row hit a bug on his first try. Every test row
the session wrote had the same shape (all fields filled); his had an empty one
that the database refuses to approve. The tests were real; their inputs were
all one shape.

How to build the gap list: walk the axes the battery holds constant... which
entity types, which field combinations (especially EMPTY optional fields),
which roles, which browsers and widths, which environments, one actor versus
two at once, small data versus large, and every path that is stubbed rather
than real. A gap becomes a test when its slice arrives, or immediately when a
bug is found in it, with the founder's own failing case as the first test.

A gap list is not an apology. It is the map of where the next bug lives, and
it is what tells the founder whether a pass is worth trusting yet.

## One assertion, one subsystem

One assertion may prove only one subsystem. Never let a single pass/fail label span
auth, navigation, animation, asset loading, and world boot. A composite assertion
mislabels whichever downstream wait times out as the first subsystem's failure.

- Prove OTP verification from the auth response itself.
- Prove the portal transition from its own completion signal.
- Prove COSMOS boot from its own ready signal.
- End-to-end journeys may contain all three, but they report each milestone
  separately and name the exact subsystem that failed.
- A timeout after a successful upstream response is never reported as an upstream
  failure. Preserve the successful milestone and diagnose the next boundary.

The standing example is the July 2026 touch-census false attribution: the correct OTP
returned 200, then the assertion waited through portal animation and asynchronous 3D
boot under one label. A slow world boot therefore presented as an OTP failure even
though auth had succeeded.

## Pin the browser proof runtime

Playwright is test infrastructure, not a floating convenience dependency. Pin its
exact version in `package.json` and the lockfile, install the matching browser bundle,
and record the version in the gate artifact.

- Run a WebKit launch smoke check before a heavy battery.
- After a macOS update, confirm Playwright selected the matching macOS WebKit bundle.
- A browser launch crash blocks the battery. Never skip it and call the battery green.
- Changing Playwright or its browser bundle invalidates prior harness comparability
  until one clean standing-battery run establishes the new runtime.

The standing example is Playwright 1.61 on macOS 26 selecting a macOS-15 WebKit
bundle and crashing on the missing `_WKBrowserContext` symbol. Playwright 1.62
selected the macOS-26 bundle and restored the 91/91 census.

## Touch and interaction proof

- Interactive verification runs ONLY in the Playwright WebKit iPhone touch profile.
- Synthetic dispatched events are PERMANENTLY BANNED as proof. A dispatched
  TouchEvent proves nothing about iOS Safari.
- The touch census (npm run test:touch) is a permanent regression battery. Every
  new interactive control joins it in the same slice that creates the control...
  no orphan controls.
- Known flake: the player scrubber line can fail on YouTube video-ready timing.
  One clean rerun of that line is acceptable; a second failure is a regression.

## Visual and geometric proof

- Visual fidelity is judged by side-by-side screenshot comparison against the
  Design lane donor reference... never by self-report.
- A slice touching rendering ships evidence/<slice>/ containing:
  - before / after / donor galleries when the change is visual
  - instrumented overlay or offscreen-readback measurements when it is geometric
    or photometric (luminance, saturation, radii, positions)
- Floors are measured from rendered canvas pixels or instrumented probes, at
  every declared depth/density/angle. Adjectives never pass a floor.
- Single-shot luminance carries a few points of noise from the orb palette cycle...
  build margin over floors rather than shaving them.
- Never lower a floor to converge. Convergence comes from measured pixels, not
  from a clean build.

## Standing regression checks (run when the slice touches the listed surface)

- Auth, wheel, player, or ledger touched → re-verify the demo spine end to end:
  login → watch inline → complete → points land → tier-up fires.
- ANY slice → verify Second Member (`<SECOND_MEMBER_PHONE>`) untouched at 5 completions /
  25 pts. This account is the tier-up demo and is untouchable.
- Galaxy rendering touched → re-run the Marble floor battery (v2.10 F1-F5) and
  confirm frame rate held on the WebKit iPhone profile.
- Entry/routing touched → confirm ATLAS map-first entry: every galaxy entry lands
  on the Map, no auto-dive; "Continue My Path" never touches the galaxy.

## Stale assertions after a behavior change (the four-phase flake trap)

When a slice deliberately changes DEFAULT behavior, standing batteries that encode the
OLD behavior will fail... and the failure looks exactly like a regression or an
unrelated "flake." It is neither. It is the battery asserting a reality the slice just
changed on purpose.

The tell: a "flake" you have attributed to unrelated code across MULTIPLE slices, that
never quite gets root-caused, and that lives near a surface whose default recently
moved. That is not low-frequency flakiness... that is a stale assertion nobody updated.
(Real example: a coach sign-in "flake" chased across four phases turned out to be the
census asserting old 2D-board-landing behavior after the flag flip made COSMOS the
default landing for coach AND member alike.)

The discipline:
- A battery failure that coincides with a behavior change you MADE is guilty until
  proven innocent... suspect the assertion before the product.
- Prove the NEW behavior is correct first (by its own real test), THEN update the
  assertion to match the proven new reality. Never the reverse... never update an
  assertion to make it pass without proving the new behavior is what you want.
- Once you update an assertion, say so explicitly in the gate report: which line, old
  expectation vs new, and the proof the new expectation is correct. A silently retuned
  assertion is indistinguishable from cheating a floor.
- This is NOT license to update safety assertions (orbs-brightest, RLS rejection,
  ledger idempotency). Those never move to pass... a failure there is always real. This
  law covers behavior/routing/landing assertions, never the safety floors.

## Battery execution: SEQUENTIAL by default (contamination law)

Heavy batteries (touch census, atmosphere, RTS, Marble floors... anything driving a
WebKit/Three.js instance) run ONE AT A TIME, never concurrently. This is not a
preference... it is a correctness rule. Running them in parallel has produced a false
failure in nearly every arc, always the same signature:

- **Supabase 429 / OTP rate-limit.** Three sessions signing in at once trip the auth
  rate limiter. The auth "failure" is contention, not a regression.
- **FPS / frame-time collapse.** Multiple GPU-bound instances starve each other; the
  frame floor "fails" at 53-54fps when the real single-instance number is 60+.

Both are artifacts of concurrency, not real regressions. The cost of chasing them is
a full contaminated run plus a full clean re-run... the single largest recurring
time-sink in the build. Kill it by construction:

- Run batteries strictly sequentially: census finishes, THEN atmosphere, THEN RTS.
  Queue them; do not background three at once.
- A frame-rate or auth/OTP failure that appears ONLY under concurrent battery load is
  a contamination artifact... re-run that battery ALONE before reporting it. A failure
  that persists on a clean solo run is real.
- Before trusting any fps or auth result, confirm no other battery/browser instance
  was live during the measurement (perf-measurement-hygiene: a number measured under
  contention is stale).
- Non-GPU, non-auth checks (e.g. a pixel-luminance probe reading saved screenshots)
  may run alongside a battery... they share no contended resource. When in doubt,
  sequential is always safe.

The rule of thumb: if two things both drive WebKit or both hit auth, they do not run
at the same time.

## Performance proof

- Frame rate is measured in fresh sessions AFTER the final code state... a number
  measured before a later change is stale and must be re-measured.
- Measure at real-data density AND the 158-orb fixture (flag-gated, never shown
  to members).

## Gate reporting format

Every phase gate report contains:
1. What was claimed.
2. What was proven, with the number or artifact path.
3. What could NOT be verified from this environment and therefore falls to
   Paul's device walkthrough.
4. Honest self-score against the slice rubric... anything below 10 on floors or
   banned outcomes is a restart, not "close."

Paul's iPhone walkthrough is final acceptance on every member-facing slice. His
eye overrides every passing number.
