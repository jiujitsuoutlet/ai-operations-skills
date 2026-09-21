# Physical-device protocol

## Fixed conditions

- Production bundle with full `app_commit`
- Mobile Safari foregrounded
- Low Power Mode explicitly reported
- Same CSS viewport and renderer DPR
- Same account, state, route, camera script, and scene features
- Phone at rest and cooled for the governed interval
- Wake lock requested when available

## Locked-30 target

Use the current MAD for authoritative thresholds. Unless superseded, require orbit median at or below 33.33 ms with near-zero dropped frames and inspect P95, long-frame percentage, worst frame, and drag behavior. A passing median with unstable tails is not a clean pass.

## Variance

Use N=3 cooled runs for baseline and candidate. Escalate to the full interleaved protocol when spreads overlap, the candidate lands within roughly 3 ms of the ceiling, or a claimed fix is smaller than observed drift. Never run all baseline samples first and all candidate samples last when attributing small differences.
