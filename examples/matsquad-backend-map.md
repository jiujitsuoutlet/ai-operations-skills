# Example: matsquad-backend-map

> **Illustrative example.** A fictional course platform with invented numbers, written for this portfolio from the skill's procedure and report template. It is not a real client map.

Skill: [`skills/matsquad-backend-map`](../skills/matsquad-backend-map/SKILL.md)

## Invocation

```text
Run a diagnostic. Map this admin. (A human has already logged in; the tab is open.)
```

## Sample output (excerpt from the delivered markdown map)

```markdown
# Example Academy / Example Course Platform backend map

Captured: 2026-10-06, read-only pass through the admin at <ADMIN_URL>.
Method: navigation and page reads only. No settings changed, no member records opened,
no exports run, nothing sent.

## Priority answers

### Access: what grants access when someone buys?
Observed: checkout -> webhook -> product-to-access mapping table
(Settings > Integrations > Webhooks, secret status "configured").
| Checkout product          | Access mapping shown | Purchases (Sales page) |
|---------------------------|----------------------|------------------------|
| Guard Fundamentals        | Course: Guard 1      | 214                    |
| Spring Intensive          | (none visible)       | 12                     |
Potential fulfillment gap: 12 purchases are associated with a product with no visible
access mapping. Verify actual buyer entitlements and alternate fulfillment paths before
concluding access was not delivered.
Why read-only access cannot settle it: confirming entitlements means opening individual
buyer records, which this map does not do. Access may also be granted by a path this
admin does not show (manual enrollment, a bundle, an outside tool). Listed under open
questions for the client.
DO NOT FLIP: the ACTIVE checkout provider is the internal processor, while the funnel
sells through an external cart. Changing it would reroute every buyer on the pricing page.
Reported, not changed.

### Revenue: what does each widget read?
Observed: "Revenue" card, default 30-day range: $3,120. Same card, all-time: $9,480
(Dashboard). The platform's own lifetime figure: $1.2M (Settings > Billing).
Observed: Settings > Payments lists one processor account, connected last year, as the
card's data source.
Inference: the card likely reflects only that account, so it is a slice of the business,
not the whole. Confirm against the processor's own reports.

## Broken, half-migrated, or left over
Data integrity: member count reads 1,204 (Members > All), 1,187 (Dashboard card),
3,950 (Contacts, includes leads), 1,211 (Analytics). Do not quote these without picking
a definition.
Security and hygiene: 2 API keys show "last used: never", 1 with full scope.
Recommend review.

## Open questions read-only access could not answer
- Did the 12 "Spring Intensive" buyers receive access by another route? Check a sample
  of buyer entitlements (client-side, or with the client's permission).
- Joins vs. cancels: no view exists. Closest proxy: new-member list by created date
  (does not show cancels). Real answer: the processor's subscription export.
```

## What the example shows

- Zero mutating clicks. A wrong switch is reported with a do-not-flip warning, never corrected.
- Every headline number carries its source page. When pages disagree, all values are reported side by side.
- The report keeps what was **observed** apart from what is **inferred**. A missing mapping is flagged as a potential fulfillment gap to verify, not reported as proof that buyers went without access.
