# Example: ghl-nurture-agent

> **Illustrative example.** Synthetic data, written for this portfolio from the skill's own procedure. It is not output from a real run. Every name, phone fragment, and count below is invented.

Skill: [`skills/ghl-nurture-agent`](../skills/ghl-nurture-agent/SKILL.md)

## Invocation

```text
Add a text-reactivation tagger to the call-list agent. HighLevel workflows do the
sending; the bot only tags. Ship it safely.
```

## Sample output (abridged)

**Plan.** The skill's safety stack, applied:

```text
1. Add-tag only: POST /contacts/{id}/tags with REACTIVATION_TAG + bot-texted-<today>.
   Never a PUT of the whole tag array (it clobbers tags other systems own).
2. SMS_COOLDOWN_DAYS = 14, longer than the 7-day drip, so nobody is re-texted mid-drip.
   It rotates separately from the call-list cooldown (own tag prefix).
3. Pool floor: if fewer than MIN_FRESH_TO_RUN fresh contacts remain after the cooldown,
   tag nobody and post a skip notice. Never reach into the cooldown to fill the cap.
4. Idempotency: count contacts already carrying bot-texted-<today> and top up to the cap.
   A same-morning rerun never doubles it.
5. A failed tag write does not stamp bot-texted-<today>. The lead stays eligible tomorrow.
6. DRY_RUN ships true. Then scale the cap in steps (10, 35, 50) with a read-back after each.
```

**First run, DRY_RUN preview posted to Telegram** (phones masked in the run log):

```text
[DRY_RUN] Reactivation batch 2026-10-06 (nothing tagged)
Funnel: pipelines 640 | tags 1,120 | union 1,310 | -members 1,090 | -no phone 1,005
        | -DND 982 | -14d text cooldown 610 | cap 10
 1. Alex R.   (***-***-4821)  replied to free-class ad, 3 days ago
 2. Dana M.   (***-***-0937)  trial booked, no-show
 ...
10. Sam T.    (***-***-5512)  "new lead" tag, never contacted
```

**Member-exclusion test** (the skill says to test the risky logic before pushing):

```python
assert is_member([" Current-Member-North "])      # casing and whitespace variants
assert is_member(["paid-challenge north"])         # paid-offer keyword
assert is_member(["example parent"])               # exact-match family tag
assert not is_member(["trial", "replied"])         # a real lead must stay callable
```

**After the first live run**, the write-landed proof re-reads the contacts from the CRM instead of trusting the log:

```text
Re-read 10/10 tagged contacts from GHL: both tags present on 10/10.
Log said "applied 10". The read-back agrees.
Holding the cap at 10 for two mornings to watch the cooldown round-trip before raising it.
```

## What the example shows

- The CRM stays the system of record. The agent reads, filters, and tags. HighLevel workflows send.
- Paying members are excluded by tag pattern, not only by pipeline stage. The skill also states the blind spot: a member with no tags and no member-pipeline opportunity cannot be caught.
- The safety limits are anti-harassment guarantees, not tuning knobs.
