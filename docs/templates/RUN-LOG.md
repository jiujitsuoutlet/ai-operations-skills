---
run: <job or automation name>
agent: <claude-code | codex | cloud-agent | scheduled-task | ci | other>
role: <role slug from TEAM.md, or none>
date: <YYYY-MM-DD>
trigger: <manual | scheduled | event>
outcome: <success | partial | failed>
---

# Run: <name> on <date>

Keep it under 60 lines. Store it in `runs/YYYY-MM-DD-<role>.md`, in version control.

## Task
<What the run was asked to do.>

## Inputs
<What it read or was given.>

## Decisions
<Each choice the run made, and why. Each approval: who gave it and when. Write "none needed" if nothing needed approval.>

## Outputs
<What it produced, and where it is: file path, message, draft, pull request.>

## Open items
<What is still not done.>

## Handoff: improve next run
<The next runner reads this first. Be specific: what to change, which limit was wrong, what the owner corrected.>
