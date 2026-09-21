---
name: matsquad-diagnostics
description: The Mat Squad new-client diagnostic playbook... how to audit a martial arts business's email platform, contact list, and Meta ad account from raw exports and produce an irrefutable findings pitch. Use at the start of EVERY client engagement, before proposing anything. Triggers on words like new client, audit, diagnose, intake, email audit, ad account audit, list audit, deliverability, bounce rate, open rate, CTOR, contact export, ad spend export, Constant Contact, Mailchimp, "what's wrong with their marketing." Forged on a live client engagement (2026-08)... every threshold below is measured, not theoretical.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Mat Squad Client Diagnostics

Diagnosis before prescription. Never propose a rebuild until the client's own exports force the conclusion. The pitch writes itself when the numbers are theirs.

## Day-one access list

Request in the first conversation: email platform admin login, Meta Ads Manager access, contact export (must include status, permission status, source, created date), **the engagement export** (most/somewhat/least engaged + per-campaign opens and clicks... this NEVER migrates between platforms and is the first thing to secure, before any account changes), lifetime ad spend export at ad-set level, and the sending domain name.

Exports before opinions. Engagement data before everything.

## Email platform audit

**Ignore open rate entirely.** Apple Mail Privacy Protection prefetches every tracking pixel on delivery... every Apple subscriber registers as an open whether or not a human looked. Corporate scanners do the same. Pollution tells: desktop-skewed opens on a consumer list (real BJJ/gym audiences run ~60-65% mobile), and clusters of identical open timestamps seconds after send.

**The real numbers:**
- Clicks, click-to-open rate, bounce rate. Nothing else.
- Click trend vs volume trend. Illustrative example: twice the send volume for the same monthly clicks. Doubled mail, same result... that is list fatigue, measured.
- **Channel cost per click** = monthly platform cost ÷ monthly clicks, compared against the client's own paid CPC. Illustrative example: a $300/month platform bill and 150 clicks is $2.00 per email click, against $0.40 per ad click (illustrative numbers). This ratio ends debates.

**Bounce forensics:**
- Over 2% is a problem.
- **Repeating soft-bounce counts on consecutive sends** (80 then 82, 150 then 149, illustrative numbers) = receiving servers actively refusing, not dead mailboxes. Hard bounces auto-suppress after one failure, so a repeating count means blocks nobody is investigating.
- Bounces > clicks on a campaign means the channel was refused more than acted on. Say it exactly that way.

**Data-quality toggles:** check bot click filtering or its equivalent. One client's had been off for over a year... every historical click number was inflated by an unknowable amount. Turn it on, pre-frame the drop as the metric getting honest.

**Authentication... the three-source law.** A deliverability finding isn't a finding until three sources agree:
1. DNS: SPF record, DKIM selectors resolving (ESP-specific... Constant Contact uses ctct1/ctct2 CNAMEd to ccsend.com), DMARC present and whether it has a `rua=` (no rua = years of reports sent to nobody).
2. Platform UI: self-authentication status on the account.
3. **A live campaign header** from a send you KNOW is the client's: signed-by and mailed-by must show the client domain, not the ESP's shared domain. Verify which entity actually sent the sample... a franchise parent's email proves nothing about the client's account.

Never claim "your mail goes to spam" without Google Postmaster Tools data. Set up Postmaster + the DMARC rua on day one; real data arrives in 48 hours. Inference is not evidence.

## Contact list audit

Profile the export in pandas: status split, permission status, source, created-year histogram, domain mix, duplicates, syntax validity, role addresses, and platform placeholder addresses (pattern: `*deleted@smoothcomp.com`... guaranteed hard bounces).

- **Age is the bounce explanation.** Report % of active contacts older than 3 years.
- **Consent is the headline.** Mass "Implied" permission + source "Added by you" = uploaded registration data, never opted in. Defensible for email, illegal for SMS (TCPA: prior express written consent, $500-1,500 statutory per text). No phone column = no SMS list exists, full stop. This reframes the opt-in funnel from tracking workaround to the only compliant path to a text list.
- **Year-gap detection.** A collapsed year of additions (for example, one year's additions collapse and the next year's recover) means paused events or a broken import. Ask which. Broken imports are often recoverable at the source platform... found money.
- Unsubscribes are a permanent legal suppression list. They migrate first, everywhere, forever.

## Meta ad account audit

Lifetime export, ad-set level. In order:

1. **Objective distribution.** Count ad sets by result type. Illustrative pattern: every ad set optimized for link clicks, zero conversion or lead campaigns ever. When it's all traffic objective, ROAS isn't unknown... it's uncomputable by construction. That's the diagnosis in one row.
2. **The evaporation stat.** Total clicks purchased vs total list growth from ALL sources over the same period. Illustrative example: 100,000 clicks bought, 5,000 contacts of list growth (illustrative numbers). It is the single best pitch number that exists... lead with it.
3. **Trend by year:** CPC, CTR, CPM. An improving trend means a competent operator, which flips the pitch tone from "broken" to "well-bought clicks with no bucket underneath." Illustrative pattern: CPC falling and CTR rising year over year.
4. **Frequency.** Over 4 = saturation. Tiny reach + double-digit frequency = money burned on the same eyeballs (illustrative: frequency above 30 on an audience under 1,000).
5. **Budget pattern.** Flat spend across unequal markets = no return signal to steer by. Not incompetence... blindness. Name it that way.
6. **Placement/creative winners from their own data.** One client's Reels ad sets ran a standout CTR at below-average CPC... their own account voted the creative direction. Caveat: link-click CPC on Reels overstates quality (accidental taps); nobody knows click→page-load rate until a landing-page-view or conversion campaign runs.
7. **Warm audiences.** Check for video-view and engagement custom audiences. They need no pixel and are usually absent... millions of impressions with every event restarting from cold is the biggest free win in most accounts.

## Diagnostic laws (paid for in retracted claims)

- Three sources before a conclusion. One header nearly produced a false "authentication is broken" finding twice, in both directions.
- A search-result fact is not a client fact. "Sold out before" came from a search hit and turned out to sit next to the client's worst-performing market... verify with the client before anything enters a pitch or an ad.
- When a stat validates the plan you already wanted, attack it hardest. The sky-high open rate that "proved" the coupon strategy was a very small list.
- Present what's RIGHT first, by name. "Your authentication is clean, your testing structure is real" buys the credibility that the bad findings spend.
- Corrected errors get corrected out loud, immediately. The DO NOT SAY list in call prep is built from your own retractions.

## Output

Findings → the numbers → verdict, in that order, then hand to matsquad-call-prep. The deliverable is never "here's everything wrong"... it's "here's what your own data says, here's what's already good, here's the one thing to prove next."
