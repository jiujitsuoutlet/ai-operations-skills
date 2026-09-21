---
name: technical-english
description: The controlled-language standard for every OPERATIONAL deliverable across JJO, Excelsior, POL, and the parent company... SOPs, curriculum and technique instructions, safety and injury protocols, staff handbooks, formal notices, agent and skill instructions, prompts, UI microcopy, error messages, code comments, commit and PR text, API and platform docs, checklists, forms, anything a person must EXECUTE or a machine must PARSE, and anything that will be translated. Built on ASD-STE100 Simplified Technical English, Issue 9 (2025-01-15). Triggers on SOP, procedure, protocol, checklist, instruction, curriculum, manual, handbook, safety, warning, caution, notice, spec, docs, README, prompt, agent instruction, error message, tooltip, translation. Does NOT apply to persuasion... ads, social, email, book, podcast, sales copy keep brand voice. Read the register router below FIRST, then write.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Technical English

## Why this exists before what it is

Ambiguity is a tax, and the person who pays it is always the reader. A team member who misreads a warm-up protocol gets hurt. A coach who misreads an SOP runs the session wrong. A learner in Jakarta who hits an Excelsior node written in idiomatic American English hits a wall that has nothing to do with the skill being taught, and quits believing the wall was their own limitation. That is the exact mechanism the thesis is against... a capable person locked out of their own capability by how the instruction was written, not by what it asked of them.

ASD-STE100 was built in 1983 because non-native-English mechanics were maintaining aircraft from manuals written by native speakers who assumed too much. Lives depended on removing that gap. The standard works. It is now used far outside aerospace, and the spec itself notes it makes machine translation and LLM processing more reliable, which matters for a platform whose whole promise is a knowledge tree anyone on earth can climb.

So this is not a style preference. It is the operating language of everything executable.

## The register router... run this first, every time

STE and brand voice are both correct, in different places. Applying STE to a Facebook ad would destroy the ad. Applying book voice to an injury protocol could hurt somebody. The spec is explicit that STE was developed for technical documentation only, and that it is never used alone... it sits underneath the applicable style guides, not on top of them.

| Deliverable | Register |
|---|---|
| SOPs, checklists, forms, staff handbook | **STE** |
| Technique instructions, curriculum steps, drill descriptions | **STE** |
| Warm-ups, injury protocol, mat rules, kids-session safety | **STE**, section 7 rules mandatory |
| POL node instruction text, Excelsior in-app copy, tooltips, error strings | **STE** |
| Agent instructions, skill files, prompts, system messages | **STE** |
| Code comments, commit messages, PR bodies, READMEs, API docs | **STE** |
| Formal notices, letters, policy, membership and billing terms | **STE**, plain-human register on top |
| Anything queued for translation or for a non-native reader | **STE** |
| Facebook and Meta ads | Ad voice |
| Organic social, captions, community posts | Social voice |
| Email, DMs, sponsor outreach, win-back sequences | Email voice |
| Book manuscript, long-form philosophical writing | Book voice |
| Beyond Homo Sapien copy, show notes | Podcast voice |
| Landing pages, offers, sales copy, No Sweat Intro scripts | Ad or email voice |

Mixed documents are common and legal. A staff handbook can open with a brand-voice statement of what the Academy is, then switch to STE for every policy and procedure inside it. Mark the switch with a heading. Never blend the two inside one paragraph.

**When the route is ambiguous, ask one question: does the reader have to DO something, or does the reader have to FEEL something?** Do... STE. Feel... brand voice. A No Sweat Intro script sits on the feel side even though it is a procedure the closer executes, because its output is a decision by a nervous human. The closer's SOP behind it is STE.

## The rules that carry the weight

Full rule set is ASD-STE100 Issue 9, part 1, sections 1 thru 9. The dictionary is part 2. Below is the operational core... the rules that catch the most defects in this body of work. Cite rule numbers when correcting a draft.

**Words (section 1).** One concept, one word, forever (1.11). Approved words only, in the approved part of speech, with the approved meaning (1.1 thru 1.3). American English spelling (1.14). No regional words, slang, or jargon as terminology (1.10). A word outside the dictionary is legal only when it is a technical noun or a technical verb in the subject field (1.6, 1.8, 1.12).

**Sentences (sections 4, 5, 6).** Twenty words maximum in a procedure (5.1). Twenty-five in descriptive text and in notes (6.3, 5.5). One instruction per sentence unless two actions truly occur together (5.2). One topic per sentence, one topic per paragraph, six sentences maximum per paragraph (6.1, 6.5, 6.6). Never drop words or use contractions to shorten (4.2). Use articles before nouns (4.5). Use a vertical list when the content is complex (4.3).

**Verbs (section 3).** Imperative for every instruction (5.3). Active voice... passive only in descriptive writing when the actor is genuinely unknown (3.6). Only the simple tenses plus infinitive, imperative, and past participle as adjective (3.2). No auxiliary stacking into complex constructions (3.4). No "-ing" verbs except as a technical noun or a modifier inside one (3.5). Describe an action with a verb, never with a noun built from a verb (3.7). No phrasal verbs... "remove" not "take off," "release" not "let go of" (9.3).

**Multi-word nouns (section 2).** Three words maximum (2.1). Break longer ones apart with prepositions. "Closed guard grip break sequence" fails. "Sequence to break the grip in the closed guard" passes.

**Safety (section 7).** Identify the risk level with a word... WARNING for risk of injury or death, CAUTION for risk of damage (7.1). Start with the command or the condition (7.2). Then give the risk or the result (7.3). Command first, reason second. Always in that order, because a reader scanning under stress reads the first clause and acts.

**Conditions (5.4).** Condition first, comma, then the command. "If the joint is locked, tap immediately."

**Punctuation and counting (section 8).** No semicolon, ever (8.1). Text in parentheses counts as one word (8.5). Numbers, units, abbreviations, quoted text, and headings each count as one word (8.6). Hyphenated words count as one (8.7). A colon in a vertical list ends a sentence for counting purposes (8.4).

**Inclusive language (GR-7).** No gendered pronouns. Neutral terms only. This is already a standing editing rule, and STE hard-codes it.

## Where STE collides with locked voice rules, and the ruling on each

Flagging these rather than silently resolving them. Any of these rulings can be overridden by saying so.

**Ellipses for pacing.** The standing rule is ellipses everywhere, including code comments. In STE-register bodies this breaks, because an ellipsis inside a work step reads as omitted text and a reader cannot tell whether a step was truncated. **Ruling: ellipses stay in chat, prose, brand copy, and commit-message bodies. They come out of SOP steps, safety instructions, curriculum steps, UI strings, and error messages.** Em-dashes stay banned in both registers, which STE agrees with.

**Brand vocabulary.** "Academy," "team members," "training session," "roll," "ninja squad," "Outlet" are not casualties. Under rules 1.8 and 1.12 they are technical nouns and technical verbs approved in this subject field, which makes them MORE protected than before... rule 1.11 forbids anyone from drifting to a synonym. STE enforces the brand standards instead of fighting them. Register the terms once and they are law.

**"Aggression," not "controlled intensity."** The anti-sanitizing rule survives intact and STE reinforces it. Precise concrete words beat soft abstractions in both systems.

**"Cut it in half."** Same instruction, arrived at from a different direction. No conflict.

**The blacklist.** "Crush your goals," "unlock your potential," "elevate," and the rest were already banned in brand copy. In STE they were never available in the first place.

## The terminology base

STE without a company glossary is half a standard. Rules 1.8, 1.9, 1.11, and 9.4 all point at one artifact: an approved list of technical nouns and technical verbs for this subject field, with one term per concept and no synonyms permitted.

That artifact is `approved-terms.md`, in this folder and mirrored in the vault (private note, not included). It covers brand, roles, programs, membership, facility, technique, safety, Excelsior and POL, and content operations. Every row carries the approved term and the synonyms that are now defects.

Read it before writing an operational document. Paul owns it, and only Paul adds terms. Section 6, technique naming, is provisional until the affiliation's technique authority signs off... where the affiliation names a thing differently, the affiliation wins.

## Mechanical check before shipping

`check.py` in this skill folder is a heuristic linter. Run it on any STE-register draft:

```bash
python3 check.py draft.md --mode procedure --glossary approved-terms.md
python3 check.py draft.md --mode descriptive --glossary approved-terms.md
```

Procedure mode enforces the 20-word limit. Descriptive mode enforces 25 words and the six-sentence paragraph rule. The `--glossary` flag turns on rule 1.11 checking against the approved terms, which is the check that catches the most defects... run it every time.

It catches sentence length, semicolons, em-dashes, contractions, gendered pronouns, auxiliary stacking, common phrasal verbs, passive-voice candidates, progressive verb forms, British spellings, paragraph sentence counts, ellipses inside step text, and unapproved terminology. It cannot check the ASD dictionary, which is the one gate that needs the spec itself. Treat a clean run as necessary, never as sufficient.

## Definition of done

An STE deliverable ships only when all of these hold:

1. Register routed deliberately, and the route is defensible.
2. Every procedural sentence is 20 words or fewer, every descriptive sentence 25 or fewer.
3. Every instruction is imperative, active, one action per sentence.
4. No semicolons, no contractions, no phrasal verbs, no "-ing" verbs, no gendered pronouns.
5. Multi-word nouns are three words or fewer.
6. Safety text names the risk level, commands first, explains second.
7. Terminology matches `approved-terms.md`, with no synonym drift inside the document.
8. `check.py --glossary approved-terms.md` runs clean, or every remaining flag is a deliberate and defended exception.

## Licensing constraint, stated plainly

ASD-STE100 is copyright ASD, Brussels, and the spec grants free reproduction rights only to a defined set of organizations... ASD, AIA, and AIAC member companies and their customers, defense ministries, airworthiness authorities, A4A, and universities for educational purposes. Jiu-Jitsu Outlet and its parent company are not in that set.

What this permits and forbids:

- **Permitted:** using the rules as an internal writing discipline. Methods and standards are not owned. Writing everything in conformant STE, forever, costs nothing and needs no license.
- **Permitted:** referring to rule numbers, and keeping the purchased or downloaded PDF as an internal reference.
- **Forbidden without written ASD authority:** republishing the rule text or the dictionary, bundling the dictionary into Excelsior or any shipped product, or marketing anything as ASD-accredited STE training.

If STE conformance ever becomes a customer-facing feature of Excelsior rather than an internal discipline, that is the point to contact ASD, not before.
