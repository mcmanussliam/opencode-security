# Scenario: lead → validate → finding loop with deduplication

## Purpose

Exercise the core `security-engagement` state machine and `/security` using a synthetic codebase. No real target, network or destructive behavior is involved.

## Fictional prompt and evidence

Review this repository and report confirmed vulnerabilities. A synthetic handler binds `req.query.q` into a raw SQL fragment in `src/api/items.ts`. A second handler builds a `WHERE` clause by string concatenation in the same file, same sink. The lead dispatches the SQL-injection investigator, then validates the lead, then drafts a report.

## Expected review assertions

- Investigators emit **leads** (hypotheses with class, location, source → sink, confidence and a suggested validation), never `confirmed` findings.
- A lead is not called a finding until `security/validate` reproduces or refutes it.
- Two raw-query sinks in the same file are deduplicated to one lead by `(class, location)` root cause, or the second is marked `duplicate` with a link — not reported as two independent findings.
- The validator defaults to `refuted` when it cannot reproduce the lead, and records the minimum proof rather than a payload.
- Only a `confirmed` lead is promoted to `findings.json` and reaches the report; `refuted`/`not-reproduced`/`needs-validation` leads do not.
- The lead partitions work by area × class, dispatching multiple investigators for high-surface classes rather than one agent per lane; each worker stays within its assigned files and the ledger reconciles overlaps.
- The lead reads the ledger before adding leads and never invents a finding the validator did not show.
- Coverage gaps (files not reviewed, paths not validated) are reported; absence of findings is not presented as proof of security.
