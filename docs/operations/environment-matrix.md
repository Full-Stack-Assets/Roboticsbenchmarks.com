# Environment and data-isolation matrix

| Environment | Database | Email | Analytics | Source health | Data allowed | Prohibited flow |
|---|---|---|---|---|---|---|
| Local | Ephemeral fixture | Disabled/sink | Disabled | Disabled | Synthetic fixtures and accepted public seed metadata | Production credentials/contact data |
| Test | Ephemeral isolated | Deterministic fake | Event fake | Inert outcomes | Synthetic data only | External delivery or retrieval |
| Preview | Isolated non-production | Sandbox | Separate test project | Disabled | Synthetic contacts; draft metadata | Production data/credentials |
| Staging | Isolated managed candidate | Authenticated sandbox | Separate staging project | Accepted adapter only | Controlled test submissions | Production database writes/public email |
| Production | Human-approved managed service | Approved provider | Approved configuration | Disabled until approved | Live submissions and curated evidence | Cross-environment credential/data reuse |

Secrets are runtime-injected and never committed. Backups require isolated target validation before restore.
