---
name: parallel-claude-lanes
description: Use when two or more Claude Code sessions, agents, or workstreams share one git repository... worktree lane setup, branch and namespace ownership, per-lane ports and env, the wrong-lane dev-server AND hardcoded-port-battery traps, evidence-churn/repo-weight gotchas, and cleaning up a finished lane. Triggers on words like worktree, lane, parallel sessions, collision, already checked out, port conflict, migration slot, reserved version, stale server, wrong app, hardcoded port, wrong lane battery, evidence prune, repo weight, push hangs, worktree remove.
---

# Parallel Claude Lanes (multi-session repo discipline)

Born on the Excelsior build the day two sessions collided in one checkout.
Generalized here... nothing below is specific to that project.

## Lanes are worktrees

- One workstream = one git worktree = one lane. `git worktree add <path> <branch>`
  gives each session its own checkout of the same repo... separate files, shared
  history.
- A branch checks out in exactly ONE worktree at a time. "already checked out"
  is not an error to force past... it means the other lane owns that branch.
- Each lane carries its own untracked environment (.env copies, node_modules)...
  set them up per lane, never reach across by path.
- Assign per-lane dev-server port ranges up front (e.g. lane A 5173+, lane B
  5273+) so both lanes can run side by side without stealing sockets.
- Write the convention down IN the repo (a WORKTREES doc) so every future
  session inherits it instead of re-deriving it.

## Namespace ownership (the collision killer)

Parallel branches that mint numbered artifacts WILL collide unless the number
space is partitioned by agreement, in writing:

- Migration timestamps/numbers: each lane owns an explicit block (lane A mints
  20260706000001-000099, lane B mints from 000100 in the same date-space).
  Record the registry in the repo's canonical doc, and check the applied ledger
  by READING it before any push... collisions are caught by reading, not by
  failing.
- Version numbers in shared documents: reserve a slot BY NAME in the document
  itself ("v2.9 is reserved for <workstream>") before parallel work starts.
  Never mint over a reserved number, never renumber someone else's slot.

## The lane rider (prove isolation, don't assert it)

- At work start: record the OTHER lane's HEAD as a baseline.
- At close: prove it unchanged... `git -C <other-lane> rev-parse HEAD` matches
  the baseline and its working tree is clean. Byte-identical, not "should be
  fine."
- Never build, test, or deploy from the wrong lane. A session that finds itself
  rooted in the wrong lane adds the correct worktree and moves there... it never
  widens a permission grant or bypasses a sandbox guard to reach across.

## The wrong-lane branch-delete trap

The same "one worktree per branch" rule that blocks checking out a branch
someone else owns also blocks routine git-hygiene commands on `main` (or any
branch) if the OTHER lane happens to have it checked out... `git checkout main`,
`git branch -D <branch>`, and `gh pr merge --delete-branch` (which tries to
switch the current worktree to the base branch before deleting) all fail with
`fatal: 'main' is already used by worktree at '<other-lane-path>'`. This is not
a permission problem and not a reason to force anything in the other lane... it
means your OWN worktree needs to stop pointing at the shared branch name before
the operation can proceed.

Fix: detach HEAD at the remote ref instead of checking out the local branch
name, freeing the local branch reference for deletion:
```
git checkout --detach origin/main   # or origin/<base-branch>
git branch -D <the-now-merged-branch>
```
Do the merge itself via `gh pr merge <n> --merge` WITHOUT `--delete-branch`
first (that flag is what triggers the failing local checkout); delete the
branch as a separate step once detached. Confirm the fetch/log matches the
merge commit before treating the PR as closed.

## The wrong-lane dev-server trap

Two lanes often carry identically-named launch configs or server entries
pointing at DIFFERENT checkouts. Preview tooling resolves the name against the
session's working directory and will silently serve the other lane's stale
app... no error, no warning, just a running server missing the code you're
testing.

- Before trusting any screenshot, fps number, or behavior from a served app:
  fetch the served bundle (curl the built js) and confirm a marker string from
  your recent work is actually in it. On a live Vite dev server (no build, no
  bundle to curl) the same check works via its filesystem endpoint:
  `curl <server>/@fs/<absolute-path-to-source-file> | grep <recent-marker>`
  pulls the exact raw source Vite is serving, independent of the port number
  you happened to hit.
- When in doubt, start the server manually via shell with an explicit cd into
  the correct lane, bypassing name-resolved launchers entirely.

## The wrong-lane HARDCODED-PORT trap (batteries, not just dev servers)

A test/battery with a hardcoded `localhost:<port>` is the same trap wearing a
different hat: run it from a second worktree whose own dev server is on a
different port and it silently measures the FIRST lane's server, green against
code that isn't yours. A standing atmosphere battery hardcoded to 5174 was
about to certify a new lane's build by measuring the old lane. Fix: make the
port an env override (`process.env.COSMOS_PORT || 5174`) and pass the lane's
port from any non-default worktree. Audit every harness for a baked host/port
before trusting its PASS from a fresh lane.

## The evidence-churn / repo-weight traps (multi-lane, image-heavy)

Parallel visual slices each regenerate large evidence galleries, and two
gotchas bite at commit/push time:

- **`git add <evidence-dir>/` re-adds files you just `git rm --cached`'d.**
  Pruning a committed gallery to a decision-critical subset, then blanket-
  `git add`-ing the dir (or `git add -A`), silently re-stages the pruned
  blobs... the amend looks pruned in the summary but the pack is full-size
  and the push hangs / ETIMEDOUTs. Re-check `git diff --cached --stat` for
  the big files after any prune, and stage narrowly.
- **Keep the ruling set committed, the full gallery local.** For a stills/
  comp gate, commit only the few poses the decision hinges on; the full
  N-pose gallery lives in the worktree for your own eyes. A 148MB commit
  won't push on a normal connection.

## Cleaning up a finished lane

At slice close, remove the spent worktree (`git worktree remove <path>
--force`), but note `checkout --detach` and `worktree remove` both ABORT on a
dirty tree... discard the lane's regenerated evidence first (`git checkout --
.` + `git clean -fdq evidence/`) or the detach/remove silently no-ops and the
branch delete that depends on it fails downstream.

## Related

`verify-before-asserting` (the served-bundle check is an instance of it) ·
`perf-measurement-hygiene` (numbers from the wrong server are fiction).
