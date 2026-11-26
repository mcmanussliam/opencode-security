---
name: Attack Surface and Organization Mapping
description: Use to onboard an organization's approved domains/cloud/code/SaaS scope, map external or internal attack surfaces, correlate assets, track ownership and snapshot changes, and choose deeper investigations.
---

# Attack surface and organization mapping

Produce a useful asset/relationship model, not raw scan output. Use `security-engagement` for run memory and scope gates, and normally delegate collection/correlation to `security/surface`.

## 1. Establish durable context

For recurring organization work, create or resume:

```text
.security/organization/<org-slug>/
├── organization.json  # objectives, crown jewels, scope decisions and open questions
├── assets.json        # normalized assets, sources, scope status and deltas
└── relations.json     # supported relationships, changes, candidates, next investigations
```

Use `references/organization-schema.md` and `references/inventory-schema.md` when creating them.

Capture only information that affects decisions:

- Authoritative root domains/IP ranges, code hosts, cloud accounts/projects, clusters, IdP/SaaS tenants and applications.
- Crown jewels: data classifications, privileged identity/control planes, production deployment/signing, critical processes and availability dependencies—never actual protected records.
- Per-zone ownership/authorization, environments, allowed passive/active methods, exclusions, synthetic identities, request windows/rates and operational contacts.
- User decisions on accepted findings, false positives, scope expansions and profile freshness.

A broad “my organization” request starts onboarding; it does not authorize every discovered asset.

## 2. Collect and normalize

Start with authoritative inventories/architecture and local deployment/source metadata. Then use approved external passive sources and bounded active recon only where allowed. Check tool defaults before using installed scanners; no broad scan by default.

Track three states independently:

- **Authoritative:** owner-confirmed scope/assets.
- **Observed:** directly seen with source and timestamp; ownership may still be unresolved.
- **Candidate:** inferred association from DNS, certificates, naming or third-party metadata. Quarantine candidate assets from active testing.

When collection is prohibited or not run, state explicitly that no DNS, certificate, cloud, network or other collection was performed. Attribute prompt-supplied findings to the user/report, preserve supplied timestamps or mark them unknown, and never present supplied information as freshly observed, verified or reconfirmed.

Normalize useful entity kinds (business service, domain/host/service, application/endpoint, repository/deployment, cloud resource/workload, identity/role, data classification/control plane). Keep stable IDs and aliases. Never make up missing technology, ownership or criticality facts.

Record only supported relationships such as `resolves_to`, `routes_to`, `deployed_from`, `calls`, `runs_as`, `assumes`, `grants`, `reads/writes`, `stores`, `trusts` and `protected_by`. Every relation needs its own source/time/confidence; shared names or co-occurrence are not evidence of a connection.

## 3. Compare and expose gaps

When an earlier inventory exists, classify assets/relations:

- `new`, `changed`, `reconfirmed`, `not-observed`, `retired` or `rejected`.
- `not-observed` is visibility evidence, not proof of removal or safety.
- Explain source/tool coverage changes before treating deltas as real attack-surface changes.

Snapshots are not continuous monitoring. State what external-only collection or unavailable cloud/source inventories cannot reveal.

## 4. Point deeper investigations

Prioritize leads where anonymous/lower-privilege reachability meets valuable assets or new technology: identity/admin paths, external ingestion, old/custom protocols, cross-tenant operations, CI/CD and bridge relationships into control planes. Confirm presence/reachability before headline severity drives effort.

Hand off one specific question at a time through the engagement skill's validation loop: emit a lead, then let `security/validate` test it. Supply prior evidence/negative results so work is cumulative. Typical next steps:

- Clarify ownership or effective architecture.
- Map a deployed route to source and a protecting control.
- Validate one suspected weakness safely.
- Establish whether an issue creates a new access state relevant to `security-attack-paths`.

Deliver the updated inventory/relationships, material deltas, ownership questions, priority leads and coverage limitations—not unsupported vulnerability claims.
