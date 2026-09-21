# Example: outbound-rollout-safety

> **Illustrative example.** The job below is a synthetic 12-line script written for this portfolio. The review follows the skill's own audit rule. It is not a real incident report.

Skill: [`skills/outbound-rollout-safety`](../skills/outbound-rollout-safety/SKILL.md)

## Invocation

```text
Review this nightly SMS job for rollout safety before we raise it from 20 to 200 a day.
```

```python
 1  leads = crm.search(tag="reactivate", limit=200)
 2  fresh = [l for l in leads if not in_cooldown(l, days=3)]
 3  if len(fresh) < 200:
 4      fresh += [l for l in leads if l not in fresh][: 200 - len(fresh)]
 5  body = []
 6  for l in fresh:
 7      body.append(render(l))
 8      crm.put_contact(l.id, tags=["texted-today"])
 9  resp = requests.post(SMS_URL, json={"to": [l.phone for l in fresh], "text": body})
10  resp.raise_for_status()
11  log(f"applied {len(fresh)}")
12
```

## Sample output

```text
BLOCKING
- Line 8 runs inside the loop that builds the payload, before the send on line 9.
  If line 9 fails, every lead is already marked "texted-today" and sits out the cooldown
  without ever getting a message. Blast radius = batch size x cooldown length, per failed run.
  Move the state write below a successful send.
- Lines 3-4 reach back into the cooldown to hit 200. That is the one limit the skill says
  never to relax. Under-fill or skip, and post a plain skip notice, for example:
  "skipped 2026-10-06, only 37 fresh, below floor 50... will retry next cycle"
- Line 8 is a PUT of the whole tag array. It deletes tags other systems own. Use add-tag.

HIGH
- No DRY_RUN flag. Ship one defaulted ON. It posts the would-be batch and applies nothing.
- 20 to 200 in one step. Scale in proven steps with a read-back of the records after each.
- Line 10 discards the provider's error body. Print resp.text before raising, so a length
  cap and a markup parse error can be told apart in the log.
- Line 11 logs a claim. Re-read the tagged records as a separate check.

MEDIUM
- A rerun on the same night would text the same people again. Count today's stamp and top up
  to the cap instead.
- Put retry for transient failures in the shared CRM client, and raise a named error when a
  401 persists across all attempts.
```

## What the example shows

The skill turns one rule into a mechanical audit: find the state write and the delivery call, and confirm which one runs first.
