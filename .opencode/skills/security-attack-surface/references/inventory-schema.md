# Inventory schemas

Normalized assets and relationships as JSON, with snapshot metadata, deltas, quarantine candidates and next investigations. Validate with:

```sh
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>
```

## assets.json

```json
{
  "snapshot_date": "2026-11-22",
  "sources": ["direct fetch", "passive DNS", "CT API"],
  "coverage_gaps": ["no active resolution checks on subdomains"],
  "assets": [
    {
      "id": "A-001",
      "type": "domain",
      "identifier": "www.acme.example",
      "environment": "production",
      "standing": "observed",
      "active_scope": false,
      "exposure": "public marketing site",
      "first_observed": "2026-11-22",
      "last_observed": "2026-11-22",
      "source": "direct fetch",
      "confidence": "high"
    }
  ]
}
```

- `standing`: `authoritative`, `observed` or `candidate`. Candidates are quarantined from active testing.
- `active_scope`: whether this asset is approved for active methods.

## relations.json

```json
{
  "relations": [
    {
      "id": "R-001",
      "from": "acme.example",
      "relationship": "resolves_to",
      "to": "93.184.216.34",
      "evidence": "DNS 2026-11-22",
      "confidence": "high"
    }
  ],
  "changes": [
    {
      "asset": "A-015",
      "delta": "new",
      "significance": "first seen in CT logs"
    }
  ],
  "candidates": [
    {
      "identifier": "legacy.acme.example",
      "association_evidence": "CT log only",
      "ownership_question": "unconfirmed; needs owner approval"
    }
  ],
  "next_investigations": [
    {
      "question": "does selfservice expose password reset?",
      "why": "direct account-takeover path",
      "cheapest_check": "authorized passive page fetch",
      "blocking_context": "needs authorization"
    }
  ]
}
```

- `delta`: `new`, `changed`, `reconfirmed`, `not-observed`, `retired` or `rejected`. `not-observed` is visibility evidence, not proof of removal.
- Shared names or co-occurrence are not evidence of a relationship; every relation needs its own source and confidence.
