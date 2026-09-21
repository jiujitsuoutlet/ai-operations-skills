# Buyer journey proof

Use this procedure for a payment funnel that creates an account, grants products, or sends access email. Keep credentials, payment details, and customer PII out of durable evidence.

## Choose the proof lane

Prefer an ordinary provider test environment when it exercises the real integration. If the downstream platform or live-mode provider objects cannot be represented there, use isolated staging with the same live-mode integration and an ephemeral 100% test discount. Require an unguessable staging-only authorization value, bind it only to staging, and never add the discount or authorization value to production.

If the operator declines a real charge, do not ask them to buy. Use the isolated no-charge lane when the provider permits it. A completed zero-total Checkout session must require no card and move no money.

## Prove the full chain

Completion requires evidence for every applicable link:

1. The intended offer and any order bump produce the expected line items and total.
2. The payment provider records the session as complete. For a no-charge proof, the amount is zero and no payment method is attached.
3. The webhook reaches the intended environment and passes signature and idempotency checks.
4. The durable order record reaches the correct paid or fulfilled state.
5. Each asynchronous outbox or grant operation succeeds, including retries and idempotent replay behavior.
6. The downstream membership platform reports the exact expected entitlements on readback.
7. A real inbox receives the access message. A provider API `sent` response alone is insufficient.
8. The one-click login link creates an authenticated session for the intended member.
9. At least one purchased course or protected resource opens successfully.

Record non-secret session, event, order, operation, member, and entitlement identifiers with timestamps. Redact email addresses when the evidence leaves the protected project system.

## Clean up the proof lane

After proof, remove all temporary reachability and customer artifacts:

- expire incomplete Checkout sessions when supported;
- cancel test subscriptions and delete or archive mock customers as the provider permits;
- delete the ephemeral discount;
- revoke mock entitlements and remove or soft-delete the mock member;
- disable the staging webhook when it exists only for the proof;
- remove staging-only authorization secrets and confirm the protected route fails closed;
- verify production health and confirm its webhook remains enabled and points to the production route.

Cleanup is part of journey verification, not optional housekeeping. Preserve only bounded, non-secret evidence needed for audit or regression work.

## Failure interpretation

- A Checkout success page proves only the browser redirect.
- A payment-provider event proves only provider-side state until the receiving webhook is observed.
- A successful webhook response proves only receipt until durable order and fulfillment state are read back.
- A successful grant API response proves only the request until exact entitlements are read back.
- A queued or sent email status proves only provider acceptance until the message appears in an inbox.
- A login redirect proves little until the authenticated dashboard and purchased content both load.
