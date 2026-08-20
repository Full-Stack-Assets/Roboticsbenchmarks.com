# RoboticsBenchmarks.com — Unit 0 verification receipt

Generated: 2026-08-20 (America/New_York)

Scope: Unit 0 foundation and first public implementation slice

Branch: `codex/unit-0-foundation`

State: Locally implemented and verified; no GitHub commit, push, pull request, deployment, DNS change, or production binding activation performed.

## Canon binding

| Artifact | SHA-256 |
|---|---|
| Accepted MVP specification | `e7c7496bd618afe8095e8561993cdec6775fc9cd80f0a784fda8e221c0fa7f48` |
| Canonical 10-record seed | `6fbfafc73960ebd8ddfcd6dde4d51c7427e49cfccac2694ebe78a201c8964a42` |
| Accepted engineering backlog | `ad06c59cf215c8bd280154cc9fb8704c9b6f5b4dfe10f2300b313c2eb89b31ad` |
| Social preview asset | `f236de0b766f44c1010b57df3b3e3f3db2de2ae297e591e122f1f9a37f64227f` |
| Dependency lockfile | `72e9a1776b48e93ff914f3b6819e9a1d14042ec665c3ec6ae39148a8e0b6c714` |

The seed remains draft-only. No metric, ranking, traffic, leaderboard, or outcome data was introduced.

## Implemented

- Vinext/React/TypeScript application foundation with deterministic application build ID.
- Homepage, searchable/filterable registry, and benchmark detail routes.
- Responsive design system, keyboard focus treatment, reduced-motion handling, product metadata, and 1200×630 social preview.
- Canon copies, architecture decisions, environment matrix, threat register, API contract, closed JSON schemas, authority decision sheet, and CI workflow.
- Draft-only seed validation, provenance-source completeness checks, cross-product boundary scan, and disabled production adapters.
- Negative fixtures prove rejection of unreviewed publication and missing provenance.

## Verification evidence

`npm run verify` passed end-to-end:

- contract validation: 10 draft records and 40 sources;
- boundary validation: no cross-product or execution interface; D1/R2 production bindings disabled;
- application TypeScript check: passed;
- ESLint: passed with zero findings;
- contract tests: 4 passed, including two adverse fixtures;
- production build: passed for `/`, `/benchmarks`, and `/benchmarks/:slug`;
- rendered HTML identity test: passed.
- dependency audit: zero high or critical findings; four moderate findings remain in the development-only `drizzle-kit` loader chain, for which npm offers only a breaking downgrade.

Two additional clean builds completed without changing any source file or the lockfile. The Vinext runtime deliberately injects a fresh draft-mode secret per build, so compiled server bytes are not treated as a reproducibility invariant.

## Human Authority gates still closed

- Git staging, commit, GitHub push, and pull-request creation.
- Hosting checkpoint or production deployment.
- Database, transactional email, authentication/MFA, analytics, monitoring, and source-health automation.
- Privacy/Terms publication pending operator identity and retention decisions.
- Publication of any draft benchmark record.

The required selections are listed in `docs/operations/RB-U0-08-decision-sheet.md`.

## Next controlled action

After explicit authorization: stage the Unit 0 files, create one commit on `codex/unit-0-foundation`, push that branch to `Full-Stack-Assets/Roboticsbenchmarks.com`, and open a draft pull request against `main`. Deployment remains a separate authority gate.
