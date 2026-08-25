# AOC Repository Instructions

These provider-neutral instructions govern RoboticsBenchmarks.com.

## Authority and scope

- Human Authority is final for consequential actions.
- AOC governance comes from `Full-Stack-Assets/Canon`; this repository is authoritative for RoboticsBenchmarks implementation and evidence.
- RoboticsBenchmarks is an independent, source-backed benchmark index.
- CodeReliability.com is a separate workstream and must not enter this repository's data model, analytics, or deployment.

## Evidence-first boundary

- All seed records and imported benchmark data remain draft review candidates until separately verified and approved for publication.
- Preserve immutable revisions, deterministic hashing, append-only audit evidence, state-machine guards, collision rules, and source lineage.
- Do not infer benchmark comparability, hardware equivalence, real-robot validity, or reproducibility when evidence is incomplete.
- Never convert a passing schema check into publication authorization.

## Required workflow

1. Run AOC preflight and inspect relevant contracts, ADRs, migrations, operations records, and tests.
2. Make deterministic, reviewable changes with adverse fixtures for boundary behavior.
3. Run `npm ci` when dependencies must be installed and `npm run verify` before claiming completion.
4. Preserve draft-only state in fixtures, imports, UI, and API output.
5. Record verification evidence and limitations.

## Human Authority gates

Production publication, changing a record from draft to approved/published, destructive data migration, public launch, production deployment, protected-branch merge, or cross-project consolidation requires explicit approval.
