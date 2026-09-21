---
name: secretless-static-deploy
description: Use when deploying a client-side app so no secret can ever reach the hosting platform... prebuilt static deploys, built-bundle secrets scans, and host keying traps. Triggers on words like deploy, Vercel, static hosting, prebuilt, bundle scan, publishable key, env leak, secrets scan, promote production.
---

# Secretless Static Deploy

The pattern: the hosting platform never holds a secret because it is never
given one. Build locally, ship only the built static output, keep every
privileged operation on a backend that holds its own secrets.

## The pattern

- Build the bundle locally from a gitignored .env. Deploy the PREBUILT static
  output... the host receives files, not environment variables.
- Only browser-safe publishable keys are inlined into the client. Anything
  privileged lives behind server-side functions on the backend platform, never
  on the static host.
- Rollback becomes trivial: redeploy the previous built bundle.

## The secrets scan (before every deploy, no exceptions)

- Grep the BUILT output for secret patterns before shipping: secret-key
  prefixes, service-role tokens, `-----BEGIN ... PRIVATE KEY`, provider
  credential prefixes. Any hit aborts the deploy.
- After swapping environments or rotating keys, scan BOTH directions: the new
  publishable key present, the old environment's key ABSENT.

## Host keying traps (Vercel edition)

- The Vercel CLI keys the project off the literal name of the folder you deploy
  from. Deploying from a folder named "deploy" once created a stray project by
  that name... always deploy from a folder named exactly like the project.
- Check what you actually deployed: a preview shows `"target": null`;
  production is an explicit `--prod`. Never promote by accident.
- Preview URLs sit behind the platform's SSO wall and expire... capture any
  evidence from them immediately.
- After promoting, verify the live URL actually serves the NEW bundle hash
  before reporting the deploy done.
- For a locally built Vite bundle, `--prebuilt` requires Vercel Build Output
  under `.vercel/output`, with `config.json` declaring Build Output API v3 and
  the exact `dist` contents under `.vercel/output/static`. Run the deploy from
  the already-linked project folder, not from the app source folder. Inspect
  the resulting deployment until it is `Ready`, then verify the stable project
  alias returns the expected title and entry asset hash. This catches a
  deployment-not-found link, a stray project, and a stale alias before handoff.

## Related

`verify-before-asserting` (the post-deploy bundle-hash check) ·
`perf-measurement-hygiene` (previews carry injected platform chrome that fakes
regressions) · `supabase-field-notes` (where the server-side secrets live).
