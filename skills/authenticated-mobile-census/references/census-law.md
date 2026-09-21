# Authenticated mobile census law

## Required record

- App commit and production/dev mode
- Browser engine and pinned version
- Viewport, DPR, account fixture, and starting member state
- Auth/session source and OTP requests made
- One row per subsystem assertion: result, duration, evidence, failure reason
- Hit target census with real touch coordinates and routed destination
- Ending member state and comparison with starting state

## Failure taxonomy

- `AUTH`: session restoration, OTP, provider rate limit
- `PORTAL`: portal routing or entry
- `WORLD_BOOT`: 3D world readiness
- `RENDER`: visible world composition
- `TOUCH`: hit testing or precedence
- `PLAYER`: modal/player behavior
- `COMPLETION`: completion spine or persisted state
- `RETURN`: return pose or navigation
- `HARNESS`: Playwright/browser crash or tooling defect

Do not collapse categories into a composite assertion. Preserve the original evidence when correcting a mislabeled failure.
