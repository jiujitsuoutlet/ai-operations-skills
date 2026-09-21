---
name: jjo-ad-placements
description: Nejat's locked placement policy for every Meta/Facebook ad campaign, JJO or client. Only four placements are ever approved... Facebook Feed, Facebook Reels, Instagram Feed, Instagram Reels. Everything else is excluded explicitly, including profile_feed, Stories, Audience Network, Marketplace, Search, Threads, and Messenger. Use this skill EVERY time you create, duplicate, or modify a Meta ad set, ad, or creative, and every time you audit an existing campaign's delivery. Triggers on ad set, placement, campaign build, targeting, publisher_platforms, facebook_positions, instagram_positions, Advantage+, automatic placements, duplicate campaign, launch ad, audit placements, where are my ads showing. If a Meta ad object is being written or reviewed, this skill applies... do not skip it because the request seemed simple. Also covers this account's campaign structure defaults, the API-vs-Ads-Manager boundary (never rebuild a hand-edited campaign via API), and the required UTM template for GoHighLevel attribution.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# JJO Ad Placement Policy

## Why this exists

Meta's Marketing API treats an unspecified placement field as permission to use
every placement it has. From Meta's own documentation: if you do not specify
anything for a particular placement field, Facebook considers all possible
default positions for that field... and Facebook may also automatically consider
new positions or platforms as they become available.

Read that second part again. Silence is not neutral. Silence is a standing
grant that expands every time Meta ships a new surface. A campaign built once
and left alone will pick up placements nobody approved.

That is the failure mode this skill exists to prevent. Nejat runs four
placements. Not five. The policy is not a preference to be optimized around...
it is a constraint on every write.

## The four approved placements

| Human name | API platform | API position |
|---|---|---|
| Facebook Feed | `facebook` | `feed` |
| Facebook Reels | `facebook` | `facebook_reels` |
| Instagram Feed | `instagram` | `stream` |
| Instagram Reels | `instagram` | `reels` |

Note the two that trip people up. Instagram Feed is `stream`, NOT `feed`.
Instagram Reels is `reels`, and it is NOT `profile_reels`, which is a different
surface.

## The four blocks

**Default is Facebook only (Nejat, 2026-09-08): "going forward, only do IG if
I specifically say so... mostly we shall just do Facebook."** That makes Block A
(image) and Block B (video) the defaults. Blocks C and D exist for the day he
names Instagram out loud, and not before.

These four rules govern every ad set write. Pick the block that matches what
assets exist.

### Block A... image or static creative only, Facebook only

```json
{
  "publisher_platforms": ["facebook"],
  "facebook_positions": ["feed"]
}
```

### Block B... video assets available, Facebook only

```json
{
  "publisher_platforms": ["facebook"],
  "facebook_positions": ["feed", "facebook_reels"]
}
```

### Block C... image or static creative, Facebook and Instagram

```json
{
  "publisher_platforms": ["facebook", "instagram"],
  "facebook_positions": ["feed"],
  "instagram_positions": ["stream"]
}
```

### Block D... video assets available, Facebook and Instagram

```json
{
  "publisher_platforms": ["facebook", "instagram"],
  "facebook_positions": ["feed", "facebook_reels"],
  "instagram_positions": ["stream", "reels"]
}
```

Reels placements require vertical video. Never add `facebook_reels` or `reels`
to an ad set whose creative is a static image... the placement will either be
rejected or will deliver a badly cropped asset. No video means Block A or
Block C, no exceptions.

## Where the block goes

The placement block lives inside the `targeting` JSON string on
`ads_create_ad_set`, merged with geo and any other targeting. Not in the
separate `placement` parameter.

```
targeting = {
  "geo_locations": { ...whatever the campaign needs... },
  "publisher_platforms": ["facebook", "instagram"],
  "facebook_positions": ["feed", "facebook_reels"],
  "instagram_positions": ["stream", "reels"]
}
```

Instagram delivery also requires `instagram_user_id` on the creative
(`ads_create_creative`). Without it the ad will not serve on Instagram surfaces
no matter what the targeting says. If Instagram positions are set and the IG
user ID is missing, say so before creating the ad rather than after.

## Never approved

Do not add these to any ad set. If a request, a template, a duplicated campaign,
or a Meta recommendation would introduce one, stop and flag it.

- `profile_feed` ... exists under BOTH `facebook_positions` and
  `instagram_positions`. Nejat's explicit words: "NOT profile feed, this is
  garbage." Check both fields.
- `profile_reels`, `explore`, `explore_home`, `ig_search` (Instagram)
- `story` (Facebook), `story` (Instagram)
- `right_hand_column`, `marketplace`, `video_feeds`, `search`,
  `instream_video`, `facebook_reels_overlay`, `notification` (Facebook)
- `audience_network` platform, any position
- `messenger` platform, any position
- `threads` platform, any position
- `whatsapp` platform, any position

## Advantage+ and automation... everything OFF

Nejat's standing ruling (2026-09-08, 6 Week Transformation review): every
automation toggle Meta offers is OFF unless he asks for it by name. Not
"default," not "recommended"... off. This list is the checklist.

| Toggle | Where it lives | How to keep it off |
|---|---|---|
| Advantage+ sales / shopping campaign | campaign | never create one; `OUTCOME_*` manual campaigns only |
| Advantage+ Audience | ad set | `targeting_automation.advantage_audience: 0` explicitly |
| Advantage+ Placements | ad set | explicit `publisher_platforms` + position arrays (Block A/B) |
| Advantage+ Creative enhancements | creative | `degrees_of_freedom_spec` opting out of each feature (list below) |
| Essential enhancements | creative | same spec... they are just a subset of the features |
| Advantage+ creative translation | creative | never pass `translate_text`; Meta rejects it anyway |
| **Multi-advertiser ads** | creative | **NOT settable through the Meta Ads MCP.** Verify in Ads Manager after every API build (see below) |
| Personalized destinations | ad | never set `site_extensions` / destination optimization... covered by the opt-out spec |
| Advantage+ campaign budget | campaign | Nejat uses CBO on purpose (that is the budget, not an automation)... leave it |

### Multi-advertiser ads... the one the API cannot reach

Meta's creative field `contextual_multi_ads` ("Multi-advertiser ads") is ON by
default and lets Meta render the ad inside a carousel of other businesses'
ads. Nejat's words: it stays off, always.

The Meta Ads MCP exposes no way to set it: `ads_create_creative` has no such
argument and `ads_creative_update` only edits name/status/labels. Every
creative built through the API therefore lands with it ON.

Required behavior after any API build or creative swap:

1. Tell Nejat which ads were created, and that multi-advertiser is on them.
2. He turns it off in Ads Manager in one bulk edit: select the ads → Edit →
   Ad setup → uncheck "Multi-advertiser ads" → Publish.
3. Do not report a build as complete without naming this step.

If a future MCP version exposes `contextual_multi_ads`, pass
`{"enroll_status": "OPT_OUT"}` on every creative and retire this section.

### Creative enhancement opt-out spec (what actually passes validation)

`ads_create_creative` takes `degrees_of_freedom_spec` as a JSON string. Meta
rejects the old bundled `standard_enhancements` switch... each feature must be
named. This exact set is accepted as of 2026-09-08:

```json
{"creative_features_spec":{
 "image_touchups":{"enroll_status":"OPT_OUT"},
 "image_brightness_and_contrast":{"enroll_status":"OPT_OUT"},
 "enhance_cta":{"enroll_status":"OPT_OUT"},
 "text_optimizations":{"enroll_status":"OPT_OUT"},
 "inline_comment":{"enroll_status":"OPT_OUT"},
 "image_templates":{"enroll_status":"OPT_OUT"},
 "add_text_overlay":{"enroll_status":"OPT_OUT"},
 "image_uncrop":{"enroll_status":"OPT_OUT"},
 "adapt_to_placement":{"enroll_status":"OPT_OUT"},
 "media_type_automation":{"enroll_status":"OPT_OUT"},
 "product_extensions":{"enroll_status":"OPT_OUT"},
 "description_automation":{"enroll_status":"OPT_OUT"},
 "site_extensions":{"enroll_status":"OPT_OUT"},
 "image_animation":{"enroll_status":"OPT_OUT"}}}
```

Rejected names (do not send): `standard_enhancements`, `translate_text`,
`music`. Do not pass `advantage_plus_creative` at all... the boolean gets
stringified in transit and Meta rejects it; omitting it leaves it off.

Advantage+ Audience is enabled by default on new ad sets and turns `age_min`
and `age_max` into suggestions rather than caps. Always set
`targeting_automation.advantage_audience` to `0`.

Placement-level automation is refused by construction... an explicit
`publisher_platforms` plus explicit position arrays leaves nothing for Meta to
expand into.

## Campaign structure... settle it with the account, not with best practice

Two structural questions come up on every build: how many ads, and whether to
split ad sets by gender. Generic Meta advice gets both wrong for this account.
Check the account first.

### How many ads: many is correct (Andromeda)

Meta's Andromeda retrieval update rebuilt ad selection to handle far larger
creative pools. The effect is visible in this account... agency-built
campaigns and how their spend actually distributed:

| Campaign | Ads | Ads that spent | Top-5 share of spend |
|---|---|---|---|
| MG 6W, Feb 26 | 56 | 56 | 34% |
| MG 6W, Dec 25 | 46 | 46 | 31% |
| Salem FSess, Dec 25 | 98 | 98 | 15% |

Every ad delivered. In the Salem build the top five ads took 15% of budget and
the other 93 split the rest.

**Never tell Nejat that Meta will "pick one or two ads and starve the rest."**
That claim was made in this account on 2026-09-09 and his own data contradicted
it within the hour. Ten to twenty ads per ad set is fine at a modest per-ad-set daily budget. Do not
recommend pruning to 3-6 ads on budget-per-ad grounds.

### Gender split: it wins here

Same geography, same radius, same exclusions, ad-set level:

(Per-ad-set spend, lead, and cost-per-lead figures are omitted from this public copy. Observed: both gender-split ad sets had a lower cost per lead than both combined ad sets.)

Split beat combined by roughly 30% on CPL. Confounded by offer and season, so
not proof... but there is no evidence in this account that consolidating helps,
and reasonable evidence it hurts. Consolidation was recommended twice on
2026-09-09 and withdrawn both times once the account was checked.

**Default shape: gender-split ad sets, each carrying a large creative pool.**
That is the strongest combination this account's history supports.

### Do not use the learning phase as a restructuring argument

Meta's ~50-conversions-per-ad-set-per-week guideline is real but it is not a
cliff. This account's cheapest campaigns ran well below it and produced leads at
the account's best CPL. Cite the threshold as context if asked; never let it drive a
recommendation to merge ad sets, cut ads, or change budget.

## The API / Ads Manager boundary

The Meta Ads MCP cannot do two things Ads Manager can, and both are load-bearing.

| Setting | Via API | Consequence |
|---|---|---|
| `contextual_multi_ads` (Multi-advertiser ads) | **cannot set** | every API-built creative lands with it ON |
| Ad-level URL parameters (the UTMs) | **cannot read or write** | API-built ads ship with no campaign attribution |

**Never rebuild, duplicate, or replace ads through the API on a campaign that
has been hand-edited in Ads Manager.** Doing so silently regresses both of the
above. Structural changes to a live, hand-tuned campaign belong in Ads Manager,
done by Nejat, using Duplicate... which carries URL parameters and creative
settings forward.

**Creative IDs go stale the moment he edits.** Meta creatives are immutable, so
every Ads Manager edit spawns a replacement creative and repoints the ad. On
2026-09-08 one bulk edit replaced all 20 creative IDs in the 6WT campaign. Any
API work must re-read live `creative_id` values with `ads_get_ad_entities`
first... never trust IDs recorded in an earlier session or in notes.

## URL parameters... required on every campaign

This is what makes closed-loop reporting possible at all. Without it,
GoHighLevel records "Social media" and nothing more, and spend cannot be traced
to an ad. Verified working 2026-09-09, the first time in this account's history.

Set at ad level, Ads Manager > Ad > Tracking > URL parameters:

```
utm_source=fb&utm_medium=paid&utm_campaign={{campaign.id}}&utm_id={{campaign.id}}&utm_term={{adset.id}}&utm_content={{ad.id}}
```

GHL stores these on the opportunity's `attributions[]`, where `utm_campaign`,
`utm_term` and `utm_content` join directly to Meta's campaign, ad set and ad IDs.

Pair it with the pixel event on the funnel's confirmation step or the ad sets
optimize with no conversion signal at all. Confirm the event is actually
arriving before trusting delivery:

- `ads_get_dataset_stats` with `aggregation: "event"` lists every event the
  pixel received, by hour. Absence across several settled days means it is not
  firing, not that reporting lags.
- **"Datasets" in Events Manager is what Meta now calls Pixels.** There is no
  Pixels button any more.

## Required behavior on every write

1. Read the creative situation first. Video or no video decides the block.
2. State the chosen block and its four (or two) placements in plain language
   before creating anything. "Facebook Feed and Reels, Instagram Feed and
   Reels" is enough.
3. Never create an ad set with an empty or omitted `publisher_platforms`.
   Omission is the bug, not a shortcut.
4. When duplicating an existing campaign or ad set, do NOT assume the source
   was compliant. Read its targeting, check it against this policy, and report
   any placement it carries that this policy forbids.
5. Re-read live `creative_id` values before touching any existing ad. IDs from
   an earlier session or from notes are stale the moment Nejat edits in Ads
   Manager.
6. If the campaign has been hand-edited, do NOT restructure it through the API.
   Hand it to Nejat as Ads Manager steps instead... see "The API / Ads Manager
   boundary."
7. Before recommending fewer ads, fewer ad sets, or a merge, check this
   account's own numbers. Generic Meta advice has been wrong here twice.
8. End every build report by naming the two things the API cannot set:
   multi-advertiser ads, and the ad-level URL parameters.

## Auditing existing ad sets

When asked where ads are showing, or when reviewing any live campaign, pull
`targeting` on each ad set and check three things in order.

First, is `publisher_platforms` present at all? Absent means Meta is choosing,
and every platform is live including Audience Network.

Second, for each platform present, is the matching positions array present?
`publisher_platforms: ["facebook"]` with no `facebook_positions` means every
Facebook surface, Marketplace and right-hand column included.

Third, do the listed positions match the four approved values exactly?

Report violations as a plain list of ad set name, offending placement, and
whether it can be fixed by update or needs a rebuild. Do not fix them silently.
Placement changes on a delivering ad set reset the learning phase, which is a
real cost Nejat should choose to pay.

## The tradeoff, stated once

Restricting to four placements raises CPM. The auction pool is smaller and
Meta cannot arbitrage impressions into cheaper surfaces. In markets as small as
Mountain Grove and Salem, this compounds with an audience-exhaustion problem
that has already pushed frequency past 7x on several campaigns.

That is the honest cost, and it is worth naming when a campaign's CPM runs high
so the cause is understood rather than mystifying. It is not grounds for
widening placements. Nejat has weighed this. The policy holds. Do not relitigate
it inside a build.

## Definition of done

An ad set is compliant when `publisher_platforms` is explicit, every platform
listed has an explicit positions array, every position appears in the four
approved values, `profile_feed` appears in neither positions field, and Reels
positions appear only where vertical video exists.

A campaign build is done when, on top of that: every automation toggle in the
table above is off, the UTM template is on every ad, the pixel event is
confirmed arriving via `ads_get_dataset_stats`, and Nejat has been told which
steps only he can complete in Ads Manager.
