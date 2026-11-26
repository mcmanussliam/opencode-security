# Evidence-based action priority

Keep technical severity, confidence, organization action priority and remediation effort separate. Prefer a short reason, not an invented numeric formula.

Order work using:

1. Local installed/affected presence with revision and environment.
2. Real reachability, privileges, user interaction and effective controls.
3. Business/mission consequence, data classification and blast radius.
4. New access created and position in one or more paths to crown jewels.
5. Credible exploitation evidence and vendor mitigations.
6. Confidence in each necessary edge and cheapest decisive investigation.

## External signals

- **CISA KEV:** vulnerabilities known to have been exploited; strong prioritization input, not evidence that this organization was breached or has an affected deployed version. Check current catalog and vendor guidance at assessment time.
- **EPSS:** probability of observed exploitation activity across EPSS partners in the next 30 days. It does not measure severity, local presence/reachability, controls or consequence. Record retrieval date; do not multiply by CVSS, call low EPSS safe or treat it as a live attack feed.
- **SSVC:** use CISA's published decision tree and input values before using `Track`, `Track*`, `Attend` or `Act` as an SSVC result. Otherwise use plain action labels (`immediate`, `investigate`, `schedule`, `monitor`) without claiming SSVC compliance.

See `methodology-sources.md` for primary sources and their intended use.
