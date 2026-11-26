# Organization profile schema

Durable per-organization context as JSON: objectives, scope decisions and open questions. Validate with:

```sh
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>
```

`.security/organization/<org-slug>/organization.json`:

```json
{
  "slug": "acme",
  "last_reviewed": "2026-11-22",
  "sources": ["owner-confirmed scope doc", "passive DNS 2026-11-22"],
  "objectives": [
    {
      "asset": "student records",
      "impact": "high — regulatory, financial",
      "owner": "unknown"
    }
  ],
  "scope": [
    {
      "zone": "*.acme.example",
      "ownership_evidence": "owner-confirmed root domain",
      "environment": "production",
      "allowed_methods": "passive GET/fetch only",
      "exclusions": "no active scanning",
      "last_approved": "2026-11-22"
    }
  ],
  "identities": "synthetic identities and windows; never record credentials",
  "decisions": [
    {
      "decision": "keep fully passive",
      "rationale": "third-party target, no authorization",
      "date": "2026-11-22",
      "revisit_trigger": "if authorization is supplied"
    }
  ],
  "open_questions": ["which unit owns each candidate subdomain?"]
}
```

Never record actual protected records, credentials or personal data — data classes and profile aliases only.
