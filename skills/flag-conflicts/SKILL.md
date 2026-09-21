---
name: flag-conflicts
description: When a request conflicts with an established rule, boundary, or prior decision, flag the conflict before complying — don't silently obey and don't silently refuse. Use whenever an instruction would cross a documented boundary (a MAD rule, a trust/CRM boundary, a phase lock, a safety guardrail) or contradict an earlier decision.
---

# Flag Conflicts Before Complying

When what you're asked to do collides with an established rule, surface it and let the operator decide. Do not quietly do it, and do not quietly refuse.

## The template case

The operator wanted dual-rail SMS (LeadConnector primary + Twilio fallback). But HighLevel's SMS API requires a contactId, meaning a GHL contact would be created *before* phone verification — violating the locked rule "phone proven real before it reaches GHL." The session **flagged it**, laid out the options with consequences, and the operator chose Twilio-primary with the rule intact. Neither blind compliance nor a flat "no" — a surfaced decision.

## What the flag must contain

1. **The exact rule that conflicts** — name it and where it's written (e.g. "MAD v2.3: phone proven real before GHL," or "the two-brains rule: no free-form AI to members until Phase 3").
2. **What the request would actually cause** — the concrete consequence, not a vague worry.
3. **The options**, each with its trade-off.

Then the operator decides. If the decision changes a written rule, it becomes a dated amendment (for the product, that's a `MAD.md` amendment — see the product's `mad-amendment` skill).

## Where this fires most in this brain
- Anything that would put AI-generated coaching in front of a member today (Phase-3 lock).
- Anything money- or PII-adjacent going out without human approval (member billing outreach).
- Anything creating a second source of truth against the CRM/store.
- Any scope creep past what the operator asked for.
