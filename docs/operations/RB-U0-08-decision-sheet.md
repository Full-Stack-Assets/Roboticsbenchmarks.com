# RB-U0-08 — Human Authority decision sheet

Status: Decision required before production configuration. Interface-only implementation may continue.

| Decision | Recommended interface default | Human Authority selection | Gate affected |
|---|---|---|---|
| Hosting | Worker-compatible adapter; current Sites lifecycle for private review | ☐ Approve ☐ Replace ☐ Defer | Production deployment |
| Managed database | SQL/D1-compatible repository; binding disabled | ☐ Approve ☐ Replace ☐ Defer | Durable writes |
| Transactional email | Provider-neutral outbox; disabled | ☐ Approve ☐ Replace ☐ Defer | Contributor/alert email |
| Authentication + MFA | OIDC/session adapter with fresh-MFA proof | ☐ Approve ☐ Replace ☐ Defer | Protected access |
| Analytics | Strict allowed-event adapter; disabled | ☐ Approve ☐ Replace ☐ Defer | Production analytics |
| Monitoring | Provider-neutral error/health interface | ☐ Approve ☐ Replace ☐ Defer | Launch operations |
| Legal operator identity | No runtime default | ☐ Supply ☐ Defer | Privacy/Terms publication |
| Retention schedule | No guessed periods; LegalConfig required | ☐ Supply ☐ Defer | Contact data processing |
| Source-health checker | Disabled by default | ☐ Approve after security suite ☐ Keep disabled | Automated retrieval |

No unchecked or deferred decision is permission to infer a vendor, publish legal copy, activate production behavior, deploy, or change DNS.
