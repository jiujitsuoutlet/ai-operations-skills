---
name: excelsior-chrome
description: Use when styling, restyling, or typographing any Excelsior app surface... fonts, type systems, buttons, cards, labels, contrast, layout at mobile widths, design tokens, material language. Triggers on words like typography, font, chrome, restyle, contrast, token, card, button, label, CTA, type system.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Excelsior Chrome and Typography Craft

MAD wins on conflict. Donor canvas surfaces are NEVER restyled... this skill governs
the frame around the painting, not the painting.

## The app's material language (speak it, don't invent a new one)

- Register (ratified): retro game, Duolingo warmth, Mario World candy. "Gamer
  Points" is the ratified name... never propose renaming.
- The vocabulary that already exists: glass/candy orb bodies (saturated mid-band,
  limb darkening, one tight specular), portal-edge glow, starfield/nebula haze,
  module-color accenting, dark space grounds with candy-bright foregrounds.
- One dialect per screen. If glass and flat both survive on one surface, the work
  failed. Every color, radius, face, and spacing value draws from the token set...
  a one-off hex or px value in a component is a defect.

## Font engineering (self-hosted, always)

- No CDN fonts or icon libraries, ever... self-host woff2 in the app's public
  assets. A runtime third-party dependency is a reliability defect, not a style
  choice.
- Subset aggressively (pyftsubset/glyphhanger): latin basic + punctuation the app
  actually uses. Budget: <= 150KB total added payload; report per-face.
- Load discipline: <link rel="preload" as="font" crossorigin> for each face;
  font-display: swap; provide a size-adjusted fallback (ascent-override/
  descent-override/size-adjust on a local fallback @font-face) so the swap causes
  zero CLS. Verify CLS with a cold-cache Lighthouse or equivalent run... claimed
  swap behavior is not proof.
- Three roles, no more: display (character, used with restraint... wordmark,
  screen titles, eyebrows), body (refined, quiet), utility (data, chips, code).
  Display face never appears inside donor canvas renders.

## Contrast proof (measured, never eyeballed)

- Floor: 4.5:1 WCAG relative-luminance ratio for all text.
- Against gradients, bursts, or animated backgrounds: sample the RENDERED pixels
  behind the text at the background's brightest state (the LUMEN lesson... the
  portal burst cycles), take the worst-case sample, compute the ratio from that.
- Fixing contrast by dimming a LUMEN-governed surface is banned... fix the chip/
  plate/text treatment instead.

## Layout battery

- Every touched screen proven at 390, 401, and 430px widths: zero collisions,
  clips, or overflows, by screenshot battery... the shipped Session Times crowding
  and the Map-pill/chevron collision are the named defect classes.
- Tap targets never shrink below 44x44 CSS px under any restyle; a restyled
  control keeps its census identity (same test, same selector contract).

## Copy hygiene (the full extent of copy authority)

- Casing, stray punctuation, consistency... nothing more. Title-case lesson names;
  kill stray hyphens ("Lesson Name - venue suffix" class). No renaming, no new
  voice, no feature copy... those are founder decisions.
- Controls say what they do ("Enter Lesson", not "Submit"); an action keeps its
  name through the whole flow.

## Known failure modes (this codebase's history)

- CSS specificity cancellation between section-level and element-level selectors
  (paddings/margins)... structure selectors deliberately, audit computed styles.
- Two materials on stacked pills (the splash CTA defect)... one material per
  cluster.
- Restyling a control and silently breaking its census selector... run the census
  after every chrome pass, not just at ship.
