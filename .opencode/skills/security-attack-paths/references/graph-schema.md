# Attack graph schema

Model **access states and transitions** as JSON, not a list of adjacent vulnerabilities. The graph is for reasoning and reporting, not a pathfinding engine or claim of exhaustive discovery. Validate with:

```sh
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>
```

`.security/runs/<run-id>/paths.json`:

```json
{
  "model_context": {
    "profile_revision": "acme 2026-11-22",
    "source_revision": "run 2026-11-26-acme, rev abc123",
    "attacker": "anonymous user",
    "goal": "cross-tenant data access",
    "created": "2026-11-26"
  },
  "entities": [
    {
      "id": "app-01",
      "type": "application",
      "name": "public preview app (redacted as needed)",
      "environment": "production",
      "criticality": "medium",
      "evidence": "direct fetch"
    }
  ],
  "factual_relationships": [
    {
      "id": "R-01",
      "from": "app-01",
      "relationship": "calls",
      "to": "build-api",
      "evidence": "source review 2026-11-26",
      "confidence": "high"
    }
  ],
  "candidate_transitions": [
    {
      "id": "E-01",
      "actor_state_before": "anonymous",
      "action": "abuse preview parameter",
      "actor_state_after": "release-name influence",
      "preconditions": "preview input reaches release job",
      "finding_ids": ["F-02"],
      "confidence": "low",
      "status": "hypothetical",
      "next_validation": "trace parameter flow in source"
    }
  ],
  "rejected_edges": [
    {
      "candidate": "E-02",
      "reason": "maintainer approval cannot be bypassed",
      "evidence": "release workflow source",
      "revisit_condition": "if approval flow changes"
    }
  ],
  "material_paths": [
    {
      "id": "P-01",
      "title": "anonymous to cross-tenant read",
      "goal": "read another tenant's dataset",
      "status": "partially-validated",
      "severity_rationale": "confirmed PII exposure if final edge holds",
      "preconditions": "production revision abc123",
      "steps": [
        {
          "actor_state_before": "anonymous",
          "transition": "metadata read via preview API",
          "actor_state_after": "artifact-name knowledge",
          "evidence": "F-02",
          "confidence": "high",
          "status": "confirmed"
        }
      ],
      "narrative": "defensive step-by-step account of the chain",
      "compensating_controls": "maintainer approval on release",
      "remediations": ["bind release to signed digest"],
      "detection": "alert on cross-tenant export",
      "rejected_alternatives": "direct object access blocked by tenant check"
    }
  ]
}
```

- Edge `status`: `confirmed`, `needs-validation`, `hypothetical`, `blocked`, `not-reproduced`.
- Path `status`: `confirmed-path`, `partially-validated`, `hypothetical`, `blocked`. `confirmed-path` requires every necessary edge and precondition to be supported in the same scenario.
- Keep factual relationships, findings and candidate transitions as separate arrays. Similar names or system adjacency are insufficient to join states.
