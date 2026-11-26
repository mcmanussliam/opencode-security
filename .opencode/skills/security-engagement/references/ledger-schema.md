# Run ledger schemas

Ledger data is JSON: valid, parseable, exactly keyed. Prose stays Markdown (`engagement.md` is the narrative log, `report.md` is the human document). Every lead and finding gets a stable ID. Durable per-program hunt state lives in `endpoints.json` and `ruled-out.json`.

Validate any ledger file with:

```sh
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>
```

No trailing commas, no comments, no multiline hacks. Arrays hold objects; optional fields may be omitted, never nulled without meaning.

## leads.json

Bare array. One object per lead.

```json
[
  {
    "id": "L-01",
    "class": "sql-injection",
    "location": "src/api/items.ts:42",
    "source_to_sink": "req.query.q -> db.raw",
    "failed_control": "no parameterization",
    "dedup_key": "sql-injection:src/api/items.ts",
    "confidence": "high",
    "suggested_validation": "bind param + unit test",
    "status": "open",
    "owner": "lead"
  }
]
```

- `dedup_key` is `<class>:<repository-relative location or endpoint>`. Before adding a lead, match it against existing keys and mark `duplicate` with a link rather than re-emitting.
- `status`: `open`, `validating`, `duplicate`, `closed`.

## findings.json

Bare array. Only validated findings — never open leads.

```json
[
  {
    "id": "F-01",
    "lead": "L-01",
    "class": "sql-injection",
    "location": "src/api/items.ts:42",
    "validation_result": "reproduced via unit test",
    "evidence": "evidence/...",
    "severity": "high",
    "confidence": "high",
    "impact": "arbitrary query",
    "remediation": "parameterize",
    "status": "confirmed"
  }
]
```

- `status`: `confirmed`, `needs-validation`, `not-reproduced`, `refuted`.

## endpoints.json (per-program, durable)

Bare array. One object per exercised endpoint or operation.

```json
[
  {
    "id": "E-01",
    "method": "POST",
    "path": "/api/items",
    "params": ["q", "limit", "tenant"],
    "auth": ["anon", "userA", "admin"],
    "technology": "Node + Postgres",
    "source": "JS bundle main.js",
    "status": "untested"
  }
]
```

## ruled-out.json (per-program, durable)

Bare array. Closed leads and false positives with reasons, so later hunts don't re-litigate them.

```json
[
  {
    "lead": "L-04",
    "hypothesis": "ssrf on /proxy",
    "reason": "fetch allow-lists the resolved IP",
    "evidence": "source + 401 repro",
    "revisit_condition": "if allow-list changes"
  }
]
```

A `closed` lead is promoted to a finding, merged as a duplicate, or dismissed as not worth further cost — keep the reason here.
