# Example: ghl-email-send

> **Illustrative example.** Synthetic data, written for this portfolio from the skill's own procedure. It is not a transcript of a real run. "Example Academy", every ID, name, time, and count below is invented.

Skill: [`skills/ghl-email-send`](../skills/ghl-email-send/SKILL.md)

**Fictional setup:** the account's time zone is US Central (`America/Chicago`), and the campaign is created with that time zone. Every time below is Central. The operator approves the send on **Monday, October 5, 2026 at 4:40 PM**, for delivery on **Tuesday, October 6, 2026 at 9:15 AM**.

## Invocation

```text
Write me a new email please.
```

## Sample output (abridged, one turn per gate of the SEND LOOP)

**Gate 0, TOPIC and OBJECTION.** The skill requires a one-line proposal and a yes before anything is drafted:

```text
Topic: first-class nerves for adults, answering the objection
"I'd slow down the group." Is that the one you actually hear?
The last two sends argued "energy needs an outlet" and told a comeback memoir,
so this one is a teaching email, not a memoir.
```

**Gate 1, DRAFT.** The draft is delivered in chat only; nothing touches the CRM. It ends with:

```text
Assumed: email voice, first person.
Confirm these facts before we build: the Thursday 6 PM beginner class still runs;
the location list is current.
Words that are mine, not yours: the preview text.
```

**Gate 3, TEST.** The draft goes to the one-person Voice Test list by literal contact ID, so it cannot reach anyone else:

```json
{ "recipients": { "type": "contact", "contactIds": ["<VOICE_TEST_CONTACT_ID>"] } }
```

**Gate 5, GO.** This gate runs only after the operator's explicit word (Mon Oct 5, 4:40 PM). The campaign was created with `"timeZone": "America/Chicago"`, so `sendAt` is read as Central time. The skill shows the schedule payload as text, because that payload is the only reviewable artifact:

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
Observed (read-back): status "scheduled", campaignType "schedule_later".
Per the skill, "schedule_later" is the proof this is not an immediate send.
Observed (get-campaign-stats): sent 0 / accepted 0 / delivered 0. Nothing has gone out.

Cancellation window (time to cancel before sending): open now, closes
Tuesday, October 6, 2026 at 9:15 AM Central. Campaign <CAMPAIGN_ID>.
To cancel: delete-campaign, then read the campaign back and confirm "cancelled".
A delete response alone does not prove the send was stopped.

Audience: I counted the tag myself (fresh re-poll). That is my count, not the
platform's. The platform only reports its own recipient count after the send, in "sent".
```

**Gate 6, SCORE** (after the send): compare `sent` with the operator's own tag count; the gap is the platform suppressing past unsubscribes and bounces. Check the complaint rate against the 0.1% line and log the voice deltas.

## What the example shows

- Recipients attach at schedule time, in one atomic call. Review happens on the payload text, not on a campaign sitting in a queue.
- `scheduleType: "scheduled"` with a buffer of at least 15 minutes keeps time to cancel. The skill never uses `"immediate"`.
- The output separates what was observed (read-backs, stats) from what the skill infers from them.
- The model names the words it wrote itself and the facts that can go stale, and it asks instead of inventing a checkable fact.
