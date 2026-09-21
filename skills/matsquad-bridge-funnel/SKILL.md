---
name: matsquad-bridge-funnel
description: The Mat Squad signature fix for clients whose checkout lives on a third-party platform that blocks pixels (Smoothcomp, registration platforms, gym software checkouts, Eventbrite-style systems)... the gated bridge funnel, coupon-as-consent-and-attribution, server-side purchase loop, and QR/flier tracking. Use whenever a client "can't track" ad results, can't run conversion campaigns, or asks about CPL/cost per signup on a platform they don't control. Triggers on words like pixel, tracking, Smoothcomp, third-party checkout, conversion campaign, cost per signup, CPL, bridge page, coupon code, QR code, flier attribution. Architecture proven in design on a live client engagement (2026-08); conversion rates pending a pilot event... quote the design, not results, until then.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Mat Squad Bridge Funnel

## The wall

The client sells through a platform they don't own. No pixel on checkout means no conversion events, which means Meta can only be asked for clickers... traffic-ad purgatory, forever, with ROAS uncomputable. The fix is never "get code onto their platform." It's: **own the click before the platform, and reconcile after the money lands.**

## The architecture

**1. Gated bridge page** on a domain the client controls. Email + phone in exchange for a discount code. The coupon flips the gate from toll to gift... "get your $10 code" converts where "enter your info to continue" repels. It also upgrades consent: express, documented, timestamped, SMS-legal. On clients with "Implied"-permission lists, this page is the ONLY compliant path to a text list. Say that in the pitch... it reframes the funnel from tracking hack to asset.

**2. Dual code delivery.** Code shows on the thank-you page AND fires instantly by SMS + email. Page = instant gratification, text = what survives until checkout. Every subsequent touch treats the code as something they already have ("here's that code again so you don't lose it"). Kills the forgot-to-use-it problem and gives every automated message a reason to exist.

**3. The optimization event.** Pixel fires Lead on form submit. Campaign objective: Leads, optimized on that custom conversion. **Pre-frame with the client before launch: CPC will rise.** Conversion campaigns don't chase cheap clickers... the metric is getting honest, not worse. The new scoreboard is cost per captured contact, which under the traffic objective was infinite.

**4. Close the loop server-side.** Platform registration export → Meta as Purchase events, matched on email + phone, registration fee as value. Weekly manual CSV upload first; automate later (a client-side Stripe → Zapier → Meta pipe may already exist... ask before building). Meta's matching IS the source separation: fliers, word-of-mouth, and platform-search signups never touched an ad, don't match, don't count. Known caveats, state them honestly: the 7-day click window undercounts deadline-spiky purchases, and weekly batches are too slow and thin to optimize on alone... the bridge Lead event carries optimization, the upload carries truth.

**5. The recovery loop.** Cross-check the registration export against the lead list. Opted in but not registered = abandoner → deadline-driven sequence ("your code dies with early bird"). This is where the gate pays for itself... those people used to evaporate.

**6. Coupon as attribution floor.** Channel-unique codes (FB code, flier code, email code). Redemptions per code in the platform = registrations per channel with zero technical integration. Expiry tied to a real deadline only... never fake scarcity.

## Offline and QR

Tracking lives in the destination, not the code. **QR → redirect funnel step → platform.** Scans per event appear in funnel analytics; the redirect adds a quarter second, invisible.

Build it once as an operator system: a template funnel named `QR - TEMPLATE - DO NOT EDIT`. The operator duplicates it, renames by event (`QR - [City] Fall Open 2026`... analytics is useless if they're all named "QR Redirect"), pastes the event URL into the redirect step, copies the natively-generated QR image into the flier template, and **test-scans on a real phone before anything goes to print.** The test scan is the only step people skip and the only one that costs real money... a wrong link found after 2,000 fliers print is unfixable. Four steps, five minutes. Write it as an SOP with Owner / Frequency / Steps / Definition of Done / Metrics.

Depth later, only if the client wants it: per-academy codes for the top gyms turns "get coaches to push it" from a hope into a measured program.

## Warm audience banking

Start on day one, costs nothing: video-view and engagement custom audiences need no pixel and the third-party wall can't block them. Most accounts have millions of impressions and zero warm audiences... every event restarting from cold. From the first campaign forward, every video viewer becomes the next event's launch audience.

## Split tests that matter

- Traffic campaign vs bridge-page Leads campaign... same creative, same budget. The headline test.
- One-click handoff vs two-step gate (capture then redirect).
- Direct-QR vs gated-QR, split by academy... warm environments may answer differently than cold traffic.

## The parallel escalation

File the platform feature request while the workaround runs: a per-organizer pixel field firing Purchase with value on confirmation, or better, **registration webhooks** (easier build for the platform, solves everything... real-time Conversions API via Make). Use the client's weight as a major customer, rally other large organizers to co-sign, and frame it as revenue for the platform: organizers who can track spend more, which sells more registrations they clip fees on. Precedent exists... niche booking SaaS already ships pixel fields. The bridge is the vehicle, native tracking is the destination; if they ship, retire the workaround.
