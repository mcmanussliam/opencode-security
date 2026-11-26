---
description: Run a security hunt or codebase scan: investigate, validate and report
agent: security
---

Load `security-engagement` and drive the lead → validation → finding loop over a `.security/runs/<run-id>/` ledger. Pick the engagement mode (white-box / grey-box / black-box); for live targets recon the endpoint inventory first, then delegate per-class investigators in parallel, collect and dedup leads, validate the highest-value leads with `security/validate`, and report confirmed findings only. Stay passive until active testing is explicitly authorized. Preserve prior evidence and return findings, open leads, coverage limits and the next most valuable lead.

Objective, target or codebase: $ARGUMENTS
