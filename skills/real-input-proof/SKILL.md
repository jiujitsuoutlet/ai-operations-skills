---
name: real-input-proof
description: Use when verifying that any web UI is actually interactive... real input drivers over synthetic events, pointer-events inheritance traps, and the tappable-census regression pattern. Triggers on words like touch, tap, click test, dead to touch, unresponsive, pointer-events, hit-test, dispatchEvent, synthetic event, interactivity, census, Playwright.
---

# Real-Input Proof (UI interactivity verification)

The founding failure, generalized: an app shipped pixel-perfect and completely
dead to touch. Its test suite passed because synthetic events bypass the
browser's real hit-testing... the user's phone found in minutes what the
battery structurally could not.

## The law

- `element.dispatchEvent(...)` proves NOTHING about whether a real finger or
  cursor can reach the element. Synthetic dispatched events are banned as proof
  of interactivity.
- Proof is a real input driver on a real device profile: Playwright's
  `touchscreen.tap` / `mouse` against a WebKit iPhone profile (or the target
  platform's equivalent), asserting the real OUTCOME... screen changed, toast
  fired, request sent... not merely that a handler ran.

## pointer-events traps (the usual mechanisms of "dead to touch")

- `pointer-events:none` on a parent kills the entire subtree. One wrapper in
  the wrong place deadens the whole app, while components that re-enable
  themselves inline (an animated layer setting style per frame) stay alive...
  which makes the breakage look partial and mysterious instead of total.
- Third-party or ported components that neutralize their parentElement expect a
  DEDICATED mount wrapper. Mounting one directly under your app shell hands it
  your shell to neutralize.
- Full-viewport overlay layers (labels, glows, ribbons, bloom) silently eat
  taps meant for content beneath. The pattern: pin containers and decorative
  layers inert with `pointer-events:none`, then explicitly re-enable each
  interactive child.

## The census pattern (make it a permanent battery)

- Enumerate EVERY tappable control on every screen. Real-tap each one and
  assert its real outcome. Disabled/parked controls assert their feedback too
  (a toast, a shake)... silence on tap is a failure, not a pass.
- Every new interactive control joins the census in the same change that
  creates it. No orphan controls, ever.
- Include boot-path cases: cold start, resume-with-storage, sign-out... each
  lands on the right screen with the right things tappable.
- Flake hygiene: media-ready timing (a video player scrubber) may flake once;
  one clean rerun is acceptable, a second failure is a regression.

## Related

`verify-before-asserting` (this is its UI-interactivity instance) ·
`parallel-claude-lanes` (confirm the served app is the app you think it is
before running a census against it).
