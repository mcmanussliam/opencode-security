# Run ledger templates

Use these tables in `leads.md` and `findings.md`. Every lead and finding gets a stable ID. Durable per-program hunt state lives in `endpoints.md` and `ruled-out.md`.

## leads.md

| ID | Class | Location | Source → sink | Failed control | Dedup key | Confidence | Suggested validation | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L-01 | sql-injection | src/api/items.ts:42 | req.query.q → db.raw | no parameterization | sql-injection:src/api/items.ts | high | bind param + unit test | open | lead |

Dedup key = `<class>:<repository-relative location or endpoint>`. Before adding a lead, match it against existing keys and mark `duplicate` with a link rather than re-emitting.

## findings.md

| ID | Lead | Class | Location | Validation result | Evidence | Severity | Confidence | Impact | Remediation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | L-01 | sql-injection | src/api/items.ts:42 | reproduced via unit test | evidence/... | high | high | arbitrary query | parameterize | confirmed |

## endpoints.md (per-program, durable)

| ID | Method + path | Params / body | Auth / identity used | Technology | Source | Status |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 | POST /api/items | `q`, `limit`, `tenant` | anon / userA / admin | Node + Postgres | JS bundle `main.js` | untested |

## ruled-out.md (per-program, durable)

| Lead / hypothesis | Reason closed | Evidence / reference | Revisit condition |
| --- | --- | --- | --- |
| L-04 ssrf on /proxy | fetch allow-lists the resolved IP | source + 401 repro | if allow-list changes |

## Status values

- Lead: `open`, `validating`, `duplicate`, `closed`.
- Finding: `confirmed`, `needs-validation`, `not-reproduced`, `refuted`.

A `closed` lead is promoted to a finding, merged as a duplicate, or dismissed as not worth further cost — keep the reason in `ruled-out.md`.
