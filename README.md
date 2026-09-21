# AI Operations Skills

I’m Paul Tokgozoglu, a gym owner and marketing operations practitioner who turns recurring business problems into documented AI workflows. I define requirements, direct development with Claude Code and Codex, and test the results against real operations.

I run Jiu Jitsu Outlet, a martial-arts academy business. Through Mat Squad, I consult for martial arts businesses and brands on marketing operations, CRM, email, and funnels.

A skill provides reusable instructions, checks, and approval steps for an AI-assisted workflow. This repository holds 65 of mine. It mixes two kinds of work:
- **Workflows developed through actual operations:** HighLevel email campaigns, a lead-nurture agent, Meta ad builds, client platform audits and migrations, and the member app I am building for my academy.
- **Experimental skills:** designed and written down, but not proven in use.

Not every skill has been tested or deployed. Each catalog entry says what evidence exists.

## For hiring managers: start here

These five are the most relevant to client onboarding, implementation, customer success, and marketing operations. Each links to an **illustrative example**: synthetic data written from the skill's procedure, not a transcript of a real run.

### 1. [ghl-email-send](skills/ghl-email-send/SKILL.md): sending email campaigns in HighLevel safely
- **Business problem:** an AI-drafted email blast can reach the wrong people, go out with no way to stop it, or repeat a fact that is no longer true.
- **What it does:** a step-by-step send loop run from Claude Code:
  1. Agree on the topic.
  2. Draft in chat.
  3. The owner edits the draft.
  4. Send a test to the owner.
  5. Show the exact scheduling request as text for approval.
  6. Schedule with time to cancel before sending.
  7. Score the result.
- **My contribution:** I ran the live campaigns it came from, set the approval gates, and supplied the rewrites and rulings it records. Claude Code drafted the text.
- **Example:** [examples/ghl-email-send.md](examples/ghl-email-send.md)
- **Evidence:** the skill documents live HighLevel campaign creates, schedules, cancellations, and test sends from July 2026 on. My local Claude Code logs show it loaded through the Skill tool in 20 sessions (2026-07-23 to 2026-09-17).
- **Not verified:** one path the skill itself calls untested (cancelling while HighLevel shows a campaign as "processing"). Nothing was re-run for this portfolio.

### 2. [ghl-nurture-agent](skills/ghl-nurture-agent/SKILL.md): a daily call and text list from HighLevel
- **Business problem:** a daily outreach list built from a large CRM has to skip paying members and Do-Not-Contact records, avoid contacting anyone too often, and survive API errors.
- **What it does:** builds and runs a scheduled agent:
  - It pulls leads from pipelines and tags, filters them, ranks them with Claude, and posts a call list to Telegram.
  - A companion tagger marks leads so HighLevel workflows send the texts.
  - It rolls out behind a dry-run switch.
- **My contribution:** I specified the agent and its safety rules, confirmed which tags mean "member", and ran the rollout. Claude Code wrote the code and drafted the playbook.
- **Code:** the implementation is public at [jiujitsuoutlet/JJO-Nurture](https://github.com/jiujitsuoutlet/JJO-Nurture): the call list is `main.py` and the tagger is `reactivate.py`.
- **Example:** [examples/ghl-nurture-agent.md](examples/ghl-nurture-agent.md)
- **Evidence:** the skill records a staged rollout (10, then 35, then 50 contacts), with a check of the CRM after each step and intake checked against a full CSV export. The implementation repo has scheduled GitHub Actions workflows.
- **Not verified:** this portfolio does not certify current run results; that repo's Actions history is the record. One known-open item: escaping Markdown in Telegram messages.

### 3. [outbound-rollout-safety](skills/outbound-rollout-safety/SKILL.md): guardrails for automations that message real people
- **Business problem:** automations that text or email people fail in ways that contact someone twice, or quietly skip a lead for weeks.
- **What it does:** a checklist for any outbound automation:
  - Ship with a dry-run switch and scale in small steps.
  - Never loosen a frequency limit to hit a quota.
  - Make reruns safe.
  - Record "contacted" only after the send succeeds.
- **My contribution:** I set the rules while building my reactivation tagger. The ordering rule came from an incident in my call-list agent. Claude Code drafted the text.
- **Example:** [examples/outbound-rollout-safety.md](examples/outbound-rollout-safety.md)
- **Evidence:** one documented production incident: a message-length error hit after the "contacted" state had already been written. The dry-run switch, the minimum pool size, and the cooldown are all visible in the public tagger (`reactivate.py` in JJO-Nurture).
- **Not verified:** no automated tests ship with the skill.

### 4. [matsquad-email-rebuild](skills/matsquad-email-rebuild/SKILL.md): moving a client's email and SMS to a new platform
- **Business problem:** a migration can wreck a new sending domain and leave the client stuck in an account an agency owns.
- **What it does:** a migration plan:
  - Save the engagement data first.
  - Sort contacts into four groups.
  - Run a "still want these?" campaign from the old platform.
  - Set up a separate sending subdomain and DMARC, then ramp volume gradually.
  - Keep the account in the client's name.
- **My contribution:** my consulting method, sequenced on a real client migration (client details removed). Claude Code drafted the text.
- **Example:** [examples/matsquad-email-rebuild.md](examples/matsquad-email-rebuild.md)
- **Evidence:** the skill states it was sequenced on a 2026-08 client engagement.
- **Not verified:** no post-migration deliverability results are recorded. My local Claude Code logs show no Skill-tool load of it.

### 5. [matsquad-backend-map](skills/matsquad-backend-map/SKILL.md): day-one audit of a client's platform
- **Business problem:** on day one with a new client, dashboards disagree and the client's memory of their setup is often wrong. One wrong click in a live admin can reroute paying customers.
- **What it does:** a read-only walkthrough of the client's admin panel using Claude in Chrome:
  - Visit every page.
  - Read settings without clicking anything that changes them.
  - Cross-check each headline number on a second page.
  - Deliver one sourced report with findings ranked.
- **My contribution:** my method and its no-changes rule, built on my first platform-mapping engagement (client details removed). Claude Code drafted the text.
- **Example:** [examples/matsquad-backend-map.md](examples/matsquad-backend-map.md)
- **Evidence:** the skill states its rules come from a 2026-08 engagement. It includes the page-reading snippets, a report template, and a breakage checklist.
- **Not verified:** no automated tests, and my local Claude Code logs show no Skill-tool load of it. See [Known limitations](#known-limitations) for one wording issue.

Also worth a look:
- [matsquad-diagnostics](skills/matsquad-diagnostics/SKILL.md): client intake audit from raw exports.
- [prompt-preflight](skills/prompt-preflight/SKILL.md): a no-fabrication gate for AI-drafted copy.
- [jjo-ad-placements](skills/jjo-ad-placements/SKILL.md): placement policy for AI-built Meta ads, plus ad-to-CRM attribution.
- [verify-before-asserting](skills/verify-before-asserting/SKILL.md)
- [measure-before-build](skills/measure-before-build/SKILL.md)

## Design requirements these skills share

The skills write down the following requirements. They are instructions, not guarantees that an AI agent will always follow them; the approval and verification steps exist so a person can catch it when one doesn't.

- **Human approval before anything reaches real people or money.** Sends, launches, and publishes wait for the operator's explicit word.
- **Verification at the far end.** An API's "success" does not mean the message was delivered or the record landed. The procedures call for reading back the real state before reporting.
- **No invented facts.** Drafts use visible placeholders instead of guessing names, numbers, or dates, and they name any words the model wrote itself.
- **Customer data kept out of chat and logs.** Contact work is meant to stay count-only or masked.
- **Honest status.** Skills state what is untested, and what was designed but never proven.

## Repository layout

```text
README.md          this page
CATALOG.md         all 65 skills: purpose, business problem, inputs/outputs,
                   my contribution, dependencies, verification status
THIRD-PARTY.md     skills I use but did not write (linked, not copied)
examples/          illustrative runs of the five featured skills
skills/<name>/     SKILL.md plus any references/, scripts/, assets/
```

## How the work was made

I define the problem and the rules, direct the agents, and review the results against real operations.
- **Most skills:** Claude Code drafted the text in my working sessions, from the operations I ran and the decisions, corrections, and rewrites I gave. Commits in the private source repo carry Claude co-author trailers.
- **17 skills:** OpenAI Codex generated them at my request, from my project rulings. See [CATALOG.md, section 6](CATALOG.md#6-generated-with-openai-codex-at-my-request).
- **Third-party skills:** linked in [THIRD-PARTY.md](THIRD-PARTY.md), not copied. This includes Anthropic's `frontend-design`, which sat unmodified in my private skills folder.

## Evidence levels: discovered, loaded, executed, tested

These four levels are different claims:
- **Discovered (listed):** the agent can see that a skill exists.
- **Loaded:** the skill's instructions were read into a session.
- **Executed:** a skill's script was actually run.
- **Tested successfully:** someone checked the outcome and it passed.

Being listed does not prove any of the other three. All records below come from my local session logs and concern the private originals of these skills. The redacted copies in this repository have not been loaded or run.

| Agent | Discovered | Loaded | Executed | Tested successfully |
|---|---|---|---|---|
| Claude Code | The private originals were installed as personal Claude Code skills. Per-skill listing was not tracked. | 23 recorded as loaded through the Skill tool, e.g. ghl-email-send (20 sessions), excelsior-ship (17), excelsior-verify (11). | Not tracked separately. | Not established by this portfolio. |
| OpenAI Codex | 18 appear in Codex's skill index (session of 2026-09-18): the 17 Codex-generated skills plus orchestrate-client-funnel-launch. | All 18 had their `SKILL.md` read in Codex sessions. I did not separate reads while writing a skill from reads while using it. | Codex invoked the scripts of 3 skills (Sep 1-12, 2026): persistent-lan-preview (`check_preview.py`), glb-asset-foundry (`inspect_glb.py`), frozen-pipeline-guard (`check_frozen_diff.py`). | Not established. I did not review those runs' outcomes. |

The other 47 skills have no Codex evidence. Treat their Codex compatibility as unverified.

## Using a skill

**Claude Code:** copy a folder from `skills/` into `~/.claude/skills/<name>/` (personal) or `<project>/.claude/skills/<name>/` (project). Claude Code can load a skill automatically when a request matches its `description`, or you can invoke it by name.

**Claude-specific dependencies** (named per skill in the catalog):
- MCP servers: GoHighLevel, Meta Ads, Google Drive connector
- Claude in Chrome, for browser recon
- Claude Code desktop scheduled tasks
- Claude Code preview and browser tools
- Subagents

Several skills also need standard CLIs: `gh`, `vercel`, `wrangler`, the Supabase CLI, Playwright, Python 3, Node.

## How this public copy was made

- The skills were copied from my private operating-system repo into this fresh repository, without its git history. No skill script was executed to build the portfolio.
- Client names, people's names, account and folder IDs, test logins, internal paths, and business performance figures were replaced with placeholders, removed, or restated in words.
  - Numbers that remain are one of three things: figures the original skill states in relative form, configuration limits and public pricing, or example data labeled "illustrative".
  - A skill changed this way carries a one-line **Portfolio copy** note under its header.
- Six skills were held back. One is the unmodified third-party skill above. Five describe a live member app's internals or security setup in too much detail to publish safely.
- **Changes beyond redaction:**
  - Obsidian links were converted to relative links.
  - Three descriptions were quoted so their YAML parses.
  - Four descriptions were shortened to fit the 1,024-character limit by trimming redundant trigger words. Their purpose and main triggers are unchanged, and one list of source cases moved into the body.
  - funnel-worker carries a status label.
  - Two conflicts were reconciled where the source's own dated records settle the intended rule. Each has an inline note:
    - prompt-preflight step 5.8 now follows `voice-specs.md` on greeting and email length.
    - An older ghl-email-send section is marked as superseded by its "RESOLVED 2026-08-26" section.

## Known limitations

- **funnel-worker is an incomplete reference scaffold, not a ready-to-run tool.** The page templates it imports, a `package.json` with its npm scripts, the cart page sources, and a `src/` layout are missing here and in the private source. The skill header lists each missing file.
- **matsquad-backend-map (needs review):** the skill's text treats an unmapped product with buyers as proof that those buyers "received nothing." Its example applies the stricter reading: a *potential* fulfillment gap to verify. The skill text itself is unchanged.
- **prompt-preflight (needs review):** step 5.1 says to cut every draft by about half. The email section of `voice-specs.md` says to cut for density rather than length, within 400 to 700 words. The source does not say whether 5.1 applies to emails, so this is left open.
- **Unpublished cross-references:** some skills name skills that are not published here. These appear as plain text marked "private skill, not published". References to private design docs and notes are marked "not included".

## Ownership

© 2026 Paul Tokgozoglu. No open-source license has been chosen yet, so all rights are reserved until one is added. Third-party works keep their own licenses (see [THIRD-PARTY.md](THIRD-PARTY.md)).
