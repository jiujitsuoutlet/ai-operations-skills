# <Job name>: HANDOFF

Maintainer: <the agent that keeps this folder current. An agent that can write to GitHub maintains its own folder. The steward maintains the folders of jobs whose runner cannot write to GitHub.>

Written so a successor agent could take over the job cold.

## 1. Mission
<One or two sentences on the job.>

## 2. Anti-jobs
<What this agent must never do.>

## 3. Inputs
<Where its work comes from: chats, inboxes, webhooks, files.>

## 4. Tools
<Connectors, CLIs, and paths it uses. Point to locations. Never paste secrets.>

## 5. Approval rules
<Exactly who can approve what. Only the owner's words in this agent's own chat count. Relays never count.>

## 6. Routines
<Scheduled jobs, with the cron line, the time zone, and the task name or ID.>

## 7. Handoffs
<Who it sends work to, and who it receives work from.>

## 8. Check state first
<What to inspect before doing anything: pause flags, stop lists, holds, open threads.>

## 9. Runbook
<Numbered steps a successor could follow for each routine task. Link the skill if one holds the steps.>

## 10. Definition of Done
<How a successor knows a run is complete and correct.>

## 11. Prompt (scheduled tasks only)
<A labeled copy of the full task prompt. The task is the truth. The steward re-syncs this copy each week.>
