---
name: custom-site-editor
description: Build or extend a secure drag-and-drop visual page editor inside a custom-coded client website. Use automatically when creating a bespoke website, funnel, landing page, or campaign site whose owner will need to change copy, typography, images, spacing, section order, columns, or page layout without editing code.
---
> **Portfolio copy:** names, IDs, and business figures are replaced with placeholders or relative wording. The procedure is unchanged.

# Custom Site Editor

Treat owner editing as part of the website, not a later enhancement. Unless the user explicitly opts out, include the editor in the original architecture, estimate, database, routes, tests, deployment, and handoff.

## Default outcome

Give the owner a private browser interface that can:

- select every customer-facing page;
- edit copy, headings, lists, links, images, font choices, colors, spacing, alignment, and widths;
- drag elements between columns and reorder elements, columns, rows, and sections;
- add, duplicate, hide, and delete ordinary content blocks;
- preview desktop, tablet, and mobile layouts;
- save a draft without changing the live page;
- publish deliberately, view version history, undo and redo, and restore an earlier version.

Use plain labels and direct manipulation. Do not expose source code, JSON, database terminology, or deployment controls to the client.

## Preserve application truth

The editor owns presentation and approved content. Server code continues to own prices, product identifiers, checkout behavior, entitlement mappings, legal destinations, analytics identifiers, secrets, and other functional configuration.

Render protected functional elements as locked blocks whose labels explain what the server supplies. Never let editable text become the authoritative price or payment configuration. When marketing copy displays a price, derive it from the same server-owned offer configuration used for Checkout.

Locked does not mean immovable or single-use. Represent checkout forms, price panels, offer actions, legal blocks, and other protected behavior as server-owned component references. Let the owner safely move or repeat an approved protected component when the page design needs a second call to action, while keeping its product, amount, routing, and behavior immutable. Repeating the reference must not duplicate a charge, webhook, product, or mutable configuration.

## Architecture contract

Store a validated, versioned page document with this hierarchy:

`page -> sections -> rows -> columns -> elements`

Use stable IDs for every node. Keep draft and published documents separate. The public page reads only the last valid published document and falls back to the coded default if storage is unavailable or invalid. Use optimistic revision checks so two browser sessions cannot silently overwrite each other.

For Cloudflare Workers and D1, read [references/cloudflare-d1-pattern.md](references/cloudflare-d1-pattern.md). For another stack, preserve the same boundaries using its native database, session, and deployment primitives.

## Build with the site

1. Inventory every public page and classify each field as editable content or protected behavior.
2. Define the document schema and coded defaults before building the inspector UI.
3. Make the public renderer and editor preview use the same rendering contract.
4. Add authenticated admin routes, draft/publish APIs, version history, audit records, and rate-limited login.
5. Seed every page in the same migration that introduces it. Update database constraints, page registries, defaults, dropdowns, and tests together.
6. Add the editor link and login instructions to the client handoff.

Keep a one-column row one column unless the owner explicitly adds another column. Reordering or duplicating elements must not silently change the row structure. Bound negative spacing and other layout controls, but allow the range the approved design actually needs; validate the resulting desktop, tablet, and mobile renders for clipping and overlap.

Do not build two independent page implementations. The live page must consume the editor's published document, and the preview must remain visually faithful to that same renderer.

## Verification

Before calling the editor complete, prove:

- unauthorized editor and API requests fail;
- login throttling, secure cookies, session expiry, CSRF checks, and logout work;
- copy and font edits survive reload and affect only the draft until Publish;
- drag-and-drop ordering survives reload and renders identically on the public page after Publish;
- stale revisions return a conflict instead of overwriting newer work;
- restore creates a new draft and does not destroy history;
- malformed documents, unsafe URLs, unknown elements, oversized payloads, and unapproved images are rejected;
- protected commerce and legal blocks cannot be altered through browser payloads;
- every registered page loads in the editor after applying all migrations;
- mobile, tablet, and desktop preview modes have no overflow or unusable controls.
- approved protected component references can be moved and repeated without exposing or copying their functional configuration;
- image uploads survive reload, publish with stable owned-media identifiers, and render on the public page with a defined fallback;
- a failed save or publish keeps the unsaved draft in the browser, shows the actionable server error, and can be retried safely;
- login succeeds in a fresh browser session without a cookie-path or redirect loop;
- the public page reports or exposes enough revision evidence to prove that it rendered the exact published revision rather than a stale cache or coded fallback.

Publish one harmless copy or spacing change in staging, verify it publicly, restore the original version, and verify the restoration. In production, verify login and read-only loading; do not publish a visible test change unless the current task authorizes it.

When production publishing is authorized, do not trust the button label alone. Wait for the publish response, read back the published revision, load the public URL in a fresh or cache-bypassed session, and compare it with the editor preview at desktop, tablet, and mobile widths. If they differ, inspect the stored published document, renderer selection, route/environment binding, and cache behavior before changing the content again.

## Handoff

Return the live editor URL, explain the draft/publish distinction in one sentence, identify which blocks are intentionally locked, confirm where the admin credential is stored, and record the recovery/rotation method without putting credentials in source control or project documentation.
