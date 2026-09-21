---
name: vault-mapping
description: The repeatable procedure for filing anything into this Obsidian vault (`<VAULT_REPO>`)... a new skill, an EDIT to an existing skill, a new capability, a doc, a Drive pointer, an ecosystem update. Fires automatically on any add OR update to a file under skills/, whether or not Obsidian is mentioned... not just when asked to "map X into the vault", "add this to Obsidian", "file this in the brain", or "document this". Encodes the exact steps so they don't get re-derived from scratch each time. Triggers on words like map, file, document, add to vault, add to Obsidian, sync to the brain, new skill, new capability, update skill, edit skill, modify skill.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Vault Mapping Procedure

This vault (`<VAULT_ROOT>`, repo `<VAULT_REPO>`) has a consistent shape. Every "map X into the vault" task this session followed the same five steps... this skill is that process, written down once instead of re-derived every time. Saves a full explore-then-guess pass on every request.

## Step 0 ... read before creating (skip only if you already know this session)

Check `/index.md`, `/CLAUDE.md`, and the `index.md` of whichever domain the content belongs to. Never invent structure... this vault's own rule is "a stale map is worse than no map," and a new-shaped folder is worse than either. If something below looks stale against what those files actually say right now, trust the live file and note the drift.

## Step 1 ... source discipline

Read the actual source material in full before writing anything derived from it. Never fabricate a fact, a trigger word, an MCP server name, or a struct field... if it isn't in a file you read, say you don't have it. Screen for secrets, API keys, tokens, and member PII before anything enters this repo (it syncs to GitHub, shared with the team). Drive material gets referenced by file ID, never copied in wholesale.

## Step 1b ... which runner: Codex or Claude Code (ASK, never assume)

**Standing rule from Paul, 2026-08-28: determine the runner BEFORE mapping a skill.** Two agents load from this one vault. `~/.claude/skills/` and `~/.codex/skills/` each hold symlinks pointing at `skills/` here... one file, two readers. Mapping a Codex skill into Claude only is a silent miss: the symlink resolves, the skill registers, the report reads clean, and the intended runner never sees it. That happened on `orchestrate-client-funnel-launch` and was caught only because Paul said so.

Decide in this order:

1. **Read the source for signals.** Does the skill name Codex, `AGENTS.md`, Linear, or another agent as its executor? Does its target repo carry an `AGENTS.md` (the Codex source-of-truth convention... `<CLIENT_FUNNEL_REPO>` has one, with `CLAUDE.md` symlinked to it)? Client-services and launch-orchestration work has skewed Codex; Excelsior build-craft and Builder-OS behavior skills have skewed Claude.
2. **Check what is already linked**, both sides: `ls -la ~/.claude/skills/` and `ls -la ~/.codex/skills/`. The standing pattern is that every Codex-linked skill is ALSO Claude-linked, and the reverse is not true. Dual-linking is the norm, not an exception.
3. **If the source does not say, ASK Paul.** One question, recommended answer attached, per house style. Do not default to Claude silently... that default is exactly the failure this step exists to stop.

Then symlink into whichever directories the answer names, verify each side resolves to the SAME inode as the vault file (`ls -iL`), and record the runner in the node's `durability` line plus a `runner:` field, and in the hub row. A node that does not say which agent loads it is incomplete.

## Step 2 ... where things go (the map, memorized so it doesn't need re-discovering)

| Content type | Location | Notes |
|---|---|---|
| New OR updated skill (Claude, Codex, or both) | `skills/<name>/SKILL.md` (+ `scripts/` if it has helpers) | **Standing rule, automatic, never conditional on being asked: any add OR edit to a file under `skills/` triggers this full pass, every time, no exceptions... a one-line description tweak counts exactly as much as a brand-new skill.** A skill is not done being created OR done being updated until Obsidian reflects it too... these are one action, not two, done in the same pass.<br><br>**Adding a new skill:** (1) write `SKILL.md`, (2) symlink into the runner directory/directories decided in Step 1b (`~/.claude/skills/<name>` and/or `~/.codex/skills/<name>`) → the vault folder, (3) verify EACH symlink resolves to the same inode as the vault file (`ls -iL`) AND, for a Claude-linked skill, that it registers as discoverable this session (shows up in the system-reminder skill list), (4) create its node at `knowledge/ecosystem/vault-skills/<name>.md` (same frontmatter shape as its siblings: `type`, `lane`, `source`, `triggers`, `mcp`, `third_party`, `durability`, `updated`), (5) add its row to the matching lane table in `knowledge/ecosystem/skill-plugin-map.md` and bump both that lane's count and the hub's total, (6) add its row to `skills/README.md`.<br><br>**Editing an existing skill:** (1) make the edit, (2) re-verify it still registers this session, and that every runner directory it should be in still links to it (a skill can gain a runner later... `orchestrate-client-funnel-launch` gained its Codex link a turn after it was first mapped), (3) re-read its ecosystem node's body against the actual change... if the edit changed what the skill does, its scope, or its triggers, update the node's prose (don't leave it describing the pre-edit behavior), and bump its `updated` date, (4) check the hub table row and the `skills/README.md` row too... they're terse one-liners so they often still hold, but check, don't assume just because they're short.<br><br>Confirmed, not assumed, at every sub-step, on both paths. Skipping this is exactly how a map goes stale one skill later... it happened twice already: `pol-renderer` sat un-symlinked and un-mapped until LATTICE caught it, then this very skill's own ecosystem node went stale for one turn after its first edit, caught only because Paul asked. If a skill postdates the last LATTICE-style trigger-overlap audit, say so plainly in its node rather than implying it was reviewed. |
| Excelsior domain knowledge/capability/SOP | `domains/excelsior/<Category>/`... `Governance`, `Architecture`, `Lanes`, `Slices`, `Skills`, `Operations`, `Open-Loops`, `People`, or `_meta` | Match a sibling file's exact frontmatter fields (`type`, `status`, `mad_version_at_write`, `last_verified`, `tags`) and prose style, don't invent new fields. |
| Other domain (academy/content/commerce) | `domains/<wing>/` | Same pattern: read that wing's own `index.md` first, match its existing note format. |
| Cross-cutting reference (not tied to one domain) | `knowledge/` | E.g. the operator profile, the Drive manifest, the ecosystem map. |
| Google Drive material | Never copied in | Pointer only: file ID + one-line description in `knowledge/drive-manifest.md`. |

## Step 3 ... wire the graph (the step most likely to get skipped)

1. Add `[[wikilinks]]` to every genuinely related existing note. An unresolved link (pointing at a note that doesn't exist yet) is fine and expected... link liberally.
2. Update the nearest `index.md` / MOC with a one-line pointer so the new note is reachable from the map, not just sitting there orphaned.
3. **If this pass is about a skill (new or updated),** its Obsidian mapping already happened as part of Step 2, not here... this step is for everything else (domain notes, knowledge notes, Drive pointers). Don't do the ecosystem wiring twice, and don't skip it by assuming Step 3 will catch it later.

## Step 4 ... house style

Ellipses for pacing, never em-dashes, in everything you author (headings, body, table cells). After writing, `grep -rn` the em-dash character across every file you touched this turn. Fix violations **only in content you just authored**... pre-existing em-dashes in old notes are not yours to silently rewrite unless asked.

## Step 5 ... commit and push, carefully

- `git pull --rebase --autostash` first, always. The Obsidian Git plugin auto-commits and pushes every ~15 minutes in the background; a plain `add`+`commit` can race it.
- `git add` the specific paths you touched. Never `git add -A` blind... review `git status --short` and confirm nothing unexpected is staged (a stray untracked file, a secret, someone else's in-progress work).
- Commit with a clear one-line message plus the `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.
- Push. If `git commit` reports "nothing to commit" right after your pull, that's very likely the auto-sync plugin already having captured your edits as a `vault auto-sync: ...` commit... check `git log -1 --stat` to confirm before treating it as a problem. It's success, not failure.

## Step 6 ... report back

Plain English, per `report-back`: where the note was filed, exactly what it's linked to, what was verified (symlink resolved? skill registered? push landed?), and any conflicts or gaps flagged rather than smoothed over (per `flag-conflicts`). Never claim something is live without having confirmed the push actually happened.

## Related

`report-back` (the output format this ends on) · `verify-before-asserting` (the discipline behind Steps 1 and 6) · `flag-conflicts` (what to do when new content contradicts something already in the vault) · `knowledge-bank` (how to judge across vault + Drive when the source material spans both).
