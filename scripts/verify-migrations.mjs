import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";

const files = (await readdir(new URL("../drizzle/", import.meta.url))).filter((name) => /^\d+_.+\.sql$/.test(name)).sort();
assert.ok(files.length > 0, "at least one deterministic migration is required");
const sql = await readFile(new URL(`../drizzle/${files.at(-1)}`, import.meta.url), "utf8");
for (const table of ["benchmarks", "evidence_claims", "entity_revisions", "revision_field_values", "material_field_manifests", "audit_events"]) assert.ok(sql.includes(`CREATE TABLE \`${table}\``), `migration missing ${table}`);
for (const trigger of ["entity_revisions_immutable_update", "entity_revisions_immutable_delete", "evidence_claim_acceptance_guard_insert", "evidence_claim_acceptance_guard_update", "audit_events_append_only_update", "audit_events_append_only_delete"]) assert.match(sql, new RegExp(trigger), `migration missing ${trigger}`);
const database = new DatabaseSync(":memory:");
database.exec("PRAGMA foreign_keys = ON");
for (const statement of sql.split("--> statement-breakpoint").map((part) => part.trim()).filter(Boolean)) database.exec(statement);
database.prepare("INSERT INTO audit_events (id, actor, action, target_type, target_id, request_id, reason, occurred_at, event_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run("audit:1", "fixture", "verify", "migration", "unit-1", "request:1", "migration adverse check", "2026-08-25T12:00:00Z", "fixture-hash");
assert.throws(() => database.prepare("UPDATE audit_events SET reason = ? WHERE id = ?").run("tampered", "audit:1"), /append-only/);
assert.throws(() => database.prepare("DELETE FROM audit_events WHERE id = ?").run("audit:1"), /append-only/);
database.close();
console.log(`verified ${files.length} deterministic migration artifact(s)`);
