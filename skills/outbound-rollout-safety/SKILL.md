---
name: outbound-rollout-safety
description: Guardrails for shipping and scaling any automation that fires real outbound messages or side-effects (SMS, email, tags that trigger a drip, webhooks). How to stage a live rollout behind a flag, why a safety limit is never relaxed to hit a number, idempotency for reruns, ORDERING state writes after delivery succeeds (not inside the payload-assembly loop), delivery-channel failure surfaces (payload size caps, markup parse errors, swallowed error bodies), and putting resilience in the shared client with a loud fail on genuine auth failure. Use when taking a batched outbound action live, scaling its volume, adding a daily cap or cooldown, making a run safe to re-run, ordering a state write against a send, diagnosing a delivery 400, or hardening a scheduled job that keeps failing. Triggers on words like go live, live rollout, DRY_RUN, staged rollout, dry run, daily cap, cooldown, rate limit, anti-harassment, idempotency, rerun, top up not double, ordering, tag before send, state write, retry, resilience, fail loud, token error, message too long, 4096, chunking, parse_mode, blast, batched send, outbound.
---

# Outbound Rollout Safety (doctrine)

Portable guardrails for any automation whose output is a REAL side-effect on real
people... texts, emails, tags that trigger someone else's drip, outbound
webhooks. Extracted from the JJO reactivation tagger; applies to email sends and
any batched outbound. The project-specific mechanics live in the relevant skill
([ghl-nurture-agent](../ghl-nurture-agent/SKILL.md), [ghl-email-send](../ghl-email-send/SKILL.md)); this is the cross-project doctrine.

## Stage the rollout... never blast on day one

- **Ship behind a flag, defaulted OFF.** A `DRY_RUN` (or equivalent) that applies
  NOTHING and instead posts the would-be batch + funnel for review. Flip it live
  only after clean previews. The flag ships true; the operator flips it.
- **Scale volume in proven steps, not straight to full.** 10 → 35 → 50, not 0 →
  500. Each step is a bounded blast radius the operator can eyeball.
- **Write-landed proof at each step.** "Applied N" in a log is a CLAIM. Re-read
  the affected records from the source of truth and confirm the effect actually
  landed... a read-back is evidence, a log line is not. Do this as a separate
  check, not from the run's own output.
- **Prove the round-trip across real time** before trusting a steady-state rate.
  If there's a cooldown, hold volume steady for two cycles and watch records
  actually leave and re-enter the eligible pool before scaling.

## A safety limit is NOT negotiable to hit a number

The single most important rule. A cooldown, a rate cap, a per-person frequency
limit... these are anti-harassment / anti-spam guarantees, not tuning knobs to
relax when supply runs short.

- If the fresh pool can't fill the cap: **under-fill (partial batch) or skip the
  run entirely.** Never reach into the cooldown to reach the number.
- Set an explicit floor: below it, do NOTHING and post a plain skip notice
  ("skipped [date], only N fresh, below floor... will retry next cycle"). A
  scheduled job needs no retry code... the next run tries again, and by then more
  has aged out of the limit.
- The day partial/skip starts firing is not a failure... it's the system telling
  you the pool's true sustainable rate. Believe it.

## Make it safe to re-run (idempotency)

A rerun in the same window must TOP UP to the cap, never DOUBLE it.

- Stamp what you did this cycle (a dated marker on the record). Count existing
  stamps, subtract from the cap, act on the remainder. Rerun → fills to the cap,
  not 2x.
- Know your counting denominator. Counting stamps only within the current working
  set (which drifts run-to-run) approximates the cap and can overshoot by the
  drift. Count across the whole base if the cap must be exact... and say which
  you did.

## Don't burn state on a failed side-effect... and ORDER it correctly

If the outbound action fails, do NOT record the state that assumes it succeeded.
A failed text must not stamp the cooldown... else the person never got the
message AND is locked out of the next attempt. Retry once; on hard failure, log
it, report it, and leave the record eligible for next cycle. State follows the
effect, not the attempt.

**The ordering half of this rule is the one that actually bites.** It is not
enough to skip the state write on a known failure... the state write must come
AFTER the delivery succeeds, in program order. Interleaving state into the
assembly loop looks harmless and is not:

```python
# WRONG... state committed before the delivery is even attempted
for c in final:
    lines.append(render(c))
    mark_contacted(c)          # 30 cooldowns burned right here
send(  "\n".join(lines)  )     # raises -> nobody saw anything

# RIGHT... delivery first, state only on the far side of success
for c in final:
    lines.append(render(c))
send("\n".join(lines))         # raises -> nothing below runs
for c in final:
    mark_contacted(c)
```

Worked example (JJO call-list, 3 separate days): the tag loop ran inside the
message-assembly loop, so all 30 leads were tagged and cooldown-suppressed for
14 days BEFORE the send was attempted. The send then 400'd on a length limit.
Net: ~90 leads silently consumed across three days, each invisible to the
operator for two weeks, and each run still looked like "one failed run" in the
dashboard. The blast radius of a mis-ordered side-effect is
`batch_size x cooldown_length`, not one run.

Audit rule: for every automation, find the state write and the delivery call and
confirm which executes first. If the state write is inside the loop that BUILDS
the payload, it is wrong... move it below the send.

## The delivery channel is a failure surface too

Resilience work aimed at the data source does not protect the delivery leg. A
retry wrapped around the CRM client leaves the notification/send call completely
unguarded, and a delivery failure is exactly the one that strands committed
state (above). Specifically worth checking on any delivery channel:

- **Hard payload limits.** Telegram `sendMessage` caps at 4096 chars and returns
  a bare `400 Bad Request` past it. Chunk on line boundaries under the limit and
  post sequentially; let a failed chunk propagate so the caller does not commit
  state on a partial delivery.
- **Markup modes turn user data into a parse error.** `parse_mode: "Markdown"`
  (or HTML) plus unescaped `*` / `_` / `` ` `` arriving from CRM names or notes
  is the other common source of an identical `400`. Same symptom, different
  cause... don't assume length without checking.
- **The error body carries the reason, and most clients throw it away.**
  `raise_for_status()` surfaces the status and discards the server's
  explanation. Print the response body before raising or the log cannot tell you
  which of the two causes above fired.

## Resilience at the shared client, fail loud on the genuine

- **Put transient-retry in the single choke point, not a per-caller shim.** If
  every call goes through one client function, the retry belongs THERE so every
  caller inherits it. A shim wrapping the client from one module leaves other
  callers unprotected... that is exactly how one scheduled job spams failure
  emails while a sibling job (with the shim) runs clean. One resilience path.
- **Retry the transient, raise loud on the genuine.** Retry timeouts / 429 / 5xx
  / spurious auth blips with bounded attempts + backoff. But a failure that
  PERSISTS across all attempts is not transient... a 401 on every try is a
  dead/revoked token. Raise a clear, named error identifying it, so a real
  outage surfaces instead of hiding behind the retry. Never retry forever; never
  swallow.
- **Triage failures by bucket, not by email.** Pull the failed runs, grab the one
  decisive exception line each, group. It's usually ONE recurring class plus a
  few historic one-offs already fixed. Fix the class.

## Related

[ghl-nurture-agent](../ghl-nurture-agent/SKILL.md) (the GHL tagger these were extracted from) · [ghl-email-send](../ghl-email-send/SKILL.md)
(the other live-outbound surface) · [verify-before-asserting](../verify-before-asserting/SKILL.md) (the write-landed
read-back is this discipline applied to a side-effect) · [report-back](../report-back/SKILL.md) · the
commerce guardrail: money/message-adjacent actions are human-approved and logged.
