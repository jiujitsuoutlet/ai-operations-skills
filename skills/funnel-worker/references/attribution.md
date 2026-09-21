# Attribution across a third-party cart

The point: when the cart owns the purchase, a split test that only counts clicks
measures the wrong thing. The variant has to ride the handoff and come back.

## The three places it must live

1. **On the lead row**, written at capture time, taken from the server's own
   cookie in preference to anything the client sends. A forged body value must
   lose to the cookie.
2. **On the outbound cart URL**, as the cart's custom-data parameter. For
   ThriveCart that is `passthrough[variant]`; send `utm_content` alongside it,
   because it survives more systems than any single vendor field.
3. **On the order row**, written by the cart's webhook. Add the column before
   the webhook exists, so un-shelving is a code change and not a migration.

## What to verify with the cart, and say plainly you have not

Never imply a vendor field is confirmed when it is not. The four questions:

- does the platform accept the parameter on the cart URL at all, and in which
  form (bracketed, flat, differently named)
- does it survive URL encoding (`passthrough%5Bvariant%5D`)
- does it appear in the WEBHOOK payload, not only in the dashboard
- does it survive the upsell chain, when the purchase that matters is three
  pages later

## Assignment order

1. `?v=a` / `?v=b` forces a variant, sets no cookie, is never counted
2. an existing cookie wins next, so a returning visitor is stable
3. crawlers get the control variant, uncounted... a preview fetch in the
   denominator quietly biases the split
4. everyone else gets an unbiased coin, is cookied, and is counted once

Decide in the Worker before rendering. No client redirect, no flash of the wrong
page. Count visits only on assignment, so the conversion denominator is a real
number rather than an inference.

## What to tell the operator about power

Say this before they run it, not after they act on it:

- detecting 2% to 3% on purchases at 80% power needs roughly 4,700 visitors PER
  ARM; 2% to 2.4% needs around 30,000 per arm
- lead capture rates (20 to 40%) surface a real difference in a few hundred per
  arm, but answer "which page collects more emails", not "which earns more"
- peeking daily and stopping on a good result produces a false positive near
  half the time; fix the stopping point before starting
- at low volume the honest value is the plumbing: proving the variant reaches
  the webhook, the split is even, the cookie holds
