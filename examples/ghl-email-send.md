# Example: ghl-email-send

> **Illustrative example.** Synthetic data, written for this portfolio from the skill's own procedure. It is not a transcript of a real run. "Example Academy", every ID, name, time, and count below is invented.

Skill: [`skills/ghl-email-send`](../skills/ghl-email-send/SKILL.md)

## Invocation

```text
Write me a new email please.
```

## Sample output (abridged, one turn per gate of the SEND LOOP)

**Gate 0, TOPIC and OBJECTION** (the skill requires a one-line proposal and a yes before anything is drafted):

```text
Topic: first-class nerves for adults, answering the objection
"I'd slow down the group." Is that the one you actually hear?
Last two sends argued "energy needs an outlet" and told a comeback memoir,
so this one is a teaching email, not a memoir.
```

**Gate 1, DRAFT** is delivered in chat only. Nothing touches the CRM. The draft ends with:

```text
Assumed: email voice, first person.
Confirm these decaying facts: Tuesday 6pm beginner class still runs; location list is current.
Words that are mine, not yours: the preview text.
```

**Gate 3, TEST** goes to the one-person Voice Test list by literal contact ID, so it cannot reach anyone else:

```json
{ "recipients": { "type": "contact", "contactIds": ["<VOICE_TEST_CONTACT_ID>"] } }
```

**Gate 5, GO** happens only after the operator's explicit word. The skill shows the schedule payload as text, because that payload is the only reviewable artifact:

```json
{
  "dryRun": true,
  "recipients": { "type": "tag", "tagIds": ["<ENGAGED_60D_TAG_ID>"] },
  "emailMeta": {
    "subject": "The new person is never slowing anyone down",
    "fromName": "Example Academy",
    "fromEmail": "coach@send.example-academy.com",
    "previewText": "Everyone on the mat started exactly where you are."
  },
  "scheduleType": "scheduled",
  "scheduleConfig": { "sendAt": "2026-10-06 09:15 AM" }
}
```

After the operator approves the payload and the real call runs:

```text
Read-back: status "scheduled", campaignType "schedule_later" (not an immediate send).
get-campaign-stats: sent 0 / accepted 0 / delivered 0.
Kill window: open until Mon 9:15 AM. Campaign <CAMPAIGN_ID>.
Audience: I counted the tag myself (fresh re-poll). The platform confirms its own
recipient count only after the send, in "sent".
```

**Gate 6, SCORE** (after the send): `sent` vs. the operator's own tag count (the gap is platform suppression of past unsubscribes and bounces), complaint rate against the 0.1% line, and the voice deltas logged.

## What the example shows

- Recipients attach at schedule time, in one atomic call. So the review happens on the payload text, not on a campaign sitting in a queue.
- `scheduleType: "scheduled"` with a 15-minute-plus buffer keeps a kill window. The skill never uses `"immediate"`.
- The model names the words it wrote itself and the facts that can go stale. It never invents a checkable fact.
