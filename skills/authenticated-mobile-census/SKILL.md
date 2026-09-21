---
name: authenticated-mobile-census
description: Verify the real authenticated Excelsior mobile journey in WebKit with physical touch semantics and atomic subsystem assertions. Use for touch census, OTP/session diagnosis, COSMOS boot, label/branch/orb selection, lesson modal playback, completion spine, return pose, and protected test-member state checks before a visual slice may ship.
---

# Authenticated Mobile Census

Prove the member journey, not merely component visibility.

## Prepare

1. Use the exact production bundle and governed mobile WebKit profile.
2. Reuse a valid authenticated test session. Do not request a fresh OTP for every run. If authentication is required, respect provider rate limits and expose retry-after time.
3. Snapshot protected test-member state before the run. Treat Second Member and other named accounts as read-only unless the ruling explicitly authorizes mutation.
4. Confirm Playwright/browser version and bundle health before interpreting app failures.

## Walk the journey

Use real pointer/touch actions, not direct DOM `dispatchEvent` shortcuts:

1. authenticate or restore session;
2. enter COSMOS and wait for the actual world-ready signal;
3. activate governed map label, branch, and orb targets;
4. verify focus camera and focused labels;
5. open the real lesson modal and exercise the ruled playback controls;
6. verify completion behavior only to the extent authorized;
7. close/return and prove the governed return pose;
8. verify back navigation and member-state invariants.

## Assertion law

One assertion must cover one subsystem. Authentication, portal navigation, world boot, rendering, hit testing, player behavior, completion, and return pose get separate names, timers, evidence, and failure messages. Never label a world-boot timeout as an OTP failure.

Use [references/census-law.md](references/census-law.md). Report the exact pass count and every skipped or unexercised target. A browser crash, stale session, partial walk, or compound failure is not green.
