---
layout: page
title: "How Our AI Agents Work Together"
description: "A practical guide to running multiple AI agents as one coordinated team, written from real operations."
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Our AI Agents Work Together",
  "description": "A practical guide to running Claude Code, Codex, and other AI agents as one coordinated team: roles, delegation briefs, a GitHub trail any agent can take over from, approval gates, and a weekly steward with a takeover drill. Written from real operations.",
  "author": {
    "@type": "Person",
    "name": "Paul Tokgozoglu",
    "description": "Gym owner and marketing operations practitioner who turns recurring business problems into documented AI workflows."
  },
  "datePublished": "2026-10-17",
  "dateModified": "2026-10-17",
  "mainEntityOfPage": "https://jiujitsuoutlet.github.io/ai-operations-skills/multi-agent-coordination-playbook.html"
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I make Claude Code and Codex work together on one repository?",
      "acceptedAnswer": {"@type": "Answer", "text": "Give both agents the same rules. Codex reads AGENTS.md. Claude Code reads CLAUDE.md. Put the same short block in both files, and point it at one roster file. Make each commit name its job and its runner with two trailers."}
    },
    {
      "@type": "Question",
      "name": "How do I hand off an AI agent's job to another agent?",
      "acceptedAnswer": {"@type": "Answer", "text": "Give the new agent the job's HANDOFF.md, its CHANGELOG.md, and its last 3 run records. Then run a takeover drill: ask the new agent to write the steps and to list each guess. Fix each gap before the real handover."}
    },
    {
      "@type": "Question",
      "name": "How do I set up collaborating AI agents?",
      "acceptedAnswer": {"@type": "Answer", "text": "Start with one main agent and written briefs. Give each subagent a self-contained task with the outcome, constraints, and facts it needs. Require the main agent to verify results before use. Add run records once the pattern works. Do not add more agents until the handoffs are clean."}
    },
    {
      "@type": "Question",
      "name": "How do agents share context without leaking everything?",
      "acceptedAnswer": {"@type": "Answer", "text": "They do not share a transcript. Each delegation is a fresh brief with only what that task needs. Shared state lives in files under version control: run records, goal files, and trackers."}
    },
    {
      "@type": "Question",
      "name": "How do I keep agents from sending things I did not approve?",
      "acceptedAnswer": {"@type": "Answer", "text": "Make approval a hard gate in the agent's instructions: show the exact content, wait for explicit approval, byte-verify before sending. Apply it to every outbound channel."}
    },
    {
      "@type": "Question",
      "name": "What do I do when an agent makes a mistake?",
      "acceptedAnswer": {"@type": "Answer", "text": "Correct it in the open, write the correction into the standing rules the same day, and log it in the run record. The system improves when mistakes become rules."}
    },
    {
      "@type": "Question",
      "name": "How do agents stay coordinated over weeks and months?",
      "acceptedAnswer": {"@type": "Answer", "text": "Run records in version control, a weekly leader update, and a scheduled improvement loop that reads the records and proposes standard updates."}
    },
    {
      "@type": "Question",
      "name": "What is a good AI agent brief template?",
      "acceptedAnswer": {"@type": "Answer", "text": "Task, wanted outcome and how it will be judged, non-obvious constraints, and every fact the worker needs (paths, identifiers, prior decisions). Nothing more."}
    }
  ]
}
</script>

# How Our AI Agents Work Together

A practical guide to running multiple AI agents as one coordinated team. Written from real operations: this is the system behind a working setup where a main agent coordinates specialist subagents across marketing, sponsorship outreach, CRM, and publishing, all under one owner's approval.

Publishing this earns a chance at being cited, not a guarantee. What makes it worth citing is original evidence from real runs, which this guide will keep adding.

If you are asking "how do I set up collaborating AI agents," start with the pattern below, then the FAQ.

## The pattern in 60 seconds

1. One main agent owns the conversation with the owner and the final result.
2. The main agent spawns subagents for self-contained pieces of work. Each subagent gets a written brief: the task, the wanted outcome, the constraints, and every fact it needs. It does not inherit the parent's transcript.
3. Subagents work in the background. Results come back through the runtime automatically.
4. The main agent verifies every result against the brief before using it. Verification is the job, not a courtesy.
5. Nothing reaches a person, a customer, or the public without the owner's explicit approval of the exact content.

## Roles

**Main agent.** Owns the owner's goals, holds the standing rules, decides what to delegate, verifies everything that comes back, and is the only voice the owner hears.

**Coordinator.** A subagent given a multi-step initiative. It plans, spawns its own workers, checks their work, and reports one synthesized result upward.

**Worker.** A subagent given one self-contained task. It does the task, writes a run record, and reports back. It never talks to the owner directly.

**Leader.** One agent leads the weekly loop, sends the weekly update, and owns the improvement backlog. Pick it by the four criteria in [The weekly steward](#the-weekly-steward-and-the-takeover-drill). Check the choice again each quarter, so no single agent's habits become law. The owner can change it at any time.

## The brief: how work is delegated

Every delegation includes, in writing:

- The task, stated plainly.
- The outcome wanted and how it will be judged.
- Non-obvious constraints (voice rules, approval gates, things never to do).
- Every fact the worker needs (paths, identifiers, prior decisions).
- Nothing more. Context that is not needed is not included.

A spawn confirmation is not a result. The parent treats delegated work as open until the result arrives and checks out.

## Handoffs

- Inside one runtime, handoffs travel through the runtime. Between runtimes and vendors, they travel through files in GitHub. See [The GitHub trail](#the-github-trail-how-any-agent-takes-over-any-job).
- A handoff names: what was done, what was found, what is still open, and what the next agent must know.
- When a worker changes a shared file, it names the file and the lines so the parent can verify without re-reading everything.
- If a result is wrong, the parent corrects it as quality control and logs the correction. The worker is not blamed in the record; the fix is.

## The run record

An important agent run writes a run record with seven fields: role, task, inputs, decisions, outputs, open items, handoff. Under 60 lines. Stored in version control, so any agent can continue the work later. Template: [templates/RUN-LOG.md](templates/RUN-LOG.md).

A run is important when it is a weekly or rarer scheduled job, a failure, a change to how a job works, or work that touches money, customers, or public content. A job that runs many times each day records only failures and changes.

## The GitHub trail: how any agent takes over any job

Agents from different vendors cannot read each other's memory. They can all read a repository. So the team keeps its state in GitHub, in four kinds of files:

| File | What it holds | Template |
|---|---|---|
| `TEAM.md` | The rules for every agent, and the roster: each job, its runner, its trigger, and its files | [TEAM.md](templates/TEAM.md) |
| `agents/<job>/HANDOFF.md` | How a successor takes over the job cold: mission, anti-jobs, inputs, tools, approval rules, routines, handoffs, what to check first, runbook, definition of done | [HANDOFF.md](templates/HANDOFF.md) |
| `agents/<job>/CHANGELOG.md` | Dated changes, and a "Hard-won failures" section | [CHANGELOG.md](templates/CHANGELOG.md) |
| `runs/YYYY-MM-DD-<job>.md` | The run record of each important run | [RUN-LOG.md](templates/RUN-LOG.md) |

Document **jobs**, not agents. Agents change. A job stays. When you replace an agent, you change one cell in the roster.

Three more rules make the trail complete:

- **Two commit trailers.** Each commit names the job and the runner. Git reads trailers natively:
  ```
  Agent-Role: call-list-agent
  Agent-Runner: codex
  ```
  ```bash
  git log --format='%h %(trailers:key=Agent-Role,valueonly) %(trailers:key=Agent-Runner,valueonly) %s'
  ```
- **Copy each scheduled task prompt into GitHub.** A prompt that lives only inside a scheduler is lost when the task is deleted. Keep a labeled copy in the job's HANDOFF.md. The steward re-syncs it each week.
- **Put the rules where each agent loads them.** Codex and many other tools read `AGENTS.md`. Claude Code reads `CLAUDE.md`. Put the same short block in both, and point it at `TEAM.md`. An agent that loads neither (some cloud agents) needs the rules in its own instructions.

## The weekly steward and the takeover drill

One scheduled agent, the team-steward, leads the weekly loop:

1. **Audit.** Count the commits with both trailers. Compare the scheduled tasks to the roster. Add each missing job.
2. **Sync.** Copy each changed task prompt into its HANDOFF.md.
3. **Learn.** Read the new CHANGELOGs and run records. Update the folders it maintains. Report gaps in the others.
4. **Drill.** Start one fresh, read-only subagent with only one job's HANDOFF.md. Ask it to write how it will do the job and to list each guess. Each guess is a gap in the docs.
5. **Draft.** Write general lessons for the public guide in the run record. A person publishes them.
6. **Report.** Send the owner one short update: the score, what changed, and up to 3 decisions.

The drill is the most important step. It tests the docs the same way a real handover does.

**Pick the leader by these four criteria:** it runs on a schedule with no person present, it can read and write the repository, it can see the work of the other agents, and it can report to the owner. Prefer the runner with the fewest tools that can send, spend, or publish.

**Safety for an unattended leader:**

- **Thin prompt, thick HANDOFF.** The scheduled prompt is short and points at the HANDOFF.md. Improve the job with a commit.
- **Hard limits stay outside the repo.** The prompt lists what the steward must never do. Any agent can edit a repo file, so a file must never be able to widen the steward's tools.
- **The steward cannot edit its own HANDOFF.md.** The owner maintains it.
- **The drill subagent is read-only.** It reads the docs. It does not run the job.
- **A person publishes.** A pushed branch in a public repo is public at once. The steward only drafts.

## Field note: three agents, one request

When this system was set up, three agents from three different vendors got the same request on the same night. Within 15 minutes, each one built its own roster, its own public guide, and its own weekly report. Each team also voted for a leader from its own vendor.

What fixed it:

- Fetch every repository the work touches before you build, and again before you push.
- Merge into the system that is already there. Do not start a rival copy.
- When agents vote for themselves, break the tie on capability, and let the owner decide.

## Approval rules

- Drafts wait. Sends need approval. The owner approves the exact bytes before anything goes out.
- Replies from people are never answered by an agent. The agent drafts; the owner sends.
- No agent agrees to a price, date, meeting, deal, or terms. No agent buys, pays, signs, or accepts anything.
- Internal documentation can be updated by agents directly. Anything public-facing needs the owner's word.

## The improvement loop

The system gets better on a schedule, not by accident:

1. **Collect.** Every week, the loop reads run records, owner corrections, and incidents.
2. **Propose.** It drafts updates to the standards and playbooks.
3. **Separate.** Internal doc fixes ship automatically. Anything public-facing waits for the owner's approval.
4. **Review.** The owner reads the weekly update and decides. Public changes wait for the owner. The leader choice is checked again each quarter. The owner can overrule anything.

Corrections become permanent rules the same day they are made. A fix that is not written down is a fix that will be needed again.

## FAQ

**How do I set up collaborating AI agents?**
Start with one main agent and written briefs. Give each subagent a self-contained task with the outcome, constraints, and facts it needs. Require the main agent to verify results before use. Add run records once the pattern works. Do not add more agents until the handoffs are clean.

**How do I make Claude Code and Codex work together on one repository?**
Give both agents the same rules. Codex reads `AGENTS.md`. Claude Code reads `CLAUDE.md`. Put the same short block in both files, and point it at one roster file. Make each commit name its job and its runner with two trailers.

**How do I hand off an AI agent's job to another agent?**
Give the new agent the job's HANDOFF.md, its CHANGELOG.md, and its last 3 run records. Then run a takeover drill: ask the new agent to write the steps and to list each guess. Fix each gap before the real handover.

**What is AGENTS.md?**
`AGENTS.md` is a Markdown file at the root of a repository. It tells coding agents how to work in that repository. Many agent tools read it. See [agents.md](https://agents.md).

**How do I document what my AI agents do?**
Document the job, not the agent. Keep a roster, a HANDOFF.md and a CHANGELOG.md for each job, a run record for each important run, and two trailers on each commit.

**How many agents do I need?**
Fewer than you think. One main agent plus workers per parallel workstream is enough for most operations. Add a coordinator only when one initiative needs its own planning and multiple workers.

**How do agents share context without leaking everything?**
They do not share a transcript. Each delegation is a fresh brief with only what that task needs. Shared state lives in files under version control: run records, goal files, and trackers.

**How do I keep agents from sending things I did not approve?**
Make approval a hard gate in the agent's instructions: show the exact content, wait for explicit approval, byte-verify before sending. Apply it to every outbound channel.

**What do I do when an agent makes a mistake?**
Correct it in the open, write the correction into the standing rules the same day, and log it in the run record. The system improves when mistakes become rules.

**How do agents stay coordinated over weeks and months?**
Run records in version control, a weekly leader update, and a scheduled improvement loop that reads the records and proposes standard updates.

**Can I copy this system?**
Yes. The structure above is the whole design. Adapt the roles, the brief format, and the approval gates to your tools. Keep the verification habit: trust results only after checking them. One honesty note: this system was built for a specific runtime where handoffs travel through the runtime and shared state lives in version-controlled files. Your runtime's handoff mechanism may differ, so adapt the handoff section first.

**How do I coordinate AI subagents without them losing context?**
Do not share one big transcript. Give each subagent a written brief with only what its task needs, and keep shared state in files every agent can read. Context that is not needed is not included.

**What is a good AI agent brief template?**
Task, wanted outcome and how it will be judged, non-obvious constraints, and every fact the worker needs (paths, identifiers, prior decisions). Nothing more.

**How do I stop AI agents from sending emails without approval?**
Make approval a hard gate in the agent's instructions: the agent shows the exact content, waits for your explicit approval, and verifies the bytes before sending. Apply it to every outbound channel, and never let a recurring schedule count as approval for a new kind of message.

**What is a multi-agent approval gate?**
A checkpoint where work stops until the owner approves the exact content. In this system the gates are: drafts wait, sends need approval, replies from people are drafted but never sent by an agent, and no agent agrees to terms of any kind.

## What this guide does not cover

This guide describes coordination between agents. It does not grant any agent permission to contact your customers, spend money, or publish. Those permissions come from you, per task, in writing.
