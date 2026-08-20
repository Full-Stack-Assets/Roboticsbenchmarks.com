# RoboticsBenchmarks.com MVP Engineering Backlog v1

Status: **Authorized for implementation preparation**  
Scope: **RoboticsBenchmarks.com only**  
Source contract: `RoboticsBenchmarks.com_MVP_Product_Specification.docx`  
Source SHA-256: `e7c7496bd618afe8095e8561993cdec6775fc9cd80f0a784fda8e221c0fa7f48`  
Seed contract: `roboticsbenchmarks_seed_v1.json`  
Evidence cutoff: **2026-08-20**  
CodeReliability.com: **authorized as a separate parallel workstream; excluded from every Robotics ticket**

## 1. Execution rules

- Work proceeds in Unit order unless every listed dependency is complete.
- `P0` blocks the MVP critical path. `P1` is required before launch. `P2` may be deferred only through a named, dated Human Authority exception.
- Estimates are relative engineering sizes: `S` (up to one focused day), `M` (roughly two to three days), `L` (roughly four to five days). They are planning units, not delivery promises.
- Accountable owners are roles, not named people: Product, Design, Frontend, Backend, Data, Curator, QA/Security, Launch Operator, Human Authority.
- No public record may be created directly from seed JSON. The importer creates drafts, claims, sources, snapshots, and review candidates only.
- A record can become public only through a frozen revision, payload-bound publication request, valid independent approval, and atomic approval consumption.
- No task authorizes production deployment, DNS changes, production email activation, legal publication, or initial record publication. Those remain Human Authority gates.
- Every completed ticket must leave reproducible evidence in the repository or release evidence store.

## 2. Milestones and critical path

| Milestone | Units | Required exit condition |
|---|---:|---|
| M0 Foundation frozen | 0 | Architecture, environments, CI, contracts, and unresolved vendor decisions are explicit. |
| M1 Provenance kernel operational | 1 | Schema, importer, immutable revisions, manifests, and adverse constraints pass. |
| M2 Read-only product alpha | 2-3 | Ten draft starters compile into correct public view models; discovery routes pass registry/detail/category tests. |
| M3 Evaluation workflow complete | 4-6 | Compare, guidance, contribution, alerts, curation, and authority-gated publication pass. |
| M4 Release candidate | 7 | Security, accessibility, performance, privacy, analytics, SEO, backup, and runbooks pass. |
| M5 Controlled launch | 8 | Launch evidence packet is complete and every required Human Authority approval is recorded. |

Critical path: `U0 → U1 → U2 → U3 → U4/U5 → U6 → U7 → U8`.

## 3. Unit 0 — Repository and decision freeze

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U0-01 | P0 | Backend | — | S | Initialize repository, package boundaries, runtime version pins, and deterministic install/build scripts. | Clean checkout installs and builds twice with identical lockfile and no generated diff. |
| RB-U0-02 | P0 | Product + Backend | RB-U0-01 | M | ADR set covering application architecture, rendering mode, API boundary, background jobs, adapter boundaries, and provider-neutral vendor interfaces. | ADRs contain decision, alternatives, consequences, owner, date, and supersession rule. |
| RB-U0-03 | P0 | Data | RB-U0-02 | S | Environment matrix for local, test, preview, staging, and production with data and credential separation. | Matrix identifies database, email, analytics, storage, host, secrets, and prohibited cross-environment flows. |
| RB-U0-04 | P0 | QA/Security | RB-U0-01 | M | CI pipeline for formatting, lint, typecheck, unit tests, integration tests, migration checks, secret scan, dependency audit, and build. | A deliberate lint, test, migration, and secret failure each blocks CI in fixtures. |
| RB-U0-05 | P0 | Design + Frontend | RB-U0-02 | M | Design tokens and responsive primitives matching Section 6: color, typography, spacing, radii, focus, breakpoints, table/card modes. | Story fixtures render at 320, 390, 768, 1024, and 1440 px without horizontal page overflow. |
| RB-U0-06 | P0 | Backend + Product | RB-U0-02 | M | Versioned API, content, seed, analytics-event, and LegalConfig contracts. | Contracts validate good fixtures and reject unknown enums, unbound placeholders, and incompatible versions. |
| RB-U0-07 | P0 | QA/Security | RB-U0-02 | M | Threat boundary and abuse-case register for public reads, forms, URL retrieval, curator actions, publication, email, and analytics. | Register maps each threat to a control, test, owner, and residual-risk gate. |
| RB-U0-08 | P0 | Human Authority | RB-U0-02, RB-U0-03 | S | Decision record for hosting, managed database, transactional email, analytics, monitoring, and legal operator identity. | Each decision is approved or explicitly deferred; implementation can proceed against interfaces without inventing a vendor. |

**Unit 0 exit gate:** RB-U0-01 through RB-U0-07 pass. RB-U0-08 may contain deferred vendor selections only when the adapter contract permits independent implementation and no production behavior is implied.

## 4. Unit 1 — Canonical data and provenance kernel

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U1-01 | P0 | Data | RB-U0-06 | L | Core migrations for benchmarks, aliases, organizations, maintainers, domains, settings, embodiments, versions, protocols, metrics, sources, access artifacts, and resources. | Clean migration succeeds; down/recovery procedure is documented; required uniqueness and foreign keys exist. |
| RB-U1-02 | P0 | Data | RB-U1-01 | L | Evidence model: claims, claim-source joins, source snapshots, retrieval outcomes, verification events, disputes, and freshness state. | A material claim cannot be accepted without at least one allowed source binding and snapshot locator. |
| RB-U1-03 | P0 | Data + Backend | RB-U1-02 | L | Immutable entity revisions, revision field values, material-field manifests, canonical serializer, and revision hash. | Recompiling identical inputs yields the same hash; mutation of a published revision is rejected. |
| RB-U1-04 | P0 | Backend | RB-U1-03 | L | State machines for draft/review/publication/archive, claim verification, contribution review, subscription, and publication request/approval. | Invalid transitions fail atomically and produce no partial state or audit gap. |
| RB-U1-05 | P0 | Data | RB-U1-01 | M | Required indexes, canonical slug/alias collision rules, deterministic sort keys, and query-plan fixtures. | Duplicate canonical/alias collisions fail; reference queries use intended indexes. |
| RB-U1-06 | P0 | Backend | RB-U1-02 | L | Append-only audit event writer with actor, action, target, request ID, reason, before/after references, and timestamp. | Update/delete of audit rows is denied; every mutation fixture produces exactly one complete event. |
| RB-U1-07 | P0 | Data + Curator | RB-U1-03 | L | Seed importer and validator for `roboticsbenchmarks_seed_v1.json`. | Import creates exactly 10 drafts, 40 sources, bound claims, no demo rows, no public rows, and aborts fully on one invalid record. |
| RB-U1-08 | P0 | QA/Security | RB-U1-01 through RB-U1-07 | L | Adverse data fixture suite. | Tests reject demo publication, unscoped metrics, missing material claims, unsupported enum values, audit mutation, stale concurrency versions, and non-canonical aliases. |

**Unit 1 exit gate:** all eight tickets pass from a clean database. No UI-only evidence is accepted.

## 5. Unit 2 — Public read API and seed verification

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U2-01 | P0 | Curator | RB-U1-07 | L | Field-level review of all 10 starter drafts against the 40 primary-source entries. | Each material field has accepted claim IDs, source IDs, locators, retrieval state, reviewer, and timestamp. |
| RB-U2-02 | P0 | Curator | RB-U2-01 | M | Canonical entity-shape review for Open X-Embodiment, Habitat, ManiSkill 3, RoboChallenge Table30, CALVIN, and BARN Challenge 2026. | Dataset/platform/challenge distinctions, version requirements, CALVIN stale state, and BARN stage separation match the packet. |
| RB-U2-03 | P0 | Backend | RB-U1-03, RB-U2-01 | L | Public revision compiler and view-model serializer. | Only accepted, manifested fields appear; internal notes, contributor PII, rejected claims, and draft fields never serialize. |
| RB-U2-04 | P0 | Backend | RB-U2-03 | L | `GET /api/v1/benchmarks` with validated search/filter/sort/page parameters and deterministic pagination. | AC-REG API fixtures pass; repeated requests yield stable order; unknown filters return the defined validation error. |
| RB-U2-05 | P0 | Backend | RB-U2-03 | M | `GET /api/v1/benchmarks/:slug` with versions, protocols, metrics, sources, verification, and limitations. | AC-DET API fixtures pass; aliases redirect to canonical slug without losing query state. |
| RB-U2-06 | P0 | Backend | RB-U2-03 | M | Category, resource, update-feed, and compatible-record read endpoints. | Only public revisions return; relationship ordering is deterministic; no unpublished child leaks through counts. |
| RB-U2-07 | P1 | Backend | RB-U2-04 through RB-U2-06 | M | ETag, cache-control, conditional request, and cache-invalidation behavior. | Unchanged request returns 304; publication/archive invalidates affected list, detail, category, sitemap, and feed keys. |
| RB-U2-08 | P0 | QA/Security | RB-U2-03 through RB-U2-07 | L | Public API contract, privacy, authorization, and reference-performance tests. | Anonymous reads need no credential; protected fields never appear; fixture budgets from Section 14 pass. |

**Unit 2 exit gate:** ten reviewed starters compile correctly in a non-public environment. Publication is still blocked.

## 6. Unit 3 — Public discovery experience

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U3-01 | P0 | Frontend | RB-U0-05, RB-U2-04 | M | Global header, footer, route shell, skip link, alert entry point, responsive container, and legal disclaimer. | Keyboard navigation and focus order pass at all target breakpoints; sticky header never obscures focused content. |
| RB-U3-02 | P0 | Frontend + Design | RB-U3-01, RB-U2-04 | L | Homepage with exact Section 5 copy, recently verified entries, category cards, trust band, and final CTA. | Copy snapshot has no placeholders; empty/error/degraded states render without false freshness claims. |
| RB-U3-03 | P0 | Frontend | RB-U3-01, RB-U2-04 | L | Registry table/card experience with URL-bound search, filters, sort, page, clear-all, and result count. | AC-REG suite passes; refresh/back/forward preserve state; below 768 px the card view exposes the same key fields. |
| RB-U3-04 | P0 | Frontend | RB-U3-03, RB-U2-05 | L | Benchmark detail page with identity, setting, metrics, protocols, versions, limitations, sources, freshness, related records, and contribution CTA. | AC-DET passes; undefined metric states never render as zero; every source opens as an external link. |
| RB-U3-05 | P0 | Frontend | RB-U3-01, RB-U2-06 | M | Category index and category hubs using the shared filtered registry component. | AC-CAT passes; canonical category slug, description, count, empty state, and filter serialization are correct. |
| RB-U3-06 | P1 | Frontend | RB-U3-04 | M | Source ledger, verification history, stale/disputed states, and maintenance banners. | Verified, partially verified, potentially stale, disputed, archived, and unknown fixtures are distinguishable without color alone. |
| RB-U3-07 | P1 | Frontend | RB-U3-02 through RB-U3-06 | M | Loading, empty, validation, authorization, error, maintenance, and no-JavaScript states. | State matrix from Section 23 passes; recovery action never mutates data through a GET. |
| RB-U3-08 | P0 | QA/Security | RB-U3-01 through RB-U3-07 | L | Public-route responsive, keyboard, screen-reader smoke, visual-regression, and browser tests. | AC-REG, AC-DET, AC-CAT, 320 px overflow, focus, and browser matrix pass with retained screenshots. |

## 7. Unit 4 — Compare and selection guidance

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U4-01 | P0 | Backend | RB-U2-03 | M | Deterministic compatibility evaluator for entity, version, protocol, setting, task set, observation/action space, metric, embodiment, and system configuration. | Fixed compatible/incompatible/unknown fixtures return the exact Section 18 rule IDs and explanations. |
| RB-U4-02 | P0 | Frontend | RB-U3-04, RB-U4-01 | L | Compare selection state using ordered `{entity_slug, version_slug, protocol_slug}` tuples serialized in the URL. | Add/remove/reorder/share/refresh preserves up to four selections; duplicate tuples are rejected. |
| RB-U4-03 | P0 | Frontend + Design | RB-U4-02 | L | Comparison matrix with field-level unknown/non-comparable states and compatibility warnings. | AC-CMP passes; the UI never calculates an overall score, winner, or recommendation. |
| RB-U4-04 | P0 | Product + Curator | RB-U3-05 | M | “How to Choose” content, five-step selection flow, glossary, and selector questions from Section 5. | Editorial review confirms claims and labels match the packet; no question manufactures a ranking. |
| RB-U4-05 | P0 | Frontend | RB-U4-04 | M | Accessible guidance selector that returns filtered candidates and visible rationale. | AC-GDE passes; inputs are reversible, URL-safe where applicable, and usable by keyboard/screen reader. |
| RB-U4-06 | P0 | QA/Security | RB-U4-01 through RB-U4-05 | M | Compare/guidance regression and adverse test suite. | Missing protocols, mixed settings, unknown fields, stale revisions, and removed records produce defined non-comparable states. |

## 8. Unit 5 — Contributions, alerts, updates, and resources

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U5-01 | P0 | Backend | RB-U1-04, RB-U1-06 | L | Public contribution endpoint with validation, idempotency key, submitter-scoped duplicate suppression, rate limit, and pending-only write path. | AC-CON passes; public submission cannot write core benchmark, claim acceptance, revision, or publication state. |
| RB-U5-02 | P0 | Frontend | RB-U3-01, RB-U5-01 | M | New/correction contribution form with exact copy, official URL requirement, conditional fields, consent, success, and recovery states. | Keyboard/error summary/focus tests pass; correction prefill contains record identity but no protected fields. |
| RB-U5-03 | P0 | Backend | RB-U5-01 | L | Transactional outbox and provider-neutral email adapter for contributor confirmation and curator notification. | Provider failure retries without duplicate logical sends; database commit succeeds independently from delivery. |
| RB-U5-04 | P0 | Backend | RB-U1-04, RB-U5-03 | L | Enumeration-safe double-opt-in alert subscription, independent confirmation/unsubscribe secrets, RFC 8058 support, topic mapping, and delivery deduplication. | AC-ALT passes; same response for known/unknown address; GET does not mutate; one-click POST unsubscribe works. |
| RB-U5-05 | P0 | Frontend | RB-U5-04 | M | Alert modal/page, confirmation result, preference update, and unsubscribe states. | No account is required; expired/invalid tokens reveal no subscription existence. |
| RB-U5-06 | P1 | Backend + Frontend | RB-U2-06 | M | Public curation updates feed with changed-field summary, source links, and pagination. | Only approved public events appear; internal notes, actor email, and rejected drafts do not. |
| RB-U5-07 | P1 | Backend + Frontend | RB-U1-01, RB-U2-06 | L | Curated resources data model, suggestion workflow, public index, and detail/external-link behavior. | AC-RES passes; public suggestion cannot publish; every resource has verified URL and source type. |
| RB-U5-08 | P0 | QA/Security | RB-U5-01 through RB-U5-07 | L | Form abuse, privacy, retry, idempotency, token, outbox, and failure-mode suite using an email sandbox. | Duplicate, replay, race, provider outage, expired token, CSRF, and rate-limit fixtures pass. |

## 9. Unit 6 — Curator workbench and Human Authority gates

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U6-01 | P0 | Backend + QA/Security | RB-U0-08, RB-U1-04 | L | Authentication, sessions, fresh-MFA marker, RBAC for Curator/Admin/Designated Human Approver, and authorization middleware. | Unauthenticated, stale-MFA, wrong-role, and cross-role escalation tests fail closed and are audited. |
| RB-U6-02 | P0 | Frontend + Backend | RB-U6-01, RB-U5-01 | L | Curator dashboard and contribution review queue with filters, assignment, decision, reason, and concurrency guard. | Two-reviewer race yields one accepted transition; rejection and request-for-information preserve audit history. |
| RB-U6-03 | P0 | Frontend + Backend | RB-U6-01, RB-U1-02 | L | Draft editor for classifications, versions, protocols, metrics, claims, sources, locators, snapshots, and verification events. | Material field cannot be marked ready without accepted claim/source binding; autosave never publishes. |
| RB-U6-04 | P0 | Backend | RB-U1-03, RB-U6-03 | L | Frozen revision preview and material-manifest diff. | Preview renders from frozen revision bytes; later draft edits cannot change the pending revision hash. |
| RB-U6-05 | P0 | Backend | RB-U6-01, RB-U6-04 | L | Payload-bound publication request containing action, target, frozen revision hash, requester, reason, expiry, and requested timestamp. | Any payload/hash/action/target change invalidates the request and requires a new request. |
| RB-U6-06 | P0 | Backend + QA/Security | RB-U6-05 | L | Human approval object, fresh MFA, requester/approver separation, explicit sole-authority exception field, single-use atomic consumption, and immutable receipt. | Replay, expired approval, mismatched payload, requester self-approval, stale MFA, and concurrent consumption all fail. |
| RB-U6-07 | P0 | Frontend | RB-U6-05, RB-U6-06 | M | Approval review surface showing exact action, record, diff, sources, warnings, frozen hash, requester, expiry, and confirmation. | Approver can verify the complete payload before approval; no bulk or implicit approval control exists. |
| RB-U6-08 | P0 | QA/Security | RB-U6-01 through RB-U6-07 | L | Curator/authority acceptance suite and independent verification report. | AC-CUR and authorization fixtures pass; every public-state transition has an unbroken request→approval→consumption→audit chain. |

## 10. Unit 7 — Hardening and launch surfaces

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U7-01 | P0 | QA/Security + Backend | Unit 3, 4, 5, and 6 exit gates | L | Exact CSP and security headers; CSRF, XSS, injection, authorization, SSRF, upload, and redirect controls. | Section 24 adverse tests pass in staging; no source checker can reach private/reserved network ranges. |
| RB-U7-02 | P0 | Backend | RB-U5-01, RB-U5-04 | M | Exact public and authenticated rate limits, trusted-proxy handling, structured abuse logs, and fail behavior. | Boundary, burst, spoofed-forwarded-header, concurrent, and recovery tests match Section 14.5. |
| RB-U7-03 | P0 | Product + Human Authority | RB-U0-08 | M | Completed LegalConfig and reconciled Privacy/Terms copy with operator, processors, retention, analytics/cookies, contacts, jurisdiction, and publication date. | No token remains; Human Authority approval receipt exists before route publication. |
| RB-U7-04 | P0 | Frontend + Backend | Unit 3 exit gate | M | Page metadata, canonicals, sitemap, robots, breadcrumbs, ItemList/DefinedTerm/SoftwareApplication-or-Dataset structured data as applicable, and noindex rules. | Validators pass; search/filter/empty compare/curator/token/preview routes are excluded as specified. |
| RB-U7-05 | P0 | Frontend + Product | Unit 3, 4, and 5 exit gates | M | Analytics adapter and Section 21 event dictionary with allowed-property enforcement. | Events fire once; free text, URLs with tokens, email, contributor notes, and other PII are rejected; analytics outage is non-blocking. |
| RB-U7-06 | P0 | QA/Security | Unit 3, 4, 5, and 6 exit gates | L | WCAG 2.2 AA automated and manual accessibility pass plus 200% zoom, 400% reflow, contrast, reduced motion, and screen-reader matrix. | Zero critical/serious automated findings and signed manual evidence for primary journeys. |
| RB-U7-07 | P0 | QA/Security + Backend | Unit 2, 3, 4, 5, and 6 exit gates | L | Performance, cache, database-plan, concurrency, and degraded-dependency tests against the reference fixture. | Section 14.7 budgets pass; email/analytics/source-check outage does not break public reads. |
| RB-U7-08 | P0 | Launch Operator + Data | Unit 1, 5, and 6 exit gates | L | Monitoring, encrypted backups, isolated restore test, incident/rollback/credential/source-failure/email-outage runbooks, and alert ownership. | Restore reaches a usable isolated state; every alert has owner, severity, deduplication, and response link. |

## 11. Unit 8 — Launch candidate and controlled release

| ID | Pri | Owner | Depends on | Size | Deliverable | Acceptance evidence |
|---|---|---|---|---:|---|---|
| RB-U8-01 | P0 | Data + Launch Operator | Unit 7 exit gate | M | Production migration dry run from empty database plus documented rollback/recovery sequence. | Dry run and rollback rehearsal produce timestamps, logs, hashes, row counts, and owner sign-off. |
| RB-U8-02 | P0 | Curator | RB-U2-01; Unit 7 exit gate | L | Launch-day recheck of all starter URLs, source snapshots, material claims, and CALVIN availability/checksum status. | Every URL has exact retrieval outcome; changed claims create new review candidates; CALVIN remains truthful if unresolved. |
| RB-U8-03 | P0 | Product + QA/Security | RB-U8-01, RB-U8-02 | M | Content freeze, release candidate, full Section 25 regression, and Section 30 checklist evidence index. | No lorem/TODO/demo leakage; all launch-blocking checks are linked and green or explicitly No-Go. |
| RB-U8-04 | P0 | Launch Operator | RB-U8-03 | M | Staging smoke suite, email-domain tests, monitoring tests, backup test, and rollback rehearsal. | Public journeys, curator journey, outbox, alert confirmation/unsubscribe, monitoring, backup, and rollback evidence pass. |
| RB-U8-05 | P0 | Independent Verifier | RB-U8-03, RB-U8-04 | M | Independent acceptance report covering provenance, authority, security, privacy, recovery, accessibility, and launch evidence. | Report states Pass/No-Go per launch blocker and identifies any missing owner/evidence without self-approval. |
| RB-U8-06 | P0 | Human Authority | RB-U8-05 | S | Approve or reject legal publication, launch revision hash, initial records, production email, DNS/deployment, and any sole-authority exception. | Separate payload-bound approval receipts exist for each consequential action; no approval is inferred from chat context. |
| RB-U8-07 | P0 | Launch Operator | RB-U8-06 | M | Execute only approved production actions and run post-deploy smoke tests. | Launch receipt records commit, artifact hash, migration, smoke results, public URLs, timestamp, approver, and rollback reference. |
| RB-U8-08 | P0 | Product + Launch Operator | RB-U8-07 | S | Handoff to operations with owner roster, maintenance calendar, stale-source queue, incident links, and first curation review date. | On-call/curation owners acknowledge; no unresolved P0 lacks an owner and dated resolution. |

## 12. Dependency conflict fixture

The deliberate conflict is RB-U3-03 (registry UI) appearing independently implementable before RB-U2-04 (registry API). The backlog resolves it by requiring RB-U2-04 first. Frontend may build against contract fixtures after RB-U0-06, but RB-U3-03 cannot be marked complete until it passes against the implemented API and deterministic pagination.

## 13. Definition of Ready

A ticket is Ready only when:

- its dependencies are complete or an approved fixture contract exists;
- the exact source packet section and acceptance IDs are identified;
- inputs, outputs, owner, data classification, and authority boundary are known;
- unresolved product/vendor decisions are named rather than guessed;
- test fixtures can be created before or with implementation.

## 14. Definition of Done

A ticket is Done only when:

- implementation and migrations are committed;
- success, empty, invalid, unauthorized, stale, conflict, and dependency-failure paths are tested where applicable;
- provenance, audit, privacy, and authority rules remain intact;
- automated evidence is retained and any required manual evidence is signed;
- documentation and runbooks reflect the implemented behavior;
- the accountable owner accepts the output;
- completion does not depend on an unrecorded production action.

## 15. Current handoff state

| Item | State | Next owner | Blocker |
|---|---|---|---|
| MVP product specification | Accepted by Human Authority | Product/Engineering | None |
| Verified seed JSON v1 | Ready for importer implementation | Data + Curator | Launch-day URL recheck remains intentionally open |
| Engineering backlog v1 | Ready for repository intake | Product + Engineering | Unit 0 vendor/operator decisions must be recorded |
| Public launch | Not authorized | Human Authority | Units 0-8 and all launch gates |
| CodeReliability.com | Active in a separate workstream | Separate product team | Must not enter the Robotics repository, data model, release, or acceptance scope |

## 16. Next executable action

Create the RoboticsBenchmarks.com repository/worktree and execute **RB-U0-01 through RB-U0-07**. Present RB-U0-08 as a bounded decision sheet to Human Authority; do not choose production vendors, publish legal pages, enable production email, deploy, change DNS, or publish starter records without the corresponding approval.
