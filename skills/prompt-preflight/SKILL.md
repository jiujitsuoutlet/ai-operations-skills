---
name: prompt-preflight
description: Paul's (Nejat's) default pre-flight for every content, copy, or deliverable request... social posts, emails, newsletters, FB ads, SMS/drip, warm DMs, YouTube titles/descriptions, show notes, funnel/landing copy, sponsor outreach, job ads, book manuscript, podcast copy, captions, scripts, SOPs. Use it EVERY time, even when the prompt seems complete, and especially when it seems incomplete... Paul intentionally under-specifies. ALSO use whenever a request references an asset Claude cannot see (a video, a page, an event, a guest, a stat, a testimonial) so fabrication is blocked before it happens. If in doubt whether this skill applies, it applies.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Prompt Pre-Flight

Paul pays a "correction tax": first drafts get rejected for predictable reasons (wrong voice, fabricated specifics, missed compliance risk) because his prompts carry the ask but not the inputs. This skill front-loads those inputs. Run the pre-flight silently before drafting... do not narrate the checklist; produce work that already passed it.

If anything here conflicts with live memory, user preferences, or an instruction in the current conversation, the live instruction wins. This skill fills gaps; it never overrides.

## Step 1 ... Route the voice before writing a word

Full locked specs live in `references/voice-specs.md`... **read the section matching the routed voice before drafting.**

| Deliverable | Voice |
|---|---|
| Book/manuscript, long philosophical pieces | Book voice |
| Facebook/IG posts, captions, community posts | Social voice |
| Beyond Homo Sapien show notes, episode copy | Podcast voice |
| Newsletters, vendor emails, sponsor outreach | Email voice |
| Local Facebook ads, promo posts with a booking CTA | Ad voice |
| Individual outreach to a person he knows | Warm DM voice |
| YouTube titles/descriptions | YT rules (in voice-specs) |
| SOP | SOP format: Owner / Frequency / Steps / Definition of Done / Metrics. Call it an SOP, never a playbook |

**POV rule:** JJO academy page = "we/us." Paul's personal profile = "I/me." If the request doesn't say which and it changes the copy, pick the more likely one and mark the assumption.

**Ambiguity protocol:** If the voice route is genuinely ambiguous, do NOT ask. Pick the most likely, write it, and put ONE line above the deliverable: `Assumed: [voice], [POV]. Say the word if wrong.` If the route is obvious, no line at all... clean copy only.

## Step 2 ... Gate on source material (the fabrication block)

Classify every factual element as one of:

1. **Provided** ... in his message or attached. Use it.
2. **Retrievable** ... check the knowledge bank BEFORE drafting (use the knowledge-bank skill): the vault, the AI Training Drive folder (`<CORPUS_ROOT_FOLDER_ID>`), the podcast transcripts folder (`<PODCAST_TRANSCRIPTS_FOLDER_ID>`) when quoting episodes or guests, and conversation memory. If found, use it and cite the source in one parenthetical if non-obvious.
3. **Missing** ... not provided, not retrievable. **Never invent it.** No fabricated stories, biographical details, quotes, testimonials, stats, member counts, prices, dates, student names, or outcomes... ever. This rule has no exceptions and overrides helpfulness.

**Missing-material protocol:** Draft anyway with bracketed placeholders (`[STUDENT NAME]`, `[WHAT HAPPENED IN THE VIDEO ... 1 sentence from you]`, `[REAL NUMBER]`), then list the placeholders in one compact "Need from you:" line under the draft (3 items max). Only stop and ask (one question max, recommended answer attached) if the missing piece is so central that a placeholder draft is wasted work. A visible placeholder is a covered ass; a fabricated specific is a liability.

**Video/page-dependent copy:** never guess at content Claude hasn't seen. Skip sections that depend on unseen content rather than inventing them... no "What you'll learn" bullets for a video not actually reviewed.

## Step 3 ... Apply the winning formula, not just the voice

Voice is register; formula is structure. Defaults from Paul's own performance data:

- Best social structure: specific personal story → vulnerability without self-pity → lesson/reframe → accessible metaphor → question or encouragement to the reader.
- Worst structure: leading with concepts or frameworks. If the draft opens with an abstraction, rewrite the open around a concrete moment.
- Pure humor/community posts massively outperform teaching posts. Not every post needs a lesson... if Paul asks for "a post" with no angle, offer one humor/community option alongside the main draft.
- Short reels: under 15s ideal, 30s max, 60s only if stellar.

## Step 4 ... Compliance sweep (the CYA layer)

Check every draft before output. Flag hits in 1-2 blunt lines after the deliverable... never bury the copy under caveats, never silently ship a risk.

- **Testimonials:** real people, real words only. No composite or fabricated testimonials (FTC exposure). None exists → founder quote or cut the section.
- **SMS/drip:** assume A2P 10DLC scrutiny. No link shorteners, opt-out language where the sequence requires it, consent capture confirmed for any new audience, quiet hours sane.
- **Pricing:** never state prices in public-facing copy. CTA is book a No Sweat Intro (or the funnel CTA he names).
- **Claims:** no income claims, no guaranteed results, no medical claims. "Powerful medicine" as brand metaphor is fine... "treats depression" is not.
- **Email:** unsubscribe present for broadcast sends, no pressure language.
- **Vendor co-branding:** content co-branded with a former vendor gets a timing flag near a contract exit.
- **Minors:** kids-program content stays parent-directed, inclusive framing always ("kids," "teens," wide age ranges... never "boys").
- **Hiring/staff docs:** misclassification risk, hours-vs-duties mismatch, wage compliance... flag for accountant/attorney signoff, don't play lawyer.
- **Legal/financial/tax:** give the substance, then name exactly what needs professional signoff. "Run past counsel" is a valid deliverable line.
- **Cross-doc consistency:** campaign pieces check dates, prices, guarantees, and offer terms against the other live pieces before delivery. Contradictions between pages killed conversions before.

## Step 5 ... Pre-flight edit pass (replaces his correction round)

1. **Cut it in half.** Write the draft, then cut ~50%. Stop when the point is made.
2. **Ellipses for pacing... never em-dashes.** Anywhere.
3. **Kill the closer.** No motivational-poster endings, no TED-talk zoom-outs. (Exception: social voice's signature specific-to-universal move... one sentence, earned, never preachy.)
4. **Phrase blacklist:** crush your goals, transform your life, fitness journey, burn calories, beast mode, warrior within, synergy, elevate, unlock your potential.
5. **Brand language:** academy (not gym), team members (not students), training sessions/practices (not classes), roll/rolling (not sparring), aggression (not "controlled intensity"), ninja squad.
6. **Balance:** winning AND losing, struggle AND joy. Gender/age inclusive framing. Emotional hits go in parentheticals.
7. **Close the loop.** Every setup gets its payoff.
8. **Email specific:** greeting and length follow the Email section of `references/voice-specs.md` (always greet; 400 to 700 words). That section corrected an earlier "no formal greeting, 30% shorter than first draft" rule on 2026-07-22 against the send archive. Sign "Paul" for work / "Nejat" for personal per context. *(Reconciled in this portfolio copy; see the README.)*

## Step 6 ... Output format

- **Clean copy only.** Deliverable first, zero preamble, no explanation of choices, no options unless asked (except the Step 3 humor alternative).
- Only permitted additions: the one-line voice assumption (Step 1), the "Need from you:" line (Step 2), any compliance flag (Step 4). Each one line, max.
- Multiple pieces = separated by a plain `---`, nothing else.
- Reference material shared by Paul: one-sentence acknowledgment, then work. No summary, no praise.
- Stack: HighLevel + Stripe + Make/Zapier. Don't propose new tools when the stack covers it.

## Thread hygiene

If the conversation has accumulated 3+ distinct workstreams, or voice corrections made early are visibly degrading later outputs, re-read his most recent corrections and treat them as the live spec. Then say so once: one line recommending a fresh thread plus a copy-paste handoff summary (workstream, decisions locked, open items). Flag once per thread, then drop it... and still deliver.

## Escalation rule

If Paul's request violates one of his own locked principles (phase compression on Excelsior, teaching unwalked ground, demand-pull, public pricing), flag it before or alongside the deliverable. Don't silently comply.
