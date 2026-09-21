---
name: context-hygiene
description: One job per session, one session per concern. Use when starting a new task that is unrelated to the one already open, before pasting the next job into a running conversation, before trusting cwd/branch/port/env in any multi-worktree repo, or when a claim about "which lane/session/server" something ran on needs to be right. Triggers on words like fresh session, new session, worktree, lane, wrong port, wrong lane, cwd, session got long, context length, stacked sessions, misrouted, which branch am I on.
---

# Context Hygiene

## The law

One job per session, one session per concern. Open the fresh session BEFORE pasting the next job, not after the current one starts drifting. Inside any session: verify cwd explicitly, use explicit paths (`git -C <path>`, absolute paths, never a bare relative command that trusts wherever the shell happens to be), and derive anything environment-dependent (a LAN IP, a port, which branch a worktree is on) fresh every time rather than reusing a value from earlier in the conversation.

## The mechanism (not "the model gets tired")

Two distinct, checkable failure modes, not fatigue:

- **Long context raises stale-assertion risk.** The more a conversation holds, the more REMEMBERED facts (a port number from three tasks ago, a check-count from an earlier hold, a branch's state from before it was rebased) sit available to be reported instead of a fresh check. This is the exact failure [verify-before-asserting](../verify-before-asserting/SKILL.md) names directly... context length is a risk FACTOR for that law, not a separate excuse. See its case studies for what this actually looked like inside one long session.
- **Stacked worktrees/sessions raise misrouting risk.** When a session accumulates multiple unrelated jobs, or when multiple sessions share one machine's worktrees, an action correctly scoped for job/lane A can land in job/lane B... not because either job was reasoned about incorrectly, but because the ambient state (which directory a tool call resolves against, which server a battery's default port hits) silently differs from what the last few turns assumed.

## Case studies (labels/fontload/bloomexclude arc, 2026-07-21/22)

- **A MAD amendment paste landed in the FONTLOAD room.** A fresh, unrelated task ("ratify the two-track frontend amendment") arrived as a new message inside the SAME conversation that was still mid-flight verifying FONTLOAD on a phone-served dev server. Rather than a clean session boundary, the two jobs (soon a third, BLOOMEXCLUDE) stacked into one continuously-growing conversation, each needing its own worktree because the session itself never reset. The work still got done correctly, but only because each new task's first move was to explicitly re-derive its own lane... the STRUCTURE offered no such guarantee on its own.
- **Wrong-lane/wrong-port bit repeatedly, not once.** An RTS battery run with no explicit URL argument defaulted to port 5183 and silently measured a DIFFERENT worktree's server (the LABELS lane's, not the one under test)... a full battery run, green, against the wrong code. Separately, `preview_start`'s name-based launch.json lookup resolves against a fixed session directory, not per-worktree; starting a server "by name" for a second worktree risked serving the FIRST worktree's config even though the working directory had visibly changed. Same underlying trap, two different tools, both only caught by an explicit `curl <server>/@fs/<path> | grep <marker>` check rather than trusting the port number. Full mechanical fix for this class: [parallel-claude-lanes](../parallel-claude-lanes/SKILL.md).
- **`.env` missing in every fresh worktree.** `git worktree add` does not copy untracked/gitignored files, so each new worktree (a MAD-amendment lane, a BLOOMEXCLUDE lane) crashed on first boot with "supabaseUrl is required"... obvious in hindsight, rediscovered fresh each time rather than anticipated from the first occurrence.
- **False-confidence misses clustered late in the session, not early.** The RTS-count assumption, the token-revoke wrong-argument mistake, and other misses in this arc landed well into a long, multi-job conversation, not near its start. That distribution is exactly what the long-context mechanism above predicts... more remembered claims competing with fresh checks the longer a session runs, not a model "getting tired."

## What this does NOT replace

This is the reasoning-discipline layer above the mechanical procedure, not a substitute for it. [parallel-claude-lanes](../parallel-claude-lanes/SKILL.md) owns the actual git mechanics of running worktrees correctly once multiple lanes exist (setup, namespace ownership, the wrong-lane traps' fixes, evidence-churn, cleanup)... read it before doing multi-lane work. [verify-before-asserting](../verify-before-asserting/SKILL.md) owns the general law of checking before claiming. This skill is about the STRUCTURE that keeps either of those from being undermined by ambient drift: a session that's been serving three unrelated jobs for two hours, or a worktree whose `.env`/port/branch nobody re-confirmed since the last context switch, can defeat a careful verifier simply by having them carefully verify the wrong thing.

## The habit

Before starting work that doesn't obviously continue the last few turns: is this the same job? If not, is a fresh session realistic here, and if not, has cwd/branch/port/env all been re-confirmed explicitly rather than assumed carried over? Before trusting any "which lane did that run on" claim, in this session or another: `git -C <path> branch --show-current` and `git -C <path> status --short`, not memory.

## Related

[parallel-claude-lanes](../parallel-claude-lanes/SKILL.md) (the mechanical procedure for running multiple lanes correctly) · [verify-before-asserting](../verify-before-asserting/SKILL.md) (the general check-before-claiming law this arc's misses trace back to) · [perf-measurement-hygiene](../perf-measurement-hygiene/SKILL.md) (a sibling case of "the wrong server, not the wrong tuning").
