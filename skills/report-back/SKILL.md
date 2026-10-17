---
name: report-back
description: After any change — a file edit, a schema change, a sent message, a config update, an automation run — state in plain English exactly what changed. Use whenever you've just modified something, across any project. Written for a non-coder operator who needs to trust the report without reading the diff.
---

# Report Back

The operator (Nejat) is non-coding and is the final authority. After any change, tell him exactly what changed, in plain language, so he can trust it or stop you.

## What a good report contains

- **What changed**, concretely: which files/records/settings, and what they do now vs. before.
- **Scoped to what was asked.** If the report describes changes *beyond* the request, that's a red flag — the operator stops the session. So don't do work beyond scope, and if you did, surface it loudly rather than burying it.
- **What you verified** (see the `verify-before-asserting` skill) — how you know it works, not just that you believe it does.
- **What's left / what's next**, if anything.

## Leave the trail in GitHub (every repo, every runner)

The report tells the operator. The trail tells the next agent. Do both. The full rules are in [How Our AI Agents Work Together](../../docs/multi-agent-coordination-playbook.md#the-github-trail-how-any-agent-takes-over-any-job).

1. Add two trailers to each commit: `Agent-Role: <slug>` and `Agent-Runner: <claude-code | codex | cloud-agent | scheduled-task | ci>`. Find the slug in the roster, `TEAM.md`. If the work is not for a role, write `Agent-Role: none`.
2. Write a run record in `runs/` for a weekly or rarer scheduled job, a failure, a change to how a job works, or work that touches money, customers, or public content.
3. If you changed how a job works, update its `agents/<slug>/HANDOFF.md` and CHANGELOG.md in the same pass.

## Style

- Plain English. Define any jargon inline the first time. No wall of diff.
- Honest about partials, skips, and failures.
- Short. The operator should grasp it in under a minute.

## Why this is a standing rule

It's the trust mechanism. The operator can't audit code, so the report *is* the audit surface. A precise report is what lets a non-technical owner stay in control of a technical system.
