---
name: Attack Paths
description: Use to correlate assets, identities, controls and findings into complete attack-path narratives from entry points to crown jewels, with per-edge evidence, prerequisites, impact, remediation break points and explicit uncertainties.
---

# Attack paths

Model **access states and transitions**, not a list of adjacent vulnerabilities. Use `security/attack-path` for correlation. The Markdown graph is for reasoning and reporting, not a pathfinding engine or claim of exhaustive discovery.

## Inputs

Read organization profile, inventory/relations and linked findings/investigations. Define:

- Initial actor and actual capability: anonymous, basic role, supplier, CI dependency, etc.
- Goal state: cross-tenant access, privileged identity, production deployment/signing, sensitive data operation, critical control plane, etc.
- Environment/revision and whether the user wants confirmed paths, hypotheses or missing-edge investigation.

Use `references/graph-schema.md` for substantial graphs. Keep three record types separate: factual assets/relationships, findings/observations, and candidate attack transitions.

## Build the graph

Each attack transition needs:

- Actor access before and the genuinely new access/capability after.
- Abused or failed control and action causing the change.
- Preconditions: environment, reachability, identity, version, timing, user interaction and previous edges.
- Evidence IDs with source/time, confidence and status (`confirmed`, `needs-validation`, `hypothetical`, `blocked`, `not-reproduced`).
- Known compensating controls and cheapest safe validation if unresolved.

Search in both directions:

1. **Forward from entry points:** what new capability does each supported transition unlock?
2. **Backward from crown jewels:** what identity, permission, trust or operation is required, and how could it arise?

Join states only when effective identity, environment and access semantics match. Similar names or system adjacency are insufficient. Track visited states; prefer shortest, strongest paths while preserving alternate routes and shared choke points.

Reject transitions that add no capability, duplicate one finding into two steps, cross an effective control, use the wrong environment or rely on an unrealistic prerequisite. Keep rejection reasons so later runs do not resurrect them.

## Resolve valuable missing edges

Focus on links that would connect strong fragments to a crown jewel or affect several paths. Investigate the exact uncertainty through the lead → `security/validate` loop using source/read-only analysis or safe synthetic proofs. For artifact-substitution hypotheses, first trace attacker-controlled parameters into release inputs and check whether approval/deployment binds the name to an immutable digest or signature; only an explicitly authorized, minimal, non-deploying check belongs after inconclusive source review. Missing evidence stays `hypothetical`; do not perform unsafe exploitation to make a path confirmed.

## Explain complete chains

For each material path record in `paths.json`:

1. Goal, initial preconditions, environment/revision and overall status (`confirmed-path`, `partially-validated`, `hypothetical`, `blocked`).
2. Numbered entry → control/gate → new access → crown-jewel sequence, naming unresolved edges inline.
3. Evidence table for every edge and combined impact/severity rationale.
4. Existing controls, highest-leverage path-breaking fixes and safe verification steps.
5. Detection opportunities and optional accurate ATT&CK/CAPEC mappings (taxonomy is not evidence).
6. Alternate paths/choke points, assumptions, rejected explanations and next decisive question.

A complete description explains every stage and uncertainty; it does not assert an unvalidated compromise. `confirmed-path` requires every necessary edge and precondition to be supported in the same scenario.

For formal exploit-chain findings, link 2–12 unique finding IDs with roles and genuine additional impact. Broader paths may include legitimate relationships and controls that are not findings; keep that distinction visible.

## Prioritize

Order next investigation/remediation using evidence, presence, reachability, crown-jewel consequence and path leverage. Use current CISA KEV/vendor evidence as exploitation/mitigation inputs and EPSS only as population-level 30-day exploitation probability—never as severity or organization risk, never multiplied by CVSS. See `references/prioritization.md` before publishing KEV/EPSS/SSVC-based decisions.
