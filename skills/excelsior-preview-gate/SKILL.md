---
name: excelsior-preview-gate
description: Use for getting a gate-pending Excelsior build onto Paul's phone and promoting it to production... Vercel preview deploys, protection-bypass tokens, the walkthrough gate, gold-standard lock, and the production promotion pre-flight. Triggers on words like preview, bypass token, protection bypass, walkthrough, gate, GATE-PENDING, promote, production, Vercel, flag flip, revoke, promotion pre-flight.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Excelsior Preview + Promotion Gate

How a member-facing slice travels the last mile: built-and-proven → onto Paul's
phone behind a Vercel preview → his walkthrough verdict → gold-standard lock →
production. This owns the CHOREOGRAPHY of that trip and the bypass-token
lifecycle. It does not restate the mechanics it sits on:

- `excelsior-ship` owns the `--prod` deploy recipe, PR law, the worktree lane
  rider, and the secrets hold. This skill defers to it for all of that.
- `excelsior-verify` owns the proof law and the gate-report format... WHAT
  counts as proven. This skill owns getting that proof in front of Paul and
  the promotion pre-flight checklist.
- The MAD is canonical over both.

## Verify the served bundle before trusting ANY preview number

The single most expensive trap on this project's preview path. Two worktrees
(`<AGENT_LANE>` agent lane, `<APP_LANE>` app lane) each carry
their own `.claude/launch.json` with an identically-named server ("test-signup-app",
port 5173) pointing at two DIFFERENT `app/` checkouts. If the session's primary
directory is the agent lane, `preview_start` silently serves the agent lane's
STALE app... no error, no warning, just a running server that looks fine until
you notice code that should exist doesn't (`?cosmos=1` fell through to the wheel
because the served `app.js` had zero occurrences of "cosmos").

- For any app/pol3d/renderer work, start the dev server manually via Bash with
  an explicit `cd <APP_LANE>/app` before `npm run dev`,
  bypassing `preview_start` entirely... OR
- If you do use `preview_start`, immediately `curl` the served `app.js` (or
  another lane-specific string) and confirm the expected recent code is in it
  BEFORE trusting any screenshot, fps number, or measurement from it.
- The verification law already mandates Playwright WebKit scripts over generic
  browser tools here, so the manual-Bash route is usually right by default.

## The preview walkthrough loop (recurs verbatim, get it exact)

Paul walks member-facing visual slices on his own iPhone against a real deploy...
that is the FLAGSHIP beauty veto (MAD v2.17), on top of correctness. The loop:

1. **Build the app-lane bundle** on the slice's branch: `cd app && npm run build`.
   Confirm you are on the right branch/commit and the tree is clean first.
2. **Secrets-scan the BUILT bundle**, never skip:
   `grep -rlE "sb_secret_|service_role|SUPABASE_SERVICE|-----BEGIN [A-Z ]*PRIVATE KEY|TWILIO_|GHL_" dist/`
   ... any hit aborts. Only the browser-safe publishable pair ships.
3. **Copy `dist` into a folder literally named `<VERCEL_PROJECT>`** (Vercel keys
   the project off the folder name) and deploy a PREVIEW, never `--prod`:
   `vercel deploy --yes --scope <VERCEL_SCOPE>`. Confirm the result shows
   `"target": null` (preview, not production).
4. **Mint a fresh protection-bypass token** so the preview opens without a Vercel
   login on his phone:
   `vercel project protection enable <VERCEL_PROJECT> --protection-bypass --scope <VERCEL_SCOPE>`
   then read the value back with
   `vercel project protection <VERCEL_PROJECT> --scope <VERCEL_SCOPE>`.
5. **Hand Paul the URL with the flag AND the bypass already on it** (below).
6. **Revoke the token the moment he's done walking it** (below). Never leave a
   bypass secret live... it is a credential that defeats the deployment's own
   auth wall.

### The bypass URL format

```
https://<preview>.vercel.app/?<yourflag>=1&x-vercel-protection-bypass=<TOKEN>&x-vercel-set-bypass-cookie=true
```

`x-vercel-set-bypass-cookie=true` sets the cookie so his whole session stays
past the SSO wall, not just the first request. The bypass only lifts VERCEL's
gate... the app's own phone/OTP sign-in still runs, so he still authenticates as
a real member (the full-seam rider holds, auth is never bypassed).

### Revoke (do this every time, on his word)

```
vercel project protection disable <VERCEL_PROJECT> --protection-bypass \
  --protection-bypass-secret <TOKEN> --scope <VERCEL_SCOPE>
```

Confirm `protectionBypass: {}` afterward. If you redeploy for a second
walkthrough, revoke the OLD token before minting the new one... never let two
live at once. SSO deployment protection (the standing D7 deviation) stays ON
throughout; the bypass is a temporary hole in it, not a replacement for it.

## Confirming the deployed bundle is the one you think it is

`curl`ing a protected preview URL, even with the bypass query params attached,
can return Vercel's own SSO interstitial HTML instead of the app... the params
land correctly for a real browser (which follows the redirect and sets the
bypass cookie) but a bare `curl` frequently doesn't complete that handshake,
and the interstitial parses as "success" if you only check the HTTP status.
Hit twice on the RANGE-2 arc: `curl` returned zero script tags matching the
built bundle on a deploy that was, on inspection, correct.

The reliable check is a REAL browser context, not curl:
```js
await page.goto(`${url}/?...&x-vercel-protection-bypass=${token}&x-vercel-set-bypass-cookie=true`);
const scripts = await page.evaluate(() =>
  [...document.querySelectorAll("script[src]")].map(s => s.getAttribute("src")));
```
Compare the `/assets/index-<hash>.js` filename against `ls app/dist/assets/`
from the exact build you just deployed... the hash is Vite's content hash, so
an exact string match is proof of bundle identity, not a heuristic. Do this
before trusting ANY screenshot or measurement taken against a deployed preview,
the same discipline the dev-server section above applies to local lanes.

## Preview fps is a lie... it carries Vercel's own debug bar

A preview measuring far below its proven fps is almost always Vercel's injected
Live Feedback/Toolbar widget, NOT a bad build or a regression. Vercel injects
`<script ... src="https://vercel.live/_next-live/feedback/feedback.js">` (~75 kB)
into every PREVIEW deployment server-side... it is absent from production.
Diagnose before believing a regression:

1. Re-measure the DEPLOYED bundle directly with the Playwright WebKit iPhone
   profile against the preview URL. If it reads the proven fps with zero page
   errors and a real GPU context (`Apple GPU`, not a software fallback), the
   bundle is fine.
2. `curl` the served HTML and diff it against your own `dist/index.html`. The
   `vercel.live` line is the injected extra.
3. Confirm the live PRODUCTION URL carries no `vercel.live` at all.

Verdict: browser-throttle from the debug bar, cannot reproduce on production.

## Gate discipline for member-facing visual slices

- A slice built and proven but awaiting Paul's eye is **GATE-PENDING**, logged
  as such in `docs/BUILD-LOG-YYYY-MM.md`, and **NOT merged**. Passing every
  measured floor is necessary, not sufficient... his walkthrough is the beauty
  veto (FLAGSHIP, MAD v2.17).
- When he accepts, **lock it as the gold standard**: record his verdict verbatim
  in the build log, and note that future tuning is measured against the accepted
  render, not just the original pinned reference.
- **Stop at the gate and flag him.** Never self-merge or self-promote a
  member-facing slice. Recommend routing FLAGSHIP-class visual rulings to the
  strongest judgment model (Opus 4.8 precedent), even when the slice was built
  on Sonnet.
- Route the token/deploy housekeeping into the SAME build-log entry that closes
  the gate: verdict recorded, bypass revoked, agent lane reconfirmed untouched.

## The production promotion pre-flight

You may `--prod` only on Paul's explicit word, and only after the full battery.
Merge the branch to `main` via PR first (`excelsior-ship` PR law), then:

- **RLS re-proof**: a MEMBER token (never service role) attempts privileged
  writes and is rejected; an anonymous call is rejected outright. Reusable script:
  `app/tests/rls-reproof.mjs` (member content-admin actions → 403, direct table
  writes → 42501, anon → 401). All paths must reject.
- **Demo spine end-to-end**: `app/tests/preflight-spine.mjs spine <lessonId>`...
  real heartbeats → server verdict → points land in the ledger. `spine_green: true`.
- **Second Member fixture UNTOUCHED at 5 completions / 25 pts**:
  `preflight-spine.mjs fixture`. This account is the tier-up demo and is
  untouchable... read-only auth read, never a completion.
- **Touch census 76/76**: `npm run test:touch` (real WebKit taps; the 2.5D
  fallback must still boot and pass).
- **Secrets scan of `dist/`** again on the exact commit being promoted.
- **Agent lane untouched** at its recorded baseline (below).
- After promotion: verify the live URL serves the NEW bundle hash, capture
  production evidence immediately (previews expire and sit behind SSO), and log
  the promotion.

### Beautiful but unusable is a regression, not a ship

Before flipping any default flag, confirm the flow the flag exposes actually
WORKS end to end, not just renders. Cosmos was accepted as a gorgeous 3D world,
but Phase 6 (tap-an-orb → open the lesson player) was never built... `world.js`
received a `nav.openLesson` callback it never called. Flipping `?cosmos=1` on
would have handed every member a tree they can fly around but can't watch a
lesson from. The correct call: merge the renderer with the flag still OFF
(renderer-only, members unaffected, the code lives in a lazy chunk never loaded
without the flag), and HOLD the default flip for a later slice once the flow is
complete. Catch this class before it ships... trace the callback to a real call
site, don't assume a merged renderer means a usable feature.

## Agent-lane rider (confirm, every close-out)

Every slice close and every promotion reconfirms the OTHER lane is untouched:
`git -C <AGENT_LANE> rev-parse HEAD` matches its recorded baseline,
working tree clean. Prove it byte-identical, don't assert it.

## Related

`excelsior-ship` (the `--prod` recipe, PR law, lane rider, secrets hold this
sits on) · `excelsior-verify` (the proof law and gate-report format) ·
`excelsior-security` (private skill, not published) (a bypass token is a credential... mint/revoke hygiene) ·
`report-back` (how the close-out reads to Paul) · `flag-conflicts` (when a
promotion instruction collides with an unbuilt flow, as the Cosmos flag flip did).
