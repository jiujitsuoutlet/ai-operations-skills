---
name: ad-voice
description: "Nejat's locked Facebook/Meta ad voice for JJO and client academies/tournaments... paid promo copy with a signup or booking CTA. Use for every ad body, headline, and PS. Triggers on words like ad copy, FB ad, Meta ad, promo copy, ad creative, primary text, PS, PPS, campaign copy, tournament ad, event ad. Distinct from social voice (organic posts) and email voice... do not substitute one for another. ALWAYS read Nejat's own writing before drafting... the whole Google Drive 'AI Training' folder (`<CORPUS_ROOT_FOLDER_ID>`: FB Ads, Social Media Posts, Emails, Podcast Episode Transcripts, Business Context) plus the vault email archive. It grows over time and his own copy outranks the rules written here."
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Ad Voice

Paid ad copy is its own register. Organic posts earn attention with a story. Ads interrupt someone mid-scroll who never asked... so the reason to stop has to be in the first line, and the reason to fear waiting has to be in the last.

Graded standards from live rewrites: "Every Single One" (7/18/26, JJO confidence challenge), the [Client] [City] tournament ad (8/14/26), and the [Client] [City] five-variation set (9/18/26, Nejat's line edits on four Claude drafts). When a new rewrite lands, append it here as the live spec.

## The copy corpus... read it before you draft

Nejat keeps a live corpus of his own writing in Google Drive. **Read it before
writing any ad, every time.** It grows as he adds work, so never draft from a
cached file list or from memory of a previous session.

**His ruling, 2026-09-16:** "you have so much of my writing examples in the AI
training folder, lets use it!" The FB Ads folder alone is too thin... it holds
one of his ads. Draft from the whole tree below, not just FB Ads.

**Root: `AI Training`** ... Drive ID `<CORPUS_ROOT_FOLDER_ID>`
(owner `<OWNER_EMAIL>`)

| Folder | Drive ID | Use it for |
|---|---|---|
| AI Training → Business Context | `<BUSINESS_CONTEXT_FOLDER_ID>` | How he describes his members, offer, and results in his own words (e.g. an agency intake doc: members "come in to get out of their own head," "community for people who don't fit into a regular gym") |
| Data Sources → **FB Ads** | `<FB_ADS_FOLDER_ID>` | His ad copy... structure and readability standard |
| Data Sources → Social Media Posts | `<SOCIAL_POSTS_FOLDER_ID>` | His real personal stories and social rhythm |
| Data Sources → Emails | `<EMAILS_FOLDER_ID>` | His lines on confidence, community, beginners |
| Data Sources → Podcast Episode Transcripts | `<PODCAST_TRANSCRIPTS_FOLDER_ID>` | Real guest quotes (only if actually in a transcript) |
| Data Sources → App Training | `<APP_TRAINING_FOLDER_ID>` | Curriculum and technique transcripts... rarely ad material |

Faster local mirror of the emails: a plain-text email archive (private note, not included)
(98 real sends). The graded voice rules for every register live in
`skills/prompt-preflight/references/voice-specs.md`... read its universal rules
and the two named AI tells before drafting.

### How to read it (Drive connector, verified 2026-09-09, re-verified 2026-09-16)

- `get_file_metadata` with `file_id` = the folder ID confirms access and that
  the folder still exists.
- `list_recent_files` returns recently touched files each carrying `parentId`...
  the fastest way to catch a doc he added minutes ago.
- `search_files` accepts `title contains 'word'`. **`parents` is NOT a supported
  query field**, so you cannot filter by folder in the query. Search a likely
  title word, then keep results whose `parentId` equals the folder ID.
  `'<id>' in parents` fails the same way ("Unsupported query field: parents").
- To find subfolders: `mimeType = 'application/vnd.google-apps.folder' and
  title contains 'word'`, then filter by `parentId`. To find docs anywhere:
  `fullText contains 'jiu jitsu' and mimeType != 'application/vnd.google-apps.folder'`.
- `read_file_content` with `file_id` returns the full document text.

### In the FB Ads folder as of 2026-09-16 (expect more)

| Doc | What it is |
|---|---|
| 6 Week Transformation Challenge Ads | His own "12 men" ad... current gold standard for structure and readability |
| [Agency] Ads | May 2026, 12 Week Summer Program. Agency-written, NOT his voice... reference for offer history only |

Not everything in the folder is a voice standard. Copy he wrote himself is the
standard; copy an agency wrote for him is history. When it is unclear which a
doc is, ask rather than absorbing it.

### Precedence: his live copy outranks this file

When the corpus and the written rules below disagree, **follow the corpus and
say so out loud.** Do not silently resolve the conflict, and do not silently
obey a stale rule... surfacing it is how these rules get updated.

Live example: the "12 men" ad opens with *"Want to transform your life through
the martial arts?"* The Blacklist below still bans "transform your life." He was
shown the conflict and kept his wording. His copy wins; that blacklist entry is
under review.

## Graded correction... Salem 6WT rewrite (2026-09-16)

A 20-ad bank drafted from the FB Ads folder alone came back as "very corny.
needs to be a lot better." What he cut and why it failed:

- **"There's a reason it's called Jiu Jitsu OUTLET 😅"** ... cut outright. Winking
  at the brand name reads as a gimmick. Talk about what members actually get.
- **Invented reassurance in the PS reframe** ("six weeks in, you'll have guys
  texting you when you miss a session"). Plausible, but not his, and not verified.
- **Negation stacking in the PS** ("Jiu Jitsu isn't about fighting... it's about
  staying calm", "not the medals, not the moves", "a skill, not a workout"). This
  is the AI tell he named in voice-specs. It had even shipped in a Mountain Grove
  ad that ran.

The rewrite that followed kept his "12 Men" skeleton and built every PS reframe
from lines he actually wrote: the "Confidence factory" and "cool, calm and
collected" confidence from his confidence email, "a low impact and mind engaging
way to get in shape where you end up meeting some great friends along the
way... all while learning self defense skills that actually work!", the "movie
Fight Club" first-day fear, and his intake description of members coming in "to
get out of their own head." **Rule: the hook can be new, the PS reframe must be
his.** If no line of his fits the objection, use a plain offer fact (4 private
lessons, weekly coach check-in) rather than inventing a benefit.

A quoted objection may contain "not" ("I'm not strong enough")... that is the
PS engine, not the tell. The tell is the reframe defining a thing by what it isn't.

## Two ad shapes, pick the right one

**Local enrollment ads (JJO academy, No Sweat Intro):** short body, length lives in the PS and PPS. Deadline hook, life-level benefit question, offer mechanic, CTA, energy beat, PS, PPS.

**Event and tournament ads ([Client], seminars, competitions):** the body carries the objection arc and runs longer. The PS flips to the audience the body did not address. Usually no PPS... the PS does that work.

Do not import the enrollment structure into an event ad. They interrupt different people for different reasons.

## Structure ... objection-led event ads

Validated across all five [Client] [City] variations:

1. **Hook: a question aimed at a named in-group.** `Jiu Jitsu fanatics:` / `Jiu Jitsu nerds:` / `Competitors:` / `Been training Jiu Jitsu a while but never signed up for a tournament?` Affectionate, slightly self-deprecating naming. One emoji, usually 💪🤔 or 🔥.
2. **The deadline, stated flat.** `The Early Bird special for the [Event] in [City] ends [Date]!`
3. **Objection stack.** Two or three of them, one per line, each its own paragraph. `Maybe you're waiting to feel ready.` / `Maybe you're picturing a room full of savage competitors who have been doing this since they were 6…`
4. **The turn.** A question that reframes. `What if your first one didn't have to feel like that?` / `But you know you want to get back out there?`
5. **Origin line.** `That's why we created [Event]!` Vary it, don't replace it. `This is honestly the whole reason why we created [Event]!`
6. **Event details + why now.** Date, city, and the reason the timing works.
7. **Who it's for.** `These events were created for Jiu Jitsu hobbyists just like you who want a fun outlet for competing and creating some awesome memories with their team.`
8. **`But here's the bad news…`** Its own line. Load-bearing pivot.
9. **Deadline restated + the bonus scarcity.** Early bird ending, free rash guards for the first [N].
10. **Command.** `Sign up before you talk yourself out of it!` / `Get your team registered before the price goes up!`
11. **CTA block.** `Click here to get signed up now:` then ⬇️⬇️⬇️ then the raw link.
12. **PS: flip the audience.** Body spoke to beginners, PS speaks to veterans, and vice versa. Offer detail lives here. Close warm or with a second ask.

## One idea per line

The most consistent edit across every variation. Stacked sentences get broken apart:

> Maybe you're waiting to feel ready. Maybe you're picturing a room full of savage competitors…

became two paragraphs. Never let two ideas share a line. Blank line between nearly every sentence. The copy should read like someone talking with pauses, not like prose.

## Hooks come from inside the sport

The single biggest upgrade in the 9/18 set. Generic marketing urgency was replaced with a lived competition moment:

> 😱 "SHORT TIME SHORT TIME!" 🔥
>
> That's what your coach will probably be shouting at you from the corner towards the end of your match
>
> AND it's also what we are shouting at you NOW because…

Reach for the thing every practitioner has physically experienced... the corner yelling, the weight cut, the drive home, the bracket sheet. Then bend it into the offer. "The clock is running" is what a marketer writes. "SHORT TIME" is what a grappler hears.

## Specifics beat summaries

Stack real, concrete details of the experience rather than naming it:

> If you've driven four hours, paid your entry, cut the weight, recruited all your family and friends to come watch, trained your butt off…. and then gone home after just one quick match?

Not "you already know the problem." `loading up a van with your training partners`, not `loading up with your training partners`. The van is the whole line.

## React plainly, don't analyze

> You know how much that stinks!

Not "you already know the problem." When the copy hits the pain, the next line is an emotional reaction with an exclamation point, not a summary of what was just described.

## Closers: stop, don't land

**No aphorisms. No earned wisdom. No poetic button.** Four were cut from the 9/18 drafts:

- ~~there's a bracket with your name on it~~ → `there's a bracket for you`
- ~~Everybody gets matches. Everybody gets better.~~ → `Help us fill this event by sharing this post with your team!`
- ~~And you'll leave a better grappler than you showed up.~~ → `Whatever level you're at, we want you!`
- ~~They just picked a date and let the date do the work.~~ → `They just made a decision to step out of their comfort zone and do something new.`

The pattern: replace the clever line with either a plain warm invitation or a direct ask. If a closing line sounds like it belongs on a poster, it is wrong for an ad.

**Parentheticals that editorialize get cut too.** `(Ask anybody who's done it… the ride home is the best part, win or lose.)` was deleted. Sneaking emotional hits into parentheticals is a long-form and social rule. Ads keep momentum instead.

## Secondary asks

Coach and team-directed ads can close the PS with a share request rather than a click:

> Help us fill this event by sharing this post with your team!

Use when the reader is a multiplier (coach, team captain, parent of a whole carload), not when they are the buyer.

## The benefit is life-level

Sell who they become, not what happens at the event.

> Want to build some confidence and have a good reason to get out of bed every morning?

Not "beginner divisions are matched by skill so you'll be safe." That's reassurance, and reassurance is a PS job.

`first (or next)` is the standing move for addressing beginners and veterans in one line without splitting the ad.

## Say exactly what happens after the click

Describe the real mechanic in plain words. "The code appears on the next page." Never dress up the delivery method, never inflate it with timing theater ("texted to you in about 10 seconds"). Overselling the mechanic is how an ad starts sounding like a funnel.

## The PS engine

Two validated patterns.

**Objection-flip PS (enrollment ads):**

1. Name the objection in quotes... `"I'm not ready" is the most common thing we hear`
2. `and let's be real…` then agree with them
3. Reframe the objection into the reason to come
4. **Balance winning AND losing.** Non-negotiable. `You might take gold. You might lose fast and learn more in that one match than in a month of open mats…`
5. `Both of those rides home are worth taking.`
6. CTA + ⬇️⬇️⬇️ + link

**Audience-flip PS (event ads):**

1. Address the segment the body ignored. `PS. Not your first rodeo? We have plenty for you too!` / `PS. Newer competitors, don't read this and think it isn't for you.`
2. The offer detail that matters to them... divisions, brackets, what the discount frees up
3. Warm close or share ask. Never an aphorism.

PPS = real scarcity proof (sell-out history, capacity limits... true ones only), then the deadline consequence, then a command. Optional on event ads.

## Cold-audience language

Insider jargon gets plainer for people who have never trained or competed. "Get subbed" becomes "lose fast." "Roll" becomes "train." Brand vocabulary rules still hold internally... academy, team members, training sessions, aggression... but an ad reaching strangers uses the words a stranger already owns.

Exception: when the hook is deliberately in-group ("SHORT TIME," "Jiu Jitsu nerds"), the jargon IS the targeting. Warm audiences and past competitors get the insider version.

## Mechanics

- **Emoji as punctuation:** 🥋 opens · 🔥 marks the deadline · 💪 marks energy · 🤔 marks the question hook · 😱 marks a shouted line · ⬇️⬇️⬇️ before every link. Never stacked decoratively.
- **CAPS for emphasis:** BEST, EXACTLY, ON TOP, SOLD OUT, NOW. Also sentence-initial `AND` for an additive beat... `AND we made it super affordable to sign up for a ton of extra divisions`.
- **Questions over statements.** `Do you want to stack your day?` beats `If you want to stack your day`. `Want a serious challenge? Do the elite bracket!`
- **Conversational call-outs:** "Here's the secret:", "Here's what's crazy:", "Spoiler alert:", "let's be real…"
- **Double CTA minimum.** Body and PS both close with arrows and the link.
- **Ellipses for pacing. Never em-dashes.** Anywhere.
- **Direct imperatives** over soft invitations. "Sign up before you talk yourself out of it!" not "check it out if you're interested."
- **POV:** JJO page = we/us. Client academy pages = we/us in their voice. Personal profile = I/me.
- **Never state a dollar price.** Name the deadline and the discount, not the number. `The early bird discount leaves you money for extra brackets` works. `$[X] instead of $[Y]` does not. For JJO enrollment, CTA is the funnel link or a No Sweat Intro.
- No closing signoff after the last block. The last thing on the page is the command or the ask.

## Blacklist

crush your goals · transform your life · fitness journey · burn calories · beast mode · warrior within · unlock your potential · synergy · elevate · controlled intensity

*Under review where it collides with his own copy... see "Precedence" above. `transform your life` currently appears in his gold-standard "12 men" ad and is therefore NOT a blocker when he wrote the line himself.*

## Compliance

No income claims, no guaranteed results, no medical claims. Scarcity must be true... "SOLD OUT before" requires an actual sell-out, and a countdown like "only [N] rash guards left" requires a verified count. Event-format claims (double elimination, division structure) must be confirmed for the specific event before they run. Kids content stays parent-directed and inclusive ("kids," "teens," wide age ranges... never "boys"). Real testimonials only.
