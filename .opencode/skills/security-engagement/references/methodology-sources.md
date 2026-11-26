# Methodology sources

Primary sources reviewed for the organization-scale refinement on 2026-11-22. Use links as methodology references, not as claims of compliance or proof that a specific target is authorized.

| Source | Applied principle |
| --- | --- |
| [NIST SP 800-115, Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final) | Plan and bound technical assessment, analyze findings and build mitigation processes; understand technique limitations. |
| [OWASP Web Security Testing Guide, testing framework](https://wstg.owasp.org/v4.2/3-The_OWASP_Testing_Framework/0-The_Web_Security_Testing_Framework/) | Combine requirements/design/code/deployment review with maintenance checks and traceable measurement instead of relying only on black-box testing. |
| [OWASP Attack Surface Analysis Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html) | Map entry/exit paths and protecting controls, group surfaces by risk/design, revisit changes and choose representative deep reviews. |
| [OWASP Amass](https://owasp.org/projects/amass) and [Open Asset Model](https://github.com/owasp-amass/open-asset-model) | Persist assets and relationships across infrastructure, digital and organizational types; discovery is broader than Internet hosts. |
| [BloodHound OpenGraph overview](https://bloodhound.specterops.io/opengraph/overview) | Custom node/edge graphs can represent abusable relationships and attack paths across identity, developer and other systems. This suite uses similar reasoning, not BloodHound-format compatibility. |
| [MITRE ATT&CK Enterprise techniques](https://attack.mitre.org/techniques/enterprise/) | Map observed adversary behavior to common terminology and relevant detection/mitigation context; a mapping is not evidence or severity. |
| [MITRE CAPEC FAQ](https://capec.mitre.org/about/faq.html) | Use attack patterns to reason about common attributes/challenges and approaches, without treating a matching pattern as an observed exploit. |
| [MITRE CTID Attack Flow](https://ctid.mitre.org/projects/attack-flow) | Describe connected actions, conditions and relationships to communicate multi-phase attacks and defensive opportunities. |
| [OWASP ASVS 5.0.0](https://asvs.owasp.org/) | Use versioned security requirement IDs and explicit verification levels as control coverage/traceability references rather than scanner counts. |
| [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) | Include object/property/function authorization, resource consumption, inventory, SSRF and configuration in API coverage. |
| [FIRST: Using EPSS](https://first.org/epss/using-epss) | EPSS estimates observed exploitation probability in the next 30 days. Localize it with presence, reachability and consequence; never multiply it by CVSS or treat low probability as safety. |
| [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | KEV is authoritative evidence of past exploitation and a strong prioritization input, still requiring local presence/exposure analysis. |
| [CISA Stakeholder-Specific Vulnerability Categorization](https://www.cisa.gov/resources-tools/resources/stakeholder-specific-vulnerability-categorization-ssvc) | Translate exploitation, technical impact, automatability and mission/well-being context into Track, Track*, Attend or Act when following the published tree. |

Keep original versions and dates with copied requirement/advisory facts. For live KEV/EPSS or current ATT&CK/CAPEC identifiers, consult a current authorized source at assessment time instead of assuming this reference is a snapshot of their databases.
