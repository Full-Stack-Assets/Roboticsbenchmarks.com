# Threat and abuse register

| Threat | Prevention | Detection / test | Owner | Residual gate |
|---|---|---|---|---|
| Draft/demo leak | Publication-state constraints; compiled view models | API negative tests | Backend | Release verification |
| Unsupported claim | Accepted-claim manifest | Compile-failure fixture | Curator + Data | Publication approval |
| Spam/enumeration | Rate limits, neutral responses, idempotency | Burst/replay tests | Backend | Abuse review |
| XSS | Shared schemas, encoding, sanitized Markdown | Stored/reflected payload suite | QA/Security | CSP acceptance |
| SQL injection | Prepared statements, closed sort maps | Injection fixtures | Backend | Security review |
| SSRF | Store URL text only; checker disabled | Private-range/redirect/rebinding suite | QA/Security | Adapter approval |
| Approval replay | Payload hash, nonce, expiry, atomic consume | Mutation/replay/concurrency suite | Backend | Human review |
| PII in telemetry | Allowed-property schema, redaction | Log/event inspection | Product + QA | LegalConfig approval |
| License overreach | Scoped rights claims; link-only default | Storage inventory | Curator | Rights exception |
| Supply-chain compromise | Lockfile, audit, SBOM, secret scan | CI security jobs | QA/Security | Time-bounded exception |
| Credential leak | Runtime injection; no repo secrets | Secret/history scan | Launch Operator | Rotation |
| Stale public cache | Revision-keyed ETags/invalidation | Publish/archive cache tests | Backend | Launch smoke |
