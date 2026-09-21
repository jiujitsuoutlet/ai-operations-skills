---
name: ghl-email-send
description: Send an email campaign to a real list through GoHighLevel from Claude Code... wiring the GHL MCP, building the campaign, the schedule-time recipient law, the kill window, and the test-to-self gate. Use when drafting, building, scheduling, killing, or diagnosing any GHL email broadcast, newsletter, or blast, when staging the remote-email-send capability, when building an engaged/dormant audience for a send, or when an operator asks to "just paste copy and send it." Triggers on words like GoHighLevel, GHL, LeadConnector, email campaign, broadcast, newsletter, blast, send to the list, schedule campaign, delete campaign, kill window, Voice Test, test-to-self, engaged segment, engaged-60d, unsubscribe, CAN-SPAM, deliverability, hard bounce, spam complaint, send shell, email template, merge field, previewText, sendAt.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# GHL Email Send (campaign sending from Claude Code)

Extracted live from staging JJO's remote-email-send capability (2026-07-21/22),
through the first real campaign create, schedule, cancel, and test-to-self.
Pairs with [ghl-nurture-agent](../ghl-nurture-agent/SKILL.md) (different concern: CI-side REST lead nurture,
**not** an MCP precedent) and the account-specific wiring record
(private note, not included).

## The gates. These are the whole point.

- **Test-to-self first, always.** Route every send through a one-person list
  before it touches anyone else. No exceptions, including "it's just a small fix."
- **"The real list" means the engaged segment, never everyone.** A full-list send
  is a deliberate call the operator makes each time, never a default.
- **Never send immediately to a live list.** Minimum 15-minute buffer, because a
  scheduled campaign can be killed and an immediate one cannot.
- **Know what that floor is scoped to.** The 15-minute rule protects **live-list**
  sends. A one-recipient test to the operator's own inbox is expected to land
  "within minutes" and can legitimately be scheduled 3 to 5 out. Over-applying the
  rule is its own failure... it makes you look like you cannot read your own SOP.
- **If you are ever unsure whether an action sends real mail, STOP and ask.**

## The SEND LOOP (the operator's one-command pipeline)

"Write me a new email please" (or equivalent) fires this loop end to end. It is a
protocol, not an automation... gates 2, 4, and 5 are operator rulings mid-flow,
which is exactly why this cannot be a fire-and-forget script.

0. **TOPIC** ... propose the topic in ONE line and get a yes first. Skipping this
   is the single most expensive mistake in the loop (see "TOPIC selection is the
   real failure mode" below). Check the last two sends' core argument, not just
   their subjects, so the thesis does not repeat.
1. **DRAFT** ... run the voice pre-flight ([prompt-preflight](../prompt-preflight/SKILL.md) + its locked voice
   specs + the knowledge bank), draft **in chat**, nothing touches the CRM. Include
   the one-line voice assumption, one compact "confirm these decaying facts" line,
   and name any words that are the model's own.
2. **RED PEN** ... operator edits or approves the words.
3. **TEST** ... build the campaign, load approved copy verbatim, fire to the
   one-person Voice Test list by **literal contactId**. Minutes-out scheduling is
   legitimate for a party of one.
4. **READ** ... operator reads the delivered email as a subscriber (inbox
   placement, footer address, unsubscribe, links, layout). Anything off loops back
   to 1. These reps are the voice deltas.
5. **GO** ... explicit word only: fresh audience re-poll (index lag), the exact
   schedule payload shown as text, `scheduleType: "scheduled"` + sendAt 15+ minutes
   out or the operator's named time, kill window stated with the campaign id.
6. **SCORE** ... after fire: stats poll (`sent` vs your own tag count... the gap is
   platform-level suppression of prior unsubs/bounces, expect it), complaint rate
   against the 0.1% line, voice deltas and the decaying-facts log updated.

**The voice file already exists... do not create a second one.** The locked spec
is `prompt-preflight/references/voice-specs.md` (vault-symlinked). SOP step 9
deltas append there.

### The automated variant (JJO, live 2026-07-22)

A scheduled task (`jjo-email-voice-test`, Mon/Wed/Thu 10am) runs steps 1 and 3
unattended: drafts, fires the Voice Test to the operator's inbox, updates
a send-calendar file (private note, not included), reports the draft. **It is hard-blocked from
scheduling any live send.** The operator reads the test, brings edits back to
chat, and gives explicit permission per send.

**When the operator turns up mid-run, his instruction outranks the task's block**
(proven 2026-09-12). The scheduled task fired unattended, Paul read the test in
the same session, rewrote the email himself, and said "schedule this to send
Monday morning at 915am". That IS the explicit GO the SEND LOOP requires, and
the task's hard block exists to stop an *unattended* live send, not to refuse a
present operator.

Two conditions on that, both cheap:

- **Say out loud that the boundary is being crossed**, in one line, before doing
  it. Per [flag-conflicts](../flag-conflicts/SKILL.md): never silently obey, never silently refuse.
- **Do not skip the test just because he wrote the words.** Test-to-self exists
  to catch rendering, links, footer, and merge fields, none of which he can see
  in a chat paste. When the live send is days out there is time for both, so
  schedule the live send AND fire a test copy of the exact same HTML.

**On eventually removing the gate:** the operator's stated plan is to drop the
approval step once drafts are error-free. Be honest about what that does and does
not cover. Voice accuracy is learnable and will improve. **Fact accuracy is not a
voice problem and never becomes one.** A model cannot verify that a location is
still open, a member count is current, or an event happened as described... those
failures already occurred on this account (a closed academy and a stale community
count both shipped to the whole engaged segment). Perfect voice does not fix them.

If the gate is removed, remove it on evidence, not on vibe: N consecutive sends
with zero operator edits, counted. And prefer a **conditional gate** over none...
auto-send when a draft contains no unverified decaying facts, hold for approval
when it does. That keeps the speed and keeps the one check the model genuinely
cannot perform on its own.

## Prove the connection before touching anything

**Chat-app connectors are NOT Claude Code MCP.** An operator can have a CRM
connected app-side for months while Claude Code's `mcpServers` reads `(none)`.
The gap is invisible unless you check. Verify against the actual config
(`claude mcp list`), never against the operator's belief.

**Never substitute a different platform.** A cold-outreach tool may be connected
and may expose campaign and send operations. It is not a CRM substitute. Routing
a member list through a prospecting platform is the wrong system, risks its terms
of service, and torches sender reputation. Missing tooling is a STOP, not an
invitation to improvise. See [flag-conflicts](../flag-conflicts/SKILL.md).

## The architecture law: recipients attach at SCHEDULE time

This is the single most important mechanic, and it surprises every operator.

- `create-email-campaign` takes name, editorType, templateId/editorContent,
  timeZone, userId. **There is no audience field.** A created campaign is inert.
- `schedule-campaign` carries, in **one atomic call**: `recipients`, `emailMeta`
  (subject, fromName, fromEmail, previewText), `scheduleConfig.sendAt`, and
  `scheduleType`.

So "build it against the audience, then fire it later" is **not two steps**.
Pointing and firing are the same call. There is no state where a fully-addressed
campaign sits waiting to be inspected.

**The consequence that matters:** the schedule **payload text is the only
reviewable artifact that exists**. Showing it to the operator is not ceremony, it
is the review. The working loop:

1. Create the inert draft with content loaded.
2. `dryRun: true` the schedule call.
3. Show the operator the resolved payload **as text**.
4. Operator approves the payload itself.
5. Execute once.
6. Read the campaign back and confirm `status: scheduled`, **not** `sent`.

## scheduleType: the value that removes the kill window

Send `scheduleType: "scheduled"` with `scheduleConfig.sendAt`. Confirm GHL
resolved it to `campaignType: "schedule_later"`... that read-back is your proof it
is not an immediate send.

**Never send `"immediate"`.** It is the value in GHL's own documentation example,
and it is the one setting that makes a campaign unkillable.

`sendAt` format is `"YYYY-MM-DD hh:mm AM"`, interpreted in the supplied `timeZone`.

## recipients: both shapes, PINNED

```
test send  ... {"type": "contact", "contactIds": ["<id>"]}
live send  ... {"type": "tag",     "tagIds":     ["<tagId>"]}
```

`recipients.type` is an **enum**. `"filter"` is NOT a member despite the field
docs mentioning a filter. Tag targeting wants **tag IDs, not tag names**... fetch
them from `get-location-tags`.

**For any test send, use literal contactIds.** A payload carrying one ID is
*structurally incapable* of reaching a broad audience. That is a stronger
guarantee than a filter you believe is correct, and it costs nothing.

### How that shape got pinned, and the technique worth reusing

Nobody documents it. Guessing it for a live audience is unacceptable, and
`dryRun` cannot help (it never reaches the server). But **this API returns
descriptive validation errors, and validation runs before execution**. So:

1. Create a throwaway campaign.
2. Attempt to schedule it with a deliberately wrong value **and a `sendAt` months
   in the future**, so that even if the guess is *accepted* rather than rejected,
   the result is a scheduled campaign you delete rather than a send.
3. Read the error. `"recipients.type must be a valid enum value"` eliminated one
   guess; `"tagIds is required when recipients type is tag"` handed over the
   answer outright.
4. Delete the probe.

Three cheap calls replaced an 11-page fetch of every contact ID. **Let the
server document itself.** The same trick pinned `projection` (`"projection must
be an array"`, values are strings, so `["id"]`) which gives PII-free ID fetching.

The discarded alternative is worth naming: pulling every ID and passing them
explicitly is *exact*, but carrying a thousand opaque 20-character IDs through
model context and re-emitting them verbatim is its own error source. Prefer the
shape the server actually wants.

## Campaign status: `processing` vs `scheduled`

Tag-targeted sends land in **`processing`**, not `scheduled`. That is GHL
expanding the tag into a recipient list. Contact-ID sends skip it and go straight
to `scheduled`. `processing` is a legitimate state (the 409 text says "already
scheduled **or being processed**"), not an error.

**Correction, 2026-09-12:** a tag-targeted live send read back immediately as
`status: scheduled` / `campaignType: schedule_later`, NOT `processing`. So
`processing` is a state a tag send *can* pass through, not one it reliably lands
in. Do not treat either string as the check. The rule below is the actual test
and it did not change.

**Confirm nothing dispatched by reading `get-campaign-stats`, not the status
string.** `sent: 0 / accepted: 0 / delivered: 0` is the proof that a campaign in
an unfamiliar state has not fired.

**Untested and worth saying out loud:** whether `delete-campaign` succeeds while
status is `processing`. Deleting from `scheduled` is proven. The only way to test
the `processing` path is to destroy a real send, so tell the operator plainly that
the kill window is unverified in that state and to decide early rather than at the
last minute.

## You cannot know the recipient count before it fires

No API surface reports a campaign's resolved audience size pre-send. You can
count the tag yourself and verify the tag ID, but that is *your* measurement, not
the platform's. **`sent` in the post-send stats is the first number GHL ever
confirms.** Say which is which rather than implying the platform agreed with you.

## Campaign lifecycle facts

- `delete-campaign` on a scheduled campaign sets status to **`cancelled`**. The
  record survives; the send does not. That is the kill switch.
- **`deleted: true` is the API acknowledging the request, NOT proof the send was
  stopped.** Learned the hard way 2026-09-12: a test scheduled for 5:45 PM was
  killed at what looked like 5:44, the call returned `{"deleted": true, ...}`
  with a 200, and the read-back said **`status: sent`**. It had already fired.
  Nothing in the delete response says so. **Always read the campaign back after a
  delete and confirm `cancelled`**, then report what actually happened rather
  than what the delete call implied. Saying "killed it before it fired" off a
  success response is a false claim.
- **Leave real room in a test's send time.** A 10-minute buffer is fine when
  nothing changes, and far too tight when the operator is actively reading the
  draft in chat. If a correction can plausibly arrive mid-flight, schedule the
  test 20 to 30 minutes out. A test that fires during the conversation that was
  about to replace it wastes the read and confuses the review.
- **You cannot reschedule a scheduled campaign.** `schedule-campaign` requires
  `draft`, `cancelled`, or `paused`, and returns a clean `409` otherwise. To move
  a send time: delete, recreate, reschedule. Do the delete and create together so
  nothing can double-fire.
- **Content is never inline.** Templates and campaigns return an
  `editorContentUrl`. To know what an email actually says, fetch that URL. Names
  and metadata will not tell you.
- `userId` is required by both create and schedule. `users.readonly` is often
  absent from a Private Integration Token (a clean `401`), so get the ID from the
  GHL UI (Settings > My Staff, read the profile URL) and confirm it with the
  operator.

## Parameter shapes that cost a retry each (pinned 2026-09-12)

Small, undocumented, and each one burned a call. Pinning them here so the next
session does not rediscover them.

- **`list-email-campaigns` caps `limit` at 20.** Anything higher returns a clean
  `422`: `"limit must not be greater than 20"`.
- **`get-campaign-stats` does NOT take a campaign id.** It takes two path
  params, and both are easy to get wrong:
  - `source` must be the **plural** collection name, `"email-campaigns"`. The
    singular `"email-campaign"` (which is what every campaign record's own
    `source` field says) returns `422`: *"Value must be: email-campaigns,
    workflow-campaigns, or bulk-actions"*.
  - `sourceId` is the campaign's **`sourceId`**, not its `id`. A schedule call
    returns a fresh `sourceId`; use that one.
  - So: `{"source": "email-campaigns", "sourceId": "<sourceId from schedule>"}`.
- **`search-contacts-advanced` counts a tag cheaply** with
  `{"filters":[{"field":"tags","operator":"eq","value":"<tag name>"}],
  "pageLimit":1, "projection":["id"]}`. Read `total`, ignore the one returned
  record. Tag **name** works here even though `schedule-campaign` wants the tag
  **ID**. Keep it count-only, per the PII rule below.

## Audience: email engagement is NOT queryable over the API

Verified by three independent probes. Do not re-litigate this from scratch:

1. No operations exist for email opens, clicks, tracking, or delivery events.
2. `get-campaign-stats` is **aggregate only**... counts and rates, no recipient list.
3. The contact search payload has **no engagement fields**.

**The one-line version: stats will tell you N people opened. Nothing will tell
you which N.**

So an "opened or clicked in 60 days" audience cannot be computed from the API.
It must be:

- **Built in the CRM UI** as a smart list, then bulk-tagged, so the API can target
  the tag. This is the only route that can look **backward** over existing history.
- **Maintained by a workflow** triggered on email open/click that stamps the same
  tag. A workflow **cannot look backward**... it fills only from the day it is
  built, which is why the UI build runs first.

Beware the tempting third option: building a proxy audience from queryable tags.
On a real account, contacts who had opened within days were still tagged `cold`
and `not engaged`. **Stale classification tags are not an engagement signal**, and
a proxy built on them silently excludes engaged people while claiming to include
them. Do not redefine "engaged" into something weaker without the operator
explicitly choosing that trade.

Rolling windows are also awkward: a wait-then-remove workflow cannot reset its
timer on re-engagement, so it drifts toward a smaller, fresher list. Say that out
loud rather than implying the tag self-maintains perfectly.

## Verification laws (portable beyond GHL)

- **Validate the instrument before you trust a zero.** A malformed filter returns
  `0` identically to a genuinely empty set. Before reporting "the tag is empty,"
  run the same query shape against something known-populated. If the control
  returns a real number, the zero is real. If not, your probe is broken. This is
  [measure-before-build](../measure-before-build/SKILL.md) applied to a filter.
- **The contact search index LAGS writes.** A tag confirmed by a `201` can read
  back as `0` through search for some time. Verify writes with a **direct record
  read**, never with search. The same lag means an audience tagged and immediately
  targeted may be seen stale at send time, so **re-poll audience counts fresh at
  build time**.
- **Names are not identifiers.** Two templates carried the same name and different
  bodies... one held the wrong email plus an unedited "Insert your text here"
  placeholder. Verify a template by its body content or by matching a known sent
  campaign, never by its name in a dropdown.
- **`dryRun` is a shape check, not an acceptance check.** It resolves the request
  without calling the server, so it proves the payload assembles and proves
  nothing about whether the server accepts an enum value.
- **Prefer additive tag endpoints.** `update-contact` is a PUT whose `tags` field
  overwrites everything. Use add-tags / remove-tags.
- **When an operator says a change landed, check the timestamp.** Twice in one
  build the operator reported work as done ("template's perfected", "sender info
  is fixed") when `updatedAt` was byte-identical to the reading from before the
  claim, and the record still carried stock placeholder text. They were not being
  careless... edits silently fail to save, and people verify a preview rather than
  a commit. Read `updatedAt` and the actual field, report the mismatch plainly,
  and name what you *cannot* see (settings the API does not expose) instead of
  implying you checked everything.
- **`fromName` in `emailMeta` does not control the displayed sender name.** It was
  set correctly on a send that still arrived showing a different name. Before
  chasing it in the payload, rule out the two real causes: the mailbox / sending
  identity configured in the CRM, and the recipient's own address book (Gmail
  overrides the display name for known contacts, which is cosmetic and affects
  only that one reader). The `From:` header in "Show original" distinguishes them
  in seconds.

## Copy discipline

The operator supplies the words. Your job is to not corrupt them and not invent
any. See [prompt-preflight](../prompt-preflight/SKILL.md).

- **Load copy verbatim.** Escape `&` and quotes correctly, preserve the operator's
  own punctuation quirks (curly/straight quote mixes, doubled `??`, ellipses), and
  do not silently tidy them. Flag typographic oddities as observations for the
  test read, not as edits you already made.
- **PROVE it is verbatim, do not eyeball it.** Hand-transcribing a pasted email
  into HTML paragraphs is exactly where a four-dot chain quietly becomes three,
  a curly quote gets normalized, or "its" gets corrected to "it's". Write his
  paste to a plain-text file, strip the tags back out of your HTML, and `diff`
  the two. It takes one command and it converts "I was careful" into evidence.
  Worked 2026-09-12: byte-identical on the first try, including a five-dot
  chain and a curly-open/straight-close quote pair that any tidy-up would have
  eaten. **Do not "fix" his hyphens either**... he writes both "Jiu Jitsu
  Outlet" and "Jiu-Jitsu Outlet" in the same email. The no-hyphen standard binds
  the SENDER NAME, not his prose.
- **Formatting rules may still apply on top of verbatim copy, and say when they
  do.** The super-signature CTA is bold on every send, so bolding a line he
  pasted unbolded is correct. Wording untouched, formatting applied, and the
  change named in the report so he can overrule it.
- **Verify any URL he supplies actually resolves** before it ships to the list.
  One `curl` for the status code. A dead link in the primary CTA is worse than
  no link.
- **Never fabricate a checkable fact.** Dates, names, events, "this last Monday,"
  attendance figures, prices. Ask, or leave it out. When an operator pre-confirms
  a fact unprompted, that is the behavior to reinforce.
- **Reply-only is the safe default CTA** when no offer, link, or booking flow was
  supplied. Never manufacture one.
- **Name the words that are yours.** If you wrote the preview text because the
  operator only gave a subject, say so explicitly before it sends.
- **Check audience-vs-framing.** "Win-back" copy assumes prior membership. Sample
  the actual audience first... an engaged segment is often mostly leads who never
  started, and copy that assumes they trained will land wrong on hundreds of
  people. Widen the framing or narrow the segment, and tell the operator which you
  did.
- Verify before sending: merge fields present and correctly spelled, link count
  matches what the operator described (an item with no URL is not a link), and the
  unsubscribe anchor survived.

### Copy carries DECAYING FACTS. Re-confirm them every send.

The most dangerous words in a reused email are the ones that were true last time.
On a real send these three slipped through into every inbox in the segment:

- **A location list naming a since-closed academy.**
- **A community size** ("over [N]") that had grown since the copy was written.
- A relative date ("this last Monday") that only survived because the operator
  volunteered a confirmation unprompted.

Before any send, re-verify anything that can rot: locations and hours, follower
and member counts, staff and coach names, prices, event dates, "recently" and
"last week" phrasing. **Ask the operator to confirm each one rather than assuming
last send's version still holds.** A closed location advertised to a live list
generates real confusion and real replies.

### ASK THE CATALOG QUESTION before drafting a CTA

The model cannot know what the operator has already made. On one email the
draft closed with a generic come-train invite; the operator replaced it with a
real podcast episode featuring a named friend, on exactly that topic, with a
link. **That swap was the single biggest improvement to the email**, and nothing
in any voice profile could have produced it.

So at the topic gate, ask: *is there a real asset for this... an episode, a
video, an event, a post?* A heavy or personal topic converts to "go deeper"
better than "book now", and the booking ask still lives in the super signature
either way. Generic CTAs are the default only when no real asset exists.

### Voice converges FAST when the operator corrects with reasoning

Two rounds of line-by-line rewrites, each with a stated *why*, took draft survival
from roughly 20% to roughly 80% in a week. That mechanism beat every statistic
inferred from the archive, because the operator states rules the numbers cannot
see ("that reads robotic", "use the series' own word").

Practical consequence: **ask for corrections in that format** (their line, your
line, the reason) rather than a general "make it sound more like me", and fold
each round into the profile immediately. Also expect the failure mode to migrate
once voice lands... on this account it moved to topic selection within days.

### Structural placement is the operator's call, not the default

Where a CTA block sits is a decision, not a convention. On this build the
three-CTA "super signature" is a **standing block that appears on every send**,
and the operator wants it **first**, not trailing after the sign-off. Confirm
placement rather than inheriting whatever the previous email did.

## The real ceiling: the model does not know the operator's life

Voice converged in about a week. Topic selection improved with a gate. What does
NOT improve on its own is **biographical fact**, because it is not a skill
problem... the model has no access to a life it did not live.

The operator named it exactly: *"take your best shot and seek to get better every
iteration... you simply don't know my real life though."*

So do both. **Always draft at full effort** (a deliberately weak draft teaches
nothing and wastes the rep), and attack the actual bottleneck separately with a
**life file**... a sourced ledger of real detail the operator has written himself.

**Mine every operator rewrite for facts.** Their rewrites are the highest-yield
source of real material in the system, and the only place their actual life
reliably enters the record. One rewrite yielded a coach's name and country, two
named training partners, a specific illegal technique, a weight-loss figure with
a time window, and a move to another state. None of it was inferable.

Sourcing rule, strict: **every entry names the email it came from, and a detail
without a source does not exist.** The trap is a model-invented detail from a
rejected draft laundering itself into the ledger and returning later as "fact."
Quarantine anything unconfirmed under an explicit "ask before using" heading.

For JJO the file is a private life file (private note, not included).

### The corpus may be going somewhere

The operator's stated long game is that these emails become a book of his life's
work. That changes how the archive is treated: sends are accumulating chapters,
not disposable campaigns. Preserve story detail, keep the corpus dated and
intact, and never smooth a personal specific into cleaner generic phrasing.

## TOPIC selection is the real failure mode, not voice

Hard-won 2026-07-24. On the first day of running this loop, the operator gave
line-by-line voice corrections in a Google Doc, and the very next draft rebuilt
from them **passed on the first read**. Voice is learnable and it learned fast.

Then **three consecutive drafts were rejected... every one of them on TOPIC, not
on writing.** An anger email, a composure-under-pressure email, and a
general-about-the-art email. The operator finally said "I'm going to just write
one for you."

**The lesson: do not draft-and-hope on topic.** A rejected draft costs a build, a
test send, and operator patience, and the writing was never the problem.

**Propose the topic in one line and get a yes BEFORE building anything.** Cheap,
fast, and it puts the one judgment the model is worst at back where it belongs.

Related trap to watch: **thesis repetition across consecutive sends.** Three
emails in five days all argued "energy needs an outlet" from different angles.
The operator ruled a recurring *brand refrain* is fine, but the same *argument*
three sends running is not. Check the last two sends' core claim, not just their
subject line.

### The topic can be RIGHT and the frame still wrong (2026-09-12)

The gate above catches a wrong subject. It does not catch a right subject
answered against the wrong fear.

A draft picked the beginner-hesitation topic, and Paul kept the topic. It then
answered **"I would get hurt"**, a physical-risk objection reasoned out from
first principles, with an entire memoir spine built to serve it (learning
breakfalls, years of being thrown, the worst injury happening off the mats).

His rewrite kept the topic, kept roughly 40% of the sentences, and **replaced the
objection outright**:

> "I probably couldn't hang with you all and would slow down the group!"

That is a SOCIAL fear, not a physical one. They are not afraid of the mat, they
are afraid of the room. No amount of archive analysis produces that, because it
is something he hears in person and the model never will.

Note exactly what survived: *"The NUMBER ONE thing I hear from adults who are
thinking about training is some version of..."* went through untouched, and the
quote inside it was swapped. **The frame was right and the content inside it was
invented.** A confident scaffold wrapped around a guessed fact is the most
dangerous shape a draft can take, because it reads as reported experience rather
than as the assertion it is.

**So extend the topic gate into an OBJECTION gate.** Propose in one line:

> Topic X, answering the objection "&lt;exact words&gt;". Is that the one you actually hear?

Cheap to redirect, and it targets an input the model structurally cannot supply.
Same class as the catalog question... ask, do not infer.

### His hardship stories exist to explain the BUSINESS

Same rewrite, and this is the bigger structural lesson.

The draft used the bad old Judo room as texture, then pivoted to generic
reassurance ("at a beginner friendly school, like our academy..."). Paul rebuilt
the hinge:

> **This is why we created Jiu-Jitsu Outlet!**
> When I opened my school, I wanted to change the game for martial arts academies.
> Instead of a "survival of the fittest" environment, I wanted to make one that is built FOR beginners.

The hardship is not a lesson about perseverance. It is the **origin of the
product**. He was in a room that made people quit, so he built the opposite room.

That structure is available on most of his chapters and the model keeps missing
it. Before drafting a memoir, ask: **does this chapter explain something about
how the academy is run today?** If it does, that is the turn, and it beats any
lesson you can extract from the story on its own.

Related move in the same rewrite: he **dramatized the bad room instead of
describing the good one**. The draft explained what a beginner-friendly academy
does. His version made you feel the other place... *"everyone is waiting for you
to say 'I quit!' ... and then they're gonna laugh at you behind your back because
you 'Couldn't hang'."* Name the bad experience vividly first, and the contrast
does the selling.

### He STRIPS names when the story criticizes

The profile says named specifics are the texture. True, and this rewrite adds the
exception.

The draft named his first Judo coach, correctly sourced from the life file. His
version wrote **"[a former coach from his first club]"** and then just "Coach",
because the email goes on to say that club drove new people away and nobody cared
whether they stayed. He kept every vivid detail of what the man did and removed
the identity.

**Rule: when a story is critical of a real person or school, keep the specifics
and drop the name.** Names are texture in praise and a liability in criticism.

### A story beat is not reusable just because he wrote it once

A distinctive injury story is his, in his own copy, sourced in the life file.
It was offered in two consecutive drafts, once as an ironic punchline and once
softened into an aside. **He cut it both times, without comment.**

Mining rewrites for FACTS is correct and stays. But a distinctive story beat
already spent in a previous send reads as a repeat even inside a new argument.
Ask before re-running one, or save it for a chapter that needs it.

### Score a rewrite on two axes, not one

"He kept most of my sentences" is a misleading way to read a rewrite. Score both:

- **line survival** ... how much of the prose stood (here, ~40%)
- **thesis survival** ... whether the argument stood (here, 0%)

High line survival with zero thesis survival means **voice is fine and judgment
missed**, which aims the next iteration at the topic, objection, and frame gates
rather than at the writing. Reporting only the first number would have flattered
the draft and taught nothing.

A rewrite like this does NOT count toward the zero-edit tally in the
gate-removal rule. That count stays at 1.

## The subject formula, validated PROSPECTIVELY (2026-07-24/27)

The archive said emotional stake was the only subject feature that survived
controls (+7.3 pts). Three consecutive live sends to the same segment then tested
it forward, which is much stronger evidence than the retrospective finding:

| Send | Subject | Formula? | Open (rank) |
|---|---|---|---|
| 2026-07-22 2pm | [an affiliation-announcement subject] | no stake, no formula | **3rd, about 20 points under the others** |
| 2026-07-24 6am | [memoir subject: How Jiu-Jitsu (verb) (personal outcome)] | `How Jiu-Jitsu [verb] [outcome]` | **1st** |
| 2026-07-27 9am | [memoir subject: How Jiu-Jitsu became (personal outcome)] | same formula | **2nd, under a point behind 1st** |

**More than double, same audience, same week.** Zero complaints on all three. Use
the formula. A subject naming an org, a partner, or an event without a personal
outcome is the shape that underperforms.

Two more patterns from the same run:

- **Serialize.** Both formula sends were part of a running personal thread, and the
  second opened by explicitly calling back to the first. A series gives the reader
  a reason to open the next one.
- **Mine the dead-data era for topics.** On this account everything before
  2024-04 has unusable stats, so strong subjects from that era were never fairly
  tested. "[memoir subject: How BJJ helps (personal outcome)]" was a 2023 subject; re-running it on a clean list is
  a free at-bat, not a repeat.

### RESOLVED 2026-08-26: the operator's instinct won, decisively

The section below was written when his confessional subjects were losing to the
formula. **Then "I'm a loser" took the top open rate... the best
send in the account's clean history, beating the formula's best by 21 points.**

| Subject | Form | Open (rank) |
|---|---|---|
| **I'm a loser** | teaching + objection turn | **1st, about 21 points above the formula's best** |
| [memoir subject: How Jiu-Jitsu (verb) (personal outcome)] | memoir | 2nd (the formula's best) |
| [memoir subject: How Jiu-Jitsu became (personal outcome)] | memoir | 3rd, under a point behind 2nd |
| [memoir subject: How Jiu Jitsu helps (personal outcome)] | memoir | 4th, about 2 points behind 2nd |
| I was the worst... | memoir | 5th, about 10 points behind 2nd |
| [an affiliation-announcement subject] | memoir, no formula | 6th, about 20 points behind 2nd |

Two conclusions, and both correct earlier entries in this skill:

1. **Short blunt first-person confession is a winning subject shape on this
   list**, not a concession to be tracked. Treat it as a peer of the
   `How Jiu-Jitsu [verb] [outcome]` formula, and reach for it when the email has
   a genuine admission at its center.
2. **The form mattered more than the subject.** The winner was the FIRST
   non-memoir email... teaching plus the objection turn. Four memoirs preceded it
   in a band well below it. This is hard evidence for the rotate-the-form rule
   above, not just an aesthetic preference.

One cost worth watching: it also drew the highest unsubscribe rate on record,
with zero complaints. A provocative subject pulls in readers
who then self-select out. That is healthy list hygiene, not damage, but track it.

**The general lesson: the operator's instinct is a hypothesis worth testing, and
keeping honest score is what settles it.** Arguing would have cost the best email
in the account's history.

### Original entry, retained for the record



Two consecutive operator-written subjects abandoned the winning formula for a
short first-person confession: **"I was the worst..."** and **"I quit Jiu Jitsu"**.
The first scored roughly 9 points under the three formula subjects on the
same list.

That is one data point, not a verdict, and the second one is a stronger line. Do
not lecture the operator about it... **build what they wrote, then score it
honestly and show the comparison.** If confessional subjects keep landing under
the formula across several sends, that becomes a real finding worth raising once,
with numbers. If they catch up, the formula was never the whole story.

The general rule: **the operator's instinct is data, not noise.** Their subject
choices are a live experiment running alongside yours, and the archive only got
useful because someone kept score rather than arguing.

### Do NOT read the send-time rotation yet

The Mon/Wed/Fri x 6am/9am/3pm/6pm rotation is a deliberate crossed design that
needs ~12 sends to cover every cell once, and several cycles to mean anything.
Early numbers (6am vs 9am) are **0.85 points apart and confounded by
day, subject, and audience drift**. Declaring a winning send time off two points
would be exactly the mistake this account has made before. Log delivered-count
with every send, compare only within size bands, and wait.

## A corrected fact is not corrected until every TEMPLATE carrying it is fixed

Houston academy closed. The operator corrected it on 2026-07-22 after it shipped
live. It was fixed in the voice specs, the account record, the life file, and the
scheduled task.

**Five weeks later he pasted an email whose PS block still said [the location list,
still naming the closed location].** He had copied it from an older template he keeps
around. The corrected fact never reached the artifact he actually writes from.

Two rules from that:

- **Re-verify the standing blocks on EVERY send**, even when the operator pasted
  them himself. A super signature, footer, or boilerplate section is exactly
  where a killed fact hides, because nobody re-reads it. Diff it against the
  current standard rather than trusting the paste.
- **When a fact is corrected, ask where the operator copies from** and get that
  source fixed too. Otherwise the correction is cosmetic and the error keeps
  re-entering through the back door, once per template that still carries it.

Related: stale blocks also carry stale COUNTS. The same paste carried an old
community count that had been corrected upward a month earlier.

## Event and announcement emails are an under-used form

The account's #2 all-time performer was an announcement (new mats arriving),
not an essay. Timely news with a real date and a real reason to act
carries its own urgency and needs no persuasion architecture.

When the operator mentions anything happening... an event, a visiting guest, a
new program, a deadline... **that is a send, and it outranks whatever essay was
queued.** Ask what is coming up rather than waiting to be told.

## Segment hygiene: an auto-tagged engaged segment WILL rot

The workflow that tags contacts on email open cannot tell a human from a bot.
Observed 2026-07-24, one day after building the segment: the tag count
jumped overnight, and a sampled contact was
a spam record posing as a delivery brand, auto-tagged "engaged"
because something on the other end opened the message.

**Left alone this quietly fills the best-performing segment with junk**, which is
the exact opposite of what the segment exists for, and it drags deliverability
down on a warming domain.

Standing maintenance:

- Sample the segment periodically, do not just read its count. A growing number
  is not the same as a healthy list.
- Exclude the known-bad tags (`bounced`, `hygiene-suppressed`, `spam-delete-final`,
  `no contact info`) when the audience is built, not after.
- Treat a sudden jump in segment size as a **signal to inspect**, not a win.

## Supersede by DELETE, not by leaving both alive

When a draft is replaced or rejected, delete the pending test campaign
immediately rather than letting it fire. Two tests landing for the same slot
makes the operator's review ambiguous and wastes the read. `delete-campaign` on a
scheduled campaign is instant and reversible in effect (a new one is cheap to
build), so there is no reason to leave a superseded send armed.

Same rule in the calendar: give an entry an explicit `operator-authoring` status
when the operator takes a send back. Automation must skip it rather than draft a
competing version.

**But skip must never mean silent.** The first operator-authored slot ran to 16
hours before fire time with no copy, no schedule, and no warning... the automation
dutifully reported "nothing to do" while the slot headed for empty. A hand-back
has no deadline attached, so the system must supply one: every run sweeps
upcoming slots FIRST and reports an operator-authored slot with nothing scheduled
as OVERDUE, loudly, before doing anything else. A state that stops the machine
must also start a countdown.

## Operating the automation: two traps that bite

### Local scheduled tasks only run while the app is open

A missed run does not fire on time... it fires whenever the app next opens. One
Monday-morning run landed 37 hours late, on Tuesday night. It cannot be moved to
a cloud routine when the task reads local vault files.

Two mitigations, both required. Tell the operator plainly that runs need the app
open on send days. And make every run **sweep upcoming slots first**, so a late
run still surfaces everything overdue the moment it does fire... lateness then
costs lead time, not the send itself.

### Verify the git branch before committing to a shared vault

Another agent left the vault checked out on its own feature branch. A calendar
commit landed there instead of `main`, invisible to everyone.

Recovery that worked without disturbing the other lane: confirm the stray file is
not tracked on `main`, `checkout main`, `pull --rebase --autostash`, cherry-pick
the commit, push, then restore the other branch to its exact prior tip with
`--force-with-lease` pinned to the SHA you added. Leave untracked files alone.

**Cheaper than recovering: check `git branch --show-current` before the first
commit of any session that writes to a shared repo.** See [parallel-claude-lanes](../parallel-claude-lanes/SKILL.md).

## An essay is not an invitation. Every send must ask someone in.

The single biggest gap found in a model draft, and it was structural rather
than stylistic. The draft made a genuinely good argument and then **ended on the
idea**. The operator's rewrite kept the whole argument and appended the half that
does the business work:

1. **Name the objection** that actually stops someone acting. Not the noble
   version... the real one. ("They are so afraid of looking like the new person
   that they never get started.")
2. **Answer it with concrete reassurance about the operator's actual room.**
   Other beginners are present. The instructor expects you to be lost.
3. **Name the business inline in the body**, not only in the signature.
   ("at a beginner friendly Jiu Jitsu school (like our academy Jiu Jitsu Outlet)")
4. **Close on plain second-person encouragement plus a benefit**, never a clever
   aphorism.

**A draft that stops at insight has done half the job.** Philosophy earns the
open; the objection-turn earns the reply. Check every draft for it before
handing it over.

## Check the story SHAPE, not just the thesis

The topic gate says do not repeat a thesis in consecutive sends. That is
necessary and **not sufficient.** A draft was produced whose thesis was genuinely
new (access to training, rather than perseverance) and the operator immediately
called it "exactly like our last email"... because it reused the same **story
shape and the same source material**: hardship stretch, comeback, lesson, drawn
from the same chapter of his life.

Before drafting, list the last 3 to 5 sends and check ALL of:

- core argument
- **narrative shape** (personal-memoir-with-lesson, teaching, news, question)
- **which chapter of the life file it draws on**

If the last several are all first-person memoir, the next one should not be...
regardless of how different its lesson is. Rotate the FORM, not only the topic.
Teaching, present-tense news, and a direct question to the list were all still
unused after five memoir sends. On this account the second-best performer of all
time was a news announcement, not a story.

## When a number is not known, CUT the claim

Established practice was to invent a plausible figure and flag it as an estimate.
The operator does not correct those... **he deletes them**, from body and preview
both. Flagging does not make an invented number acceptable, it just moves the
cleanup onto him.

Rule: if a quantity is not in the life file or supplied by the operator, rewrite
the sentence so it does not need one.

## The operator's subject voice may diverge from the winning formula. Track, do not argue.

Three consecutive operator-written subjects abandoned the validated
`How Jiu-Jitsu [verb] [outcome]` formula for short blunt first-person
confessions: **"I was the worst..."**, **"I quit Jiu Jitsu"**, **"I'm a loser"**.

That is a deliberate voice, not three exceptions. Keep offering the formula as
the default, build what he writes without comment, and **keep score honestly**.
Raise it once, with numbers, only if a real gap persists across several sends.
The archive only became useful because someone kept score instead of arguing.

## Automation: select the NEXT UNFILLED slot, never an exact date

A scheduled drafting task keyed its target on `test_date == today`. Runs happen
on a fixed cadence; slots have a fixed lead time. **The moment one run does not
fire, the slot it owned becomes permanently unreachable**, because no future run
will ever match that past date again. This silently orphaned two sends before it
was caught, and a first patch missed it because the added sweep only looked for
slots the operator had claimed.

Correct design:

- **Select** the earliest slot at-or-after today with nothing built. Never filter
  on a lead-time date... treat that field as advisory only.
- **Reconcile** past slots against the live platform on every run (sent, or
  missed) so state stays honest.
- **Sweep** every slot inside 48 hours with nothing built and report it FIRST,
  before any drafting, however the run turns out.
- A late run must still be able to pick up orphaned work.

**General law: any scheduler that pairs a fixed cadence with a fixed lead time
must select by "what is unfilled", not by "what matches today".**

## Durable notes need a fallback write path

Mid-session the vault became unreadable to this process... `com.apple.macl`
extended attributes, then every file returning "Operation not permitted",
including git. The knowledge from that session had nowhere to land.

- Keep a **fallback location outside the knowledge repo** (a Downloads or
  scratch path) and write pending-merge files there rather than losing the
  lesson.
- **Commit knowledge immediately after writing it.** Uncommitted work in a
  shared vault does not survive... a parallel Claude surface lost a full set of
  voice-spec additions the same week, and git history showed the edits were never
  committed at all.
- On macOS, expect `Operation not permitted` on Desktop-resident repos. The fix
  is the operator's: System Settings, Privacy and Security, Full Disk Access.

## What to read when the test lands

This checklist is what makes the test worth sending:

1. **Where it landed** ... Primary, Promotions, or Spam. Only a real off-domain
   inbox tells you this, which is why the test address should not be the sending
   domain.
2. **The physical mailing address** in the delivered footer (CAN-SPAM). It often
   lives on the CRM's location record and gets injected at send, so it can be
   absent from the stored template and present in the real email. **Judge from
   what lands, never from the template.**
3. **Unsubscribe** present and actually resolving.
4. **Greeting merge field** rendering a real name.
5. Every link tappable on mobile, layout reflowing cleanly.
6. Brand-name spelling consistency... the sender name and `{{location.name}}` can
   disagree, since one is typed and one comes from CRM settings.

## Security

- The Private Integration Token lives in **local MCP config only**. Never a repo,
  never a vault, never chat. Adding it via CLI also leaves it in shell history.
- **Removing an MCP server does not revoke a token.** It stays live until deleted
  in the CRM. An unused valid credential is a standing liability.
- **Contact records carry heavy PII**... names, emails, phones, IP addresses, ad
  click identifiers. Keep contact work aggregate or count-only in conversation.
  Never dump records into chat, a log, or a vault.

## Related

[ghl-nurture-agent](../ghl-nurture-agent/SKILL.md) · [prompt-preflight](../prompt-preflight/SKILL.md) · [measure-before-build](../measure-before-build/SKILL.md) ·
[verify-before-asserting](../verify-before-asserting/SKILL.md) · [flag-conflicts](../flag-conflicts/SKILL.md) · [report-back](../report-back/SKILL.md) ·
[knowledge-bank](../knowledge-bank/SKILL.md)
