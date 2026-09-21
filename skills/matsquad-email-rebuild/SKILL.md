---
name: matsquad-email-rebuild
description: The Mat Squad doctrine for rebuilding a client's email/SMS system on a new platform... migration sequencing, list cleaning, the sunset re-permission campaign, sender reputation, ramp schedules, and the ownership/affiliate model. Use whenever moving a client off Constant Contact/Mailchimp/etc., cleaning a decayed list, standing up a new sending domain, or deciding how the client's account should be owned. Triggers on words like migration, migrate, list cleaning, re-permission, sunset campaign, sender reputation, warmup, ramp, subdomain, deliverability rebuild, SMS consent, platform switch, affiliate. Sequenced on a live client rebuild (2026-08).
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Mat Squad Email Rebuild

## Prime directive

**Export the engagement data before touching anything.** Most/somewhat/least engaged segments plus per-campaign opens and clicks. It does not migrate on its own, the contact export does not contain it, and without it every downstream segmentation decision is guessing by created-date. Secure it even if the client hasn't said yes to anything... it's the one artifact that's unrecoverable if the old account gets cancelled in a fit of enthusiasm.

## Four buckets, three fates

1. **Engaged ≤ 12 months** → migrate directly. NO re-permission campaign... asking someone who opened last week to confirm they want your emails invites them to say no.
2. **Dormant 12-36 months** → the sunset campaign. Migrate responders only.
3. **Cold 3+ years, placeholders, role addresses** → neither mailed nor migrated. Usually the biggest bucket. Deleting it is the point.
4. **Unsubscribed** → migrate FIRST, as suppression only, never mailed. CAN-SPAM opt-outs are permanent and platform-independent, and mailing them is the fastest way to torch a fresh sending domain.

## The sunset campaign

Run it on the DYING platform. A re-permission send to dormant contacts generates bounces and complaints by design... those land on the reputation being abandoned, not the one being built. Running it from the new domain would be the single worst possible first send. One extra month of the old platform's bill is the price of not torching the new domain. Cheap.

Three emails over two weeks, one ask: "still want these?" Everyone silent comes off the bulk list permanently. Reactivation is **a campaign with an end date, never a recurring habit**... a monthly all-list "newsletter to re-engage folks" permanently dilutes the rolling engagement percentage mailbox providers judge on. Newsletters, if wanted, go to the engaged segment only.

**The upgrade:** send from the old platform, land the click on the new platform's opt-in page. Responders arrive already tagged, with documented express consent replacing "Implied," and an optional phone field with SMS consent language seeds the compliant text list. One campaign, three jobs: clean, consent-upgrade, SMS seed.

## Sending infrastructure

- **Subdomain sending** (`send.clientdomain.com`), never the root. Bulk risk stays isolated from the Workspace mail that reaches vendors and venues. Cost: reputation starts from zero. Take the trade... it's the one architectural call that's expensive to reverse.
- **DMARC with `rua=` from day one**, policy `p=none` until reports come back clean. Tightening policy blind is how people break their own mail. A DMARC with no rua means years of reports sent to nobody... check for this on every client.
- **Warm the address bulk will actually send from.** Reputation doesn't transfer across sending domains... one-off personal emails from the owner's Workspace address warm nothing the campaigns use. Replies are a real ranking input for the domain that sent the message, so generate them INSIDE campaigns: make a reply the CTA sometimes, and have the operator actually answer.
- **Ramp:** most-engaged few hundred first, build to full volume over 4-6 weeks. A new domain that suddenly blasts thousands looks exactly like a compromised domain... that's how you EARN the spam folder.
- Google Postmaster Tools verified on the new domain before volume scales. Spam rate must hold under 0.10%; over 0.30% is active throttling.

## Platform economics... the frame that ends debates

Per-contact platforms (Constant Contact, Mailchimp) make growth a billing penalty and cleaning the only discount. Per-send platforms invert it: HighLevel email runs $0.675 per 1,000 sends with unlimited contacts; SMS lands around $0.013/segment all-in with carrier fees. Compute the client's current **channel cost per click** (platform bill ÷ monthly clicks) against their own paid CPC... Illustrative example: $2.00 per email click against $0.40 per ad click (illustrative numbers). Then show the projected new bill next to the old one. Cleaning the list LOWERS the new bill instead of being homework.

## Ownership doctrine... non-negotiable

**The client buys their own account. You are a user on it.** Never host a client as a tenant inside the agency account... it rebuilds the exact dependency Mat Squad exists to end, and strands their infrastructure if the relationship changes. Starter plan unless they genuinely run multiple businesses; recommending the cheaper plan in the room is worth more than the commission difference.

Affiliate link, with verbal disclosure BEFORE signup, verbatim: **"I earn a referral commission if you sign up through my link. I'd recommend it either way... here's the math."** Said upfront it's transparency; discovered later it's a credibility problem at Mat Squad price points. Fresh signup through the link in the meeting (attribution on existing accounts is unreliable; commissions qualify after ~45 days in good standing). Standing self-check: once affiliate income exists, the pressure is to recommend the platform to everyone. Keep the recommendation honest per client or the revenue corrupts the advice.

## Migration hours are real hours

List cleaning, sunset campaign, segment rebuild, and automation rebuild is a phase, not a favor. On free case-study engagements, the pilot proves one system on one event... the migration is named as paid phase two, before enthusiasm scopes it into the gift.
