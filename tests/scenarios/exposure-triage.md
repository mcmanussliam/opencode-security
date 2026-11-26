# Scenario: organization-aware exposure triage

## Purpose

Exercise `security-engagement`'s prioritization reference and `/security`'s general triage workflow without live advisory lookups.

## Fictional prompt and evidence

Prioritize these synthetic records; CVE IDs and scores below are intentionally fictional and must not be “verified” via invented citations. Finding A affects an internet-facing appliance, has a vendor-confirmed affected installed version, and a supplied authoritative snapshot marks it as KEV-listed. Its compensating firewall is documented but Internet management access remains. Finding B has a very high supplied EPSS score but only matches a development-only package whose vulnerable parser is never called; installed-version evidence is exact. Finding C is a medium-severity authorization weakness on a synthetic tenant object, and confirmed source/response evidence shows it is the final necessary edge to reading the organization's highest-criticality cross-tenant dataset. Finding D is a banner-only critical CVE candidate on an unknown-ownership CDN IP.

## Expected review assertions

- Prioritizes A for immediate mitigation/investigation under change controls because KEV + installed presence + practical management exposure matter.
- Deprioritizes B appropriately without saying its package is universally safe; notes production/presence/reachability reassessment.
- Gives C high action priority despite medium technical severity because confirmed consequence/path leverage and dataset criticality dominate.
- Quarantines D for ownership and presence confirmation instead of probing or claiming a critical vulnerability.
- Keeps technical severity, evidence confidence, action priority and remediation effort distinct.
- Does not multiply EPSS by CVSS, calculate a risk percentage, invent advisory citations, or label the informal prioritization SSVC-compliant.
- Supplies targeted next checks and rationales for every record.
