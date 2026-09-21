# Breakage sweep checklist

Run every item against what the walk surfaced. Each hit becomes a tiered finding. The tiers: Blocking (breaks the engagement deliverable), Migration debris, Data integrity, Security.

## Money and access (usually Blocking)

- Unmapped paid products: product ids in the checkout system with no entitlement mapping. Count the stranded buyers. This is the highest-value single find.
- Dead content references inside sellable containers: raw UUIDs where titles should render. Buyers of that container get missing content.
- Lead or abandoned-cart capture switched off. Data is being discarded daily.
- Broadcast or campaign email hard-locked off while the engagement plans an email send.
- No conversion pixel set natively, or tracking delegated entirely to a tag-manager container that cannot be audited from the admin.
- No consent gate while pixels fire and traffic is materially EU.
- Failed-charge rate in the recent transaction list. Over ~10% of recent charges failing is a dunning problem and the cheapest revenue available.
- Checkout provider mismatch: ACTIVE provider differs from where the engagement will send buyers. Report the position. Never flip it.

## Migration debris

- Plan or SKU sprawl: many price records for few real offers. Note which legacy plans still carry live subscribers (those cannot be archived casually).
- "Migrated plan" placeholder records.
- Duplicate content records under two naming conventions.
- Duplicate checkout-product mappings pointing at one entitlement (may be intentional legacy SKUs... confirm).
- Large unpublished share of the content library, and recent items missing grouping assignments.
- Empty required stores: media library, home-page rows or categories with zero items.
- Language leakage from the platform vendor's home market in labels, placeholders, and template descriptions.
- Sender-domain mismatch: verified primary sender differs from the address mail actually goes out from.
- Setup checklists showing incomplete steps for integrations that are live and working (signals config drift).
- Features ON but unconfigured: automation engines with zero sequences, survey engines with zero questions.
- Features OFF that the engagement needs: member pause, lead capture, referral programs.

## Data integrity

- Headline counts that disagree across pages (members, revenue, catalog size, program counts). List every version with its source. Add the line: do not quote these without picking a definition.
- Arithmetic impossibilities (7-day metric exceeding the 30-day metric).
- Filters that change results but not the displayed totals.
- Status indicators stuck mid-state ("checking..." that never resolves).

## Security and hygiene

- Secrets rendered in plaintext in the admin UI. Report the exposure, recommend rotation, never copy the value.
- API keys: never-used keys, over-scoped keys (full access, money operations, team management), naming that suggests abandoned experiments. Recommend revocation before any new key is issued.
- Admin roster: unexpected members, stale invitations.
- Refund, cancel, or member-write scopes granted to integrations nobody can name.

## Copy check

- Founding dates and anniversary math against the campaign's claims (footer copyright ranges lie both directions).
