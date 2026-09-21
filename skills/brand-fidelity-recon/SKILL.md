---
name: brand-fidelity-recon
description: Extract a live site's real design system by measuring it in a browser, then build against the measured values instead of a verbal description. Use before styling anything that has to match an existing brand... a client landing page, a funnel, an email template, a microsite, a page that will sit beside the real site. Also use when a brief describes a site's look in words, when someone says "match our site", and when a measurement contradicts what the brief claims. Triggers on words like match the site, brand colors, palette, design system, brand fidelity, house style, look like their site, hex codes, type scale, letterspacing, computed styles, on-brand.
---

# Brand Fidelity Recon

A design built from a description of a site is a guess. Measuring takes about
ten minutes and removes an entire rebuild cycle. On the build this came from, a
whole visual system was authored from the words "dark, clean, benefit-forward"
and had to be thrown away: the invented gold accent was actually red `#dc2626`.

**Never design a brand match without loading the site first.** If the site
cannot be reached, say so and use obviously-neutral placeholder tokens rather
than inventing a palette that will read as the brand's.

## The procedure

1. Open the live site in the browser tool.
2. Run `assets/measure-site.js` in the page (paste it as the script payload).
   It returns palette, type scale, and the structural devices.
3. Re-run at a mobile width AND a desktop width. Sites step at breakpoints; one
   sample gives you half the scale.
4. Screenshot the sections you intend to echo.
5. Write the measured values into the design tokens as the FIRST edit, before
   any layout work.

## What to measure, beyond colors

Palette is the easy part and the least of it. The things that actually make a
page read as someone's brand:

- **Structural devices.** Announcement bar, eyebrow badge, section kickers,
  diagonal section transitions, numbered badges, stat cards, ticker bands. Find
  them via `clip-path`, `transform`, and repeated small-caps labels.
- **The mechanism, not the impression.** A diagonal built as a percentage
  `clip-path` on an oversized clipped div scales differently from a fixed-degree
  skew. Copy the mechanism and it behaves like theirs at every width.
- **Type treatment.** Weight, transform, tracking and leading together. Heavy
  uppercase at `-.04em` and `.88` line-height is a look; the font family alone
  is not.
- **Absences.** If their buttons have no shadow, the shadow you added is yours,
  not theirs. Record what is NOT there.
- **Line breaking.** Explicit per-line spans mean headlines break on meaning.
  Reproduce that with real breaks rather than `text-wrap: balance`.

## Report the numbers, and correct the brief when they disagree

Report every value as measured: hex codes, radii, tracking, the type scale at
both widths, the transition geometry. State plainly which values you are least
confident about, and why (usually: sampled at too few widths).

When a measurement contradicts what the client believes, say so with the
evidence and do not quietly build either version. On this build the brief called
for "a darker muted red for the final headline line"; the page had exactly three
reds, all the same hue, and the headline carried an inline `color:#dc2626`
identical to the buttons. The right move is to show the markup, offer the
explanation (heavy glyphs on black read darker than a filled button), and ask
for a value rather than inventing one. See `flag-conflicts`.

## Accessibility check while you are in there

Brand colors are frequently below contrast thresholds. A saturated red on black
lands near 3.3:1... fine for large display type, a failure for body copy. Carry
the accent in rules, badges and large headings; keep small text on the neutral
ramp. Note it in the report rather than silently deviating.

## Related

`funnel-worker` (the usual consumer of this) · `flag-conflicts` ·
`verify-before-asserting` · `excelsior-chrome` (the in-house equivalent for the
Excelsior app's own system)
