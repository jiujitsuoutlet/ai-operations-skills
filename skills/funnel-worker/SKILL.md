---
name: funnel-worker
description: Build a paid-traffic funnel on Cloudflare Workers with D1 and hosted checkout such as Stripe Checkout, ThriveCart, SamCart, or Gumroad. Covers intake, the scaffold, the default owner page editor, preview mode, deploy gates, lead capture, A/B assignment, attribution, signed webhooks, and fulfillment boundaries. Use when building or changing an offer page, bridge page, funnel, landing page, upsell or downsell, cart handoff, split test, or purchase attribution.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.
>
> **Status: incomplete reference scaffold, not a ready-to-run tool.** `assets/` is the reference code for the pattern described below. It does not build or deploy as shipped, and the private source is missing the same files:
> - the four page templates `assets/worker.js` imports: `pages/landing-a.html`, `pages/landing-b.html`, `pages/thanks.html`, `pages/preview-checkout.html`
> - a `package.json` defining the `preflight`, `scan`, `build:tc`, and `deploy` scripts
> - the cart page sources under `src/cart/_src/` read by `build-cart-pages.mjs`
> - the `src/deferred/` folder
>
> The scripts expect the files under `src/` (as `wrangler.toml` sets `main = "src/worker.js"`), while this copy keeps them in `assets/`. The preflight gate's required-section list is a placeholder to replace.

# Funnel Worker

The shape that works: **the Worker owns the experience and server state; the
payment provider owns card data and the payment ledger.** Everything expensive
that went wrong on the first build of this pattern came from blurring that line,
or from writing code before the offer was pinned.

Scaffold lives in `assets/`. Copy it, adapt it, do not re-derive it.

## Step 0 ... intake, before any code

Six rebuilds on the first build of this pattern traced to facts that arrived
after the code did. Ask all of this in ONE message and wait. It is cheaper than
any of the rebuilds it prevents.

1. **The offer.** Exact product name, exact price, what is in it, in the
   client's own words. Ask for the list verbatim.
2. **Where checkout happens.** If a cart platform already exists, the Worker
   hands off to it. For Stripe Checkout, the Worker may create server-side
   sessions and receive signed webhooks, but never handles card data.
3. **What happens after purchase.** If the cart runs its own upsell chain, those
   pages are NOT Worker routes... one-click requires the payment session to stay
   on the cart. Build them as standalone HTML for the cart's builder instead.
4. **Which prices live where.** A price duplicated in two systems will drift.
   Decide the owner now and put it in the README.
5. **The brand.** Get the live URL and MEASURE it (see [brand-fidelity-recon](../brand-fidelity-recon/SKILL.md)).
   Never design from a verbal description of a site that exists.
6. **Deadline, guarantee, refund policy, support email, terms and privacy URLs.**
   These are the placeholders that block launch.
7. **Voice.** Get a rule set or a sample. Ask what is forbidden, not just what
   is wanted.

If an answer is missing, build with a marked `[[PLACEHOLDER]]` and let the
deploy gate carry it. Never invent a price, a claim, a testimonial, a date, or a
product name.

## Step 1 ... credentials, before promising a deploy

`wrangler whoami` first, always, before writing a line. An `export` in the
operator's own terminal does NOT reach an agent shell: a fresh non-interactive
shell is spawned per command and inherits nothing. Do not ask for the token in
chat. Have them write it to a file and source it:

    printf 'export CLOUDFLARE_API_TOKEN=%s\n' 'TOKEN' > ~/.cf-<project>.env && chmod 600 ~/.cf-<project>.env

Then run every Cloudflare command as `source ~/.cf-<project>.env && npx wrangler ...`.

An unauthenticated 401 tells you NOTHING about a token's permissions. Only a
real 403 on a real call does. Probe with a throwaway script upload and delete
rather than guessing which scope is missing.

## Step 2 ... build order

1. `wrangler.toml` with `[[rules]]` Text modules for `**/*.html`, `**/*.css` and
   the shared page script... this is what removes the build step.
2. Migration 0001: `leads`, `orders`, and `webhook_events`; add a stable
   fulfillment outbox when the Worker grants access.
3. `worker.js` from `assets/worker.js`: router, health, lead capture, rate
   limit, preview mode, variant assignment, stats.
4. Design system from measured values (never invented), then page skeletons.
5. The authenticated drag-and-drop owner editor from `custom-site-editor`,
   built against the same renderer as the public pages.
6. `scripts/scan-secrets.sh` and `scripts/preflight.mjs` from `assets/`.
7. Cart pages, if any, generated from the same design system.

## The laws

**Preview mode defaults to ON.** `PREVIEW_MODE` is true unless the value is
exactly the string `"false"`. Unset means preview. A missing variable must never
be able to point paid traffic at a cart that is not wired.

**The deploy gate is the deliverable.** `npm run preflight` refuses a
half-configured launch: cart URL set, deadline set and in the future, preview
off, real database id, no unfilled placeholders in any page, generated pages
current, secrets scan clean. Chain it: `"deploy": "npm run preflight && wrangler deploy"`.

**Prove every gate in both directions.** A scan that has never failed is not a
scan. Plant a fake key, watch it exit 1, remove it. Fill the config temporarily,
watch preflight pass, restore. A green light nobody has seen turn red is decoration.

**Verify in a browser, not with curl.** curl and a successful bundle build both
looked healthy while every page was dying on a JS syntax error. See
`references/gotchas.md` for that one.

**The sale never waits on your storage.** Lead capture races a hard timeout
(1.5s) before the cart handoff, and a failure or a 429 still proceeds.

**Park, do not delete.** Retired code goes to `src/deferred/` with a README
saying why, what stayed behind, and what would bring it back.

## Attribution and A/B

The full pattern, including why a split test without it measures clicks instead
of money: `references/attribution.md`.

## Verification before saying done

- both variants render at 375 and 1024, no console errors, no horizontal overflow
- extract the inlined script from the SERVED html and `node --check` it
- cookie sticks across reloads, `?v=` override works and does not overwrite it
- every page loads in the authenticated editor; draft, publish, drag ordering,
  history, and restore pass; commerce blocks remain locked
- `npm run scan` and `npm run preflight` output pasted, not summarized
- report which cart fields you are unsure of rather than implying they are verified

## Related

`brand-fidelity-recon` (measure the design before building it) ·
`custom-site-editor` (the default owner editing surface) ·
`secretless-static-deploy` (the same secrets discipline, static hosts) ·
`verify-before-asserting` · `report-back` · `prompt-preflight` (voice work) ·
`flag-conflicts` (when a measurement contradicts the brief)
