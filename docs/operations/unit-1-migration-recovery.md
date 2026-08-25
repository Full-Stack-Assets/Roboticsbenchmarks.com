# Unit 1 migration and recovery procedure

Status: draft-only; no production execution is authorized.

1. Start from a clean disposable SQLite/D1-compatible database with foreign keys enabled.
2. Apply committed files in `drizzle/` lexicographic order and record each filename and SHA-256.
3. Run `npm run db:check` and `npm run verify` before accepting the database for preview use.
4. Recovery is forward-only: restore the pre-migration database snapshot into a new isolated database, verify its checksum, then switch the non-production binding back only after review. Do not edit or reverse immutable revisions, snapshots, or audit events.
5. If any statement fails, discard the partial disposable database. Production bindings, publication state, DNS, and seed publication remain outside Unit 1 authority.

The seed importer produces an atomic draft plan only. It does not publish, mark evidence accepted, or target a production binding.
