# Backend map: report template

Use this exact skeleton. Renumber sections to match the platform's actual nav. Keep every number sourced.

---

# [Client] / [Platform] backend map

Captured: [date], read-only pass through the admin at [admin URL].
Captured by: [name], [access level].
Method: navigation and page reads only. No settings changed, no member records opened, no exports run, nothing sent.

## 0. Platform identity and access

- Platform name and vendor. Multi-tenant or self-hosted.
- Live domain(s), default tenant URL, SSL state.
- Backend team roster: who has admin, what role, who invited them, when. This section has surfaced surprise admins on past engagements.
- API keys: name, scope breadth, created, last used, status. Flag never-used keys and over-scoped keys.
- Prior stack AS THE PLATFORM DESCRIBES IT (analytics source labels, migration artifacts), beside what the client said. Note disagreements.

## 1..N. One section per top-level nav area

For each area: subsections with URLs, what each page does, what data it holds, exact counts as displayed. Capture verbatim any page text that explains system behavior (webhook descriptions, "how this works" blocks)... those lines are the platform documenting itself.

## N+1. The priority answers

One subsection per intake question. For each: the answer, the evidence chain, and one line on what it means for the engagement.

- **Access:** the full purchase-to-entitlement chain, the mapping table reproduced, unmapped products with buyer counts, ACTIVE vs connected providers, and the do-not-flip warnings.
- **Revenue:** what each widget reads, all-time vs default range, the platform's own lifetime figure, plan/product table with prices and subscriber counts, coupon overhang, failed-charge rate.
- **Trend:** the view that exists or the statement that none does, closest proxy with limits, engagement rate (30-day actives over paying members), where the real answer lives.
- **Content:** the object hierarchy top to bottom (storage, record, grouping, sellable container, display rows), and the exact build-and-deliver steps for a new offer, including any manual allow-list or DNS steps with no API.

## N+2. Broken, half-migrated, or left over

Four tiers, in this order:
- **Blocking** (fix before the engagement deliverable ships)
- **Migration debris**
- **Data integrity** (numbers that disagree; say "do not quote these without picking a definition")
- **Security and hygiene**

Number every finding. Blunt phrasing, buyer counts and dollar figures where they exist.

## N+3. Summary

- What the platform does well (lead with whatever de-risks the engagement most).
- What is missing.
- What to build around it (numbered, tied to the engagement goal, each one actionable).
- Open questions read-only access could not answer, with who can answer each.
