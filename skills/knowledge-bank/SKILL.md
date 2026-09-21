---
name: knowledge-bank
description: How to use the Excelsior/JJO central knowledge bank — and how to judge across it. Use whenever answering questions about JJO SOPs, business facts, pricing, membership/billing policy, the Excelsior vision, curriculum, or content. The bank spans the vault (curated) and the "AI Training" Google Drive folder (raw, read live via the connector). Agents hold the FULL scope of both and must weigh sources, not just grab the first hit.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# The Central Knowledge Bank

One bank, two stores — **use BOTH, and judge across them.** You have the full scope of everything; never answer from a single source or the first hit.

- **Vault (curated):** distilled notes, maps, skills. Fast, reviewed, versioned. May be a *summary* that's missing detail or has gone stale.
- **Drive (raw):** full source documents, transcripts, contracts, data. Read **live** via the Google Drive connector. Complete, but sprawling and may contain drafts or superseded versions.

Neither store is complete or authoritative on its own. Survey what's relevant across both, weigh it, then answer.

## How to judge across sources

When information overlaps or conflicts, decide by **authority, then recency, then relevance**:

1. **Authority — who is canonical for THIS topic.** Find the source-of-truth document for the question, wherever it lives. A canonical source outranks any summary of it.
   - Architecture / product rules → **MAD.md** (canonical, versioned).
   - Billing, fees, cancellation, contract terms → the **signed membership agreements** (the contract is ground truth, not a note about it).
   - Pricing / offers / sales process → the **sales-playbook intake** doc.
   - Origin / vision / long-term strategy → the **Excelsior Origin Story** + MAD.
   If a curated vault note disagrees with its canonical source, the **canonical source wins** and the note is stale — flag it to be fixed.

2. **Recency.** Newer supersedes older. Check version numbers and modified dates; prefer finals over drafts. Never quote a superseded document as current.

3. **Relevance.** Pull what the task actually needs. Don't dump everything — select the sources that answer the question and ignore the rest.

## Synthesize and cite

Combine what the sources say into one answer, and **name the source(s)** it came from so the human can verify (see `verify-before-asserting`, `report-back`). "Per the membership agreement and the sales-playbook intake…" beats an unattributed claim.

## Conflicts get flagged, not silently resolved

If two sources genuinely disagree and you cannot tell which is authoritative, **say so and present both** — do not pick silently (see `flag-conflicts`). A real conflict usually means a document is stale and needs updating.

## The two stores (map — navigate here first, read only what you need)

**Vault:** start at `/index.md`, then the relevant `domains/<wing>/` and `knowledge/`.

**Drive — "AI Training"** (folder id `<AI_TRAINING_FOLDER_ID>`) — **the designated home for content Nejat writes specifically for AI agents** (2026-07-09). This is the top-level folder itself, not just its subfolders below — check it directly, every session that touches the knowledge bank, for anything new sitting there loose.
- **SOP Repository** (`<SOP_FOLDER_ID>`) — agent prompts, build prompts, sponsor sheet
- **Business Context** (`<BUSINESS_CONTEXT_FOLDER_ID>`) — Origin Story, sales-playbook intake (pricing/offers/sales), the membership + billing agreements
- **Data Sources** (`<DATA_SOURCES_FOLDER_ID>`) — Emails, Podcast Episode Transcripts, FB Ads, Social Posts, raw exports, large PDFs

Read live — the connector always returns Drive's current state, so there is nothing to "sync." Do NOT copy raw Drive files into the vault wholesale (drift, git bloat, PII risk).

**Important asymmetry — this folder does NOT auto-load like this skill does.** A skill/CLAUDE.md loads into every session automatically; a file dropped in AI Training only gets read when a session decides to check it. This skill file is *how* that happens: because it's a global skill, it fires on knowledge-bank questions and points every session at this folder. If Nejat drops something in AI Training meant to change agent behavior directly (not just inform an answer), it still needs a pointer here, or in `knowledge/drive-manifest.md`, to guarantee it gets found — flag that back to him if a file's clearly meant as a standing instruction but has no pointer yet.

## Trust boundary (two brains)

- **Internal / Builder-OS agents (Brain A):** full access to the whole bank, including Business Context and contracts.
- **Member-facing product agent (Brain B):** NEVER gets raw access to contact lists, contracts, or business-internal docs. Its knowledge is only what has been explicitly curated and MAD-approved for members.

## Optional freshness digest (human-in-the-loop)

A periodic routine may refresh `knowledge/drive-manifest.md` (files + last-modified dates) and log a "changed since last check" digest to `runs/` — for navigation and human review only. Nothing is auto-copied into the vault.

## Practical dependency

Agents can only read Drive where the Google Drive connector is enabled. It's on in the web session; make sure it's also connected in your local Claude Code so vault-side agents can reach the bank.
