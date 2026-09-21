# Measured traps

Every item here cost real time on the first build of this pattern. None of them
are theoretical.

## The `$'` replacement-pattern bug

`String.replace(pattern, replacementString)` treats `$$`, `$&`, `` $` `` and
`$'` in the REPLACEMENT as patterns. Injecting CSS or JS into an HTML template
this way silently mangles it: `return '$' + ...` became `return '` and every
page died with `Invalid or unexpected token`.

    // wrong
    template.replace(/\{\{PAGE_JS\}\}/g, pageJs)
    // right
    template.replace(/\{\{PAGE_JS\}\}/g, () => pageJs)

curl looked fine. The bundle built fine. Only a browser showed it. This is the
reason "verify in a browser" is a law and not a preference.

## `[[ratelimits]]` is plural

Wrangler rejects the singular `[[ratelimit]]` with `Unexpected fields found in
top-level field` and then simply omits the binding. The Worker still runs, with
the burst limiter silently gone. Grep the dev output for `Unexpected fields`
after any wrangler.toml change.

## Secret-scan false positives

A bare `rk_` pattern matches `netwo` + `rk_advice_code` and `ma` + `rk_uncollectible`
inside the Stripe SDK. Anchor on a left word boundary and require key-shaped
characters after:

    (^|[^A-Za-z0-9_])(sk_(live|test)|rk_(live|test)|whsec_)[A-Za-z0-9_]{8,}

Scan the BUILT bundle, not just source, so anything a dependency drags in is
covered. Build the pattern from concatenated fragments so the scanner never
matches its own source.

## Stripe on Workers

If a Stripe webhook is ever needed: `constructEventAsync` with
`Stripe.createSubtleCryptoProvider()`. The synchronous `constructEvent` assumes
Node crypto and is wrong on Workers. Verify the signature and return 400 BEFORE
touching the database, then claim the event id with `INSERT OR IGNORE` and exit
on `changes === 0` so a replay cannot re-run a side effect.

## The browser pane stalls animation frames

A hidden or unfocused preview pane starves `requestAnimationFrame` and
`IntersectionObserver`, so a sticky bar reads as never-armed and a fresh
observer never fires its initial callback. Take a screenshot to pump a frame,
then re-read. Also: reading the DOM immediately after a scripted navigation
returns the OLD page. Re-read after it settles rather than trusting the first
value.

## A seeded fixture that passes on the wrong key

An hourly rate-limit test "passed" because the seed row was keyed on
`sha256("unknown")` while the running server keyed on `sha256("::1")` ... dev
sets `CF-Connecting-IP` to IPv6 loopback. A seeded test that passes without the
mechanism running is a false green. Assert the key you seeded is the key the
code reads.

## Caching versus per-visitor content

Any response whose body depends on a cookie must send `Cache-Control: private,
no-store` and `Vary: Cookie`. This costs the landing page its edge caching,
which is a real cost on paid traffic and a reason to END a split test rather
than leave it running forever. Say so out loud when proposing one.

## Health should fail loud

`/health` returning 200 when the database answers but the schema is incomplete
is a health check that hides the outage it exists to find. Return 503 with the
table count instead.
