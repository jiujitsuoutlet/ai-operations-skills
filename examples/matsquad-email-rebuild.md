# Example: matsquad-email-rebuild

> **Illustrative example.** Synthetic client and synthetic numbers, written for this portfolio from the skill's own doctrine. It is not a real client plan. The per-send prices are the public HighLevel list prices the skill records (as of 2026-08). Check current pricing before quoting them.

Skill: [`skills/matsquad-email-rebuild`](../skills/matsquad-email-rebuild/SKILL.md)

## Invocation

```text
Example Academy wants off Mailchimp and onto HighLevel. 10,000 contacts, $400/month bill.
Plan the migration.
```

## Sample output (abridged; this is a plan, nothing has been migrated)

```text
STEP 0: before anything else
Export the engagement data (most / somewhat / least engaged, plus per-campaign opens and
clicks) from Mailchimp today. It does not migrate on its own, the contact export does not
contain it, and it is gone if the old account is cancelled.

FOUR BUCKETS, THREE FATES (from the engagement export)
  2,100  engaged in the last 12 months     -> migrate directly. No re-permission ask.
  3,400  dormant 12-36 months              -> sunset campaign. Migrate responders only.
  4,100  cold 3+ years / placeholders / role addresses -> neither mailed nor migrated.
    400  unsubscribed                      -> migrate FIRST, as suppression only. Never mailed.

SUNSET CAMPAIGN (runs on Mailchimp, the platform being abandoned)
  3 emails over 2 weeks, one ask: "still want these?"
  The click lands on a HighLevel opt-in page, built so responders arrive tagged, with
  documented express consent and an optional phone field with SMS consent language.
  Silence = removed from the bulk list for good. The campaign has an end date.

SENDING INFRASTRUCTURE
  Send from send.example-academy.com, never the root domain.
  DMARC with rua= from day one, p=none until the reports come back clean.
  Week 1: the most-engaged few hundred. Build to full volume over 4-6 weeks.
  Google Postmaster Tools verified before volume scales. Hold spam rate under 0.10%.

ECONOMICS (illustrative)
  Now: $400/month per-contact billing, about 200 email clicks a month = $2.00 per click,
  against about $0.40 per paid ad click.
  After: per-send billing. Cleaning the list lowers the new bill instead of being homework.

OWNERSHIP
  The academy buys its own HighLevel account. We are users on it, not the host.
  Say before signup: "I earn a referral commission if you sign up through my link.
  I'd recommend it either way... here's the math."
```

## What the example shows

- Migration order protects a fresh sending domain. Suppressions go first, and the risky re-permission send runs on the old platform's reputation.
- Consent is upgraded during the migration, not after it.
- The client owns the account, and the affiliate relationship is disclosed up front.
