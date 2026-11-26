# Validation methodology

Validation turns a lead into a finding. Its job is to refute the lead with the cheapest decisive check and keep the minimum proof. See `security-engagement` for the finding statuses.

## Order of checks

1. Read the code/config and framework defaults around the claimed source → sink.
2. Run existing tests or a minimal synthetic repro in a clean sandbox (a scratch dir under `.security/`, never the target's own working tree).
3. Only with explicit authorization: a minimal, non-destructive live check.

Prefer an executable witness — a failing/passing test, a trace, a status code, an observed callback — over a written argument.

## Clean sandbox

Reproduce in an environment the investigator did not write to: no shared state, no inherited environment, only the artifact under test crosses. Grade against a snapshot; do not let a proof file the agent created itself count as evidence about the target.

## Out-of-band (OAST) for blind classes

Blind SSRF, blind SQL/command injection, XXE and stored XSS leave no in-band signal. Prove them by making the target reach a host you watch (interactsh or Burp Collaborator, if available), then record the strongest rung reached:

| Rung | Signal | Claim |
| --- | --- | --- |
| 1 | DNS lookup only | the name resolved; weakest — egress filtering often blocks the HTTP leg |
| 2 | DNS + HTTP(S) | a system made an outbound request; note source IP, User-Agent, path |
| 3 | Response used | data you served came back in-band or changed behaviour |

Claim only the rung you reached. A DNS hit alone does not prove code execution or data access. Correlate each callback to its exact payload with a unique label per injection point; ignore hits from link-unfurlers, scanners and mail gateways. OAST is still an active, outbound-triggering check and requires the same explicit authorization as any live check.

## Duplicate and prior-report check

Before confirming, check whether the same root cause was already reported (program disclosures/hacktivity, prior runs). A duplicate of a known report is not a new finding; record the reference and mark the lead `duplicate` or `closed`.
