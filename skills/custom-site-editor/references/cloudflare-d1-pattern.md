# Cloudflare Workers and D1 editor pattern

Use this pattern when the site runs as a Cloudflare Worker with D1.

## Modules

- `editor/schema`: allowed pages, node types, value limits, URL/image allowlists, and full-document validation.
- `editor/defaults`: one coded default document per page.
- `editor/renderer`: pure validated document to HTML rendering, plus locked functional block adapters.
- `editor/repository`: load, optimistic draft save, publish, list history, restore, and published-document fallback.
- `editor/auth`: password verification, rate-limited login, hashed sessions, expiry, logout, and CSRF authorization.
- `editor/routes`: login/editor HTML plus authenticated JSON APIs with bounded request bodies and no-store security headers.
- `pages/admin-*`: the nontechnical layer tree, canvas, inspector, device preview, and login UI.

A prior client implementation is the proven reference when available. Adapt its boundaries and tests; do not copy client-specific page keys, offer data, brand tokens, or entitlement behavior.

## Minimum tables

`editor_pages`

- page key and title;
- draft JSON and draft revision;
- published JSON and published revision;
- publish/update timestamps, actor, and last operation ID.

`editor_page_versions`

- immutable version ID, page key, revision, document JSON, checksum, timestamp, and actor;
- retain a bounded recent history, such as 50 versions per page.

`editor_sessions`

- store only a token hash, CSRF token, expiry, last-seen time, and creation time.

`editor_login_attempts`

- hashed network bucket, time window, and count for throttling.

`editor_audit_log`

- actor, action, page key, revision, timestamp, and optional bounded detail.

## Route shape

- `GET /admin/login`
- `POST /admin/login`
- `GET /admin/editor`
- `GET /api/admin/session`
- `POST /api/admin/logout`
- `GET /api/admin/pages/:page`
- `PUT /api/admin/pages/:page/draft`
- `POST /api/admin/pages/:page/preview`
- `POST /api/admin/pages/:page/publish`
- `GET /api/admin/pages/:page/versions`
- `POST /api/admin/pages/:page/restore`

Mutation requests require both the authenticated session and CSRF token. Set session cookies `Secure`, `HttpOnly`, `SameSite=Strict`, and a narrow path. Send editor HTML and APIs with `Cache-Control: no-store`, frame denial, MIME sniffing denial, a restrictive referrer policy, and a restrictive content security policy.

## Migration law

Page keys often appear in a database `CHECK` constraint. Adding a page therefore requires more than inserting a row. Rebuild constrained tables safely, preserve rows, recreate foreign keys and indexes, seed the new page, and run `PRAGMA foreign_key_check` in an integration test. Test the actual migration sequence with foreign keys enabled.

## Document limits

Set explicit maximums for request bytes, sections, rows, columns, elements, text length, list items, spacing, widths, and history. Permit only known element types and style tokens. Sanitize output even after validation. Use an image manifest or owned-media allowlist rather than arbitrary remote URLs.

## Public rendering

The public request path loads `published_json`, validates it again, and renders it. On missing D1, missing publication, parse failure, or validation failure, log a bounded error and use the coded default. Never serve a broken page because the editor document is corrupt.
