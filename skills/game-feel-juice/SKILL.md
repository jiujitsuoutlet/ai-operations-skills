---
name: game-feel-juice
description: Use when building interaction feedback, animations, springs, pressed states, celebrations, transitions, or reward moments in the Excelsior app. Triggers on words like spring, bounce, animation, celebration, feedback, juice, easing, overshoot, pressed, tier-up, confetti, particle burst.
---

# Game-Feel Juice and Feedback Craft

MAD wins on conflict. The ledger is law: juice VISUALIZES server truth, never
anticipates it.

## The truth-lock (absolute)

- No celebration, counter, or reward visual fires before the server confirms the
  event (payout row exists, tier threshold crossed server-side). Optimistic UI for
  points/progress is banned.
- Prove it with a delayed-response test: throttle the server reply, confirm the
  celebration waits. A celebration that fires on the client action is a defect
  even if the server would have agreed.

## Spring math (the overshoot IS the feature)

- Pressed state: scale to ~0.96 on touchstart, instant (<= 50ms ease-out).
- Release: spring back with slight overshoot to ~1.02 then settle to 1.0, total
  200-260ms. CSS approximation: cubic-bezier(0.34, 1.56, 0.64, 1). JS spring:
  underdamped, stiffness ~170, damping ~14 as starting constants.
- Linear easing where a spring is specified is a defect. So is a spring on
  something that should be instant (toggles of state text).
- ONE shared spring utility... per-control one-off animations are banned. Same
  constants everywhere = one coherent body language.

## Performance discipline

- Animate transform and opacity ONLY (compositor path)... never top/left/width/
  height/margin. will-change applied sparingly and removed after.
- All animation driven in the rAF loop or CSS transitions... no setInterval, no
  layout reads inside the frame path (read-then-write batching).
- Floor: 55fps+ held DURING every spring and celebration on the WebKit iPhone
  profile. Juice that costs frames is noise.

## Celebrations (the two macro moments)

- Lesson complete: < 1.2s. Particle burst in the module's color (reuse the
  scene's existing particle language and budgets... no new visual vocabulary),
  points chip counting up to the SERVER value, the path orb visually claiming its
  done-state.
- Tier-up: brief, full-screen-worthy, in the scene's particle language, ALWAYS
  tap-skippable... a celebration that traps input is a defect. The skip control
  joins the touch census.
- Verify tier-up with a THROWAWAY member seeded via the legitimate server path...
  the Second Member fixture (5/25) is untouchable and never spent on testing.

## Reduced motion (a floor, not a courtesy)

- prefers-reduced-motion: every spring becomes an instant state change; every
  celebration becomes a static confirmation (points still shown, no motion).
  Verified explicitly on every touched surface.

## Known failure modes (this codebase's history)

- Leftover canvas state (globalAlpha, composite ops) bleeding between draw
  passes... defensive resets around every pass.
- Labels/HUD flashing at stale positions during motion... hide during flight,
  reseat on settle (the shipped pattern; reuse it).
- Measuring fps at rest and claiming it for motion... measure DURING the
  animation, fresh, on the final code state.
