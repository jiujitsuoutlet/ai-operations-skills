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
Checkout -> webhook -> product-to-access mapping table (Settings > Integrations > Webhooks,
secret status "configured").
| Checkout product          | Grants access to | Buyers (Sales page) |
|---------------------------|------------------|---------------------|
| Guard Fundamentals        | Course: Guard 1  | 214                 |
| Spring Intensive          | (none mapped)    | 12                  |
Meaning: 12 buyers paid and received nothing. Blocking.
DO NOT FLIP: the ACTIVE checkout provider is the internal processor, while the funnel sells
through an external cart. Changing it reroutes every buyer on the pricing page. Reported,
not changed.

### Revenue: what does each widget read?
"Revenue" card, default 30-day range: $3,120. Same card, all-time: $9,480
(Dashboard). The platform's own lifetime figure: $1.2M (Settings > Billing). The card reads
one processor account connected last year. It is a slice, not the business.

## Broken, half-migrated, or left over
Data integrity: member count reads 1,204 (Members > All), 1,187 (Dashboard card),
3,950 (Contacts, includes leads), 1,211 (Analytics). Do not quote these without picking
a definition.
Security and hygiene: 2 API keys never used, 1 with full scope. Recommend review.

## Open questions read-only access could not answer
- Joins vs. cancels: no view exists. Closest proxy: new-member list by created date
  (does not show cancels). Real answer: processor subscription export.
```

## What the example shows

- Zero mutating clicks. A wrong switch is reported with a do-not-flip warning, never corrected.
- Every headline number carries its source page and one cross-check. When pages disagree, all values are reported side by side.
- The most valuable find is paying customers who received nothing.
