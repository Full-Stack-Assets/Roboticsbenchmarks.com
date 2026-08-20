# RoboticsBenchmarks.com

Independent, source-backed index for discovering and comparing robotics benchmarks across simulation, real-robot, hybrid, and compute settings.

## Current status

Unit 0 foundation is implemented on `codex/unit-0-foundation`. The public MVP is not launched. Seed records remain review candidates and are not publication authorization.

## Local verification

```bash
npm ci
npm run verify
```

`verify` runs contract checks, TypeScript, lint, boundary checks, tests, and the production build. Runtime and package versions are pinned by `package.json` and `package-lock.json`.

## Repository boundaries

- `app/` — public and protected product routes
- `lib/` — typed domain/view-model helpers
- `contracts/` — versioned API, seed, analytics, and legal schemas
- `canon/` — accepted seed/backlog inputs and lineage
- `docs/adr/` — architecture decisions
- `docs/operations/` — environment, threat, and decision records
- `tests/` — deterministic contract and rendered-output checks

CodeReliability.com is a separate workstream and must not enter this repository, data model, analytics, or deployment.
