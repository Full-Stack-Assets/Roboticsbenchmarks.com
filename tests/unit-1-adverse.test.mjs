import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { assertConcurrencyVersion, assertNoIdentityCollisions, assertTransition, canonicalize, compileRevision, createAuditEvent, planDraftSeedImport } from "../lib/data-kernel.mjs";

const seed = JSON.parse(await readFile(new URL("../canon/roboticsbenchmarks_seed_v1.json", import.meta.url), "utf8"));

test("canonical revisions are stable across object key order", () => {
  const one = compileRevision({ entityType: "benchmark", entityId: "b1", revisionNumber: 1, manifest: ["name", "scope"], values: { name: "B", scope: { z: 1, a: 2 } } });
  const two = compileRevision({ entityType: "benchmark", entityId: "b1", revisionNumber: 1, manifest: ["scope", "name"], values: { scope: { a: 2, z: 1 }, name: "B" } });
  assert.equal(one.canonicalPayload, two.canonicalPayload);
  assert.equal(one.revisionHash, two.revisionHash);
  assert.notEqual(one.revisionHash, compileRevision({ entityType: "benchmark", entityId: "b1", revisionNumber: 1, manifest: ["name", "scope"], values: { name: "changed", scope: { a: 2, z: 1 } } }).revisionHash);
});

test("canonical serializer rejects non-JSON and manifest rejects missing material fields", () => {
  assert.throws(() => canonicalize(undefined));
  assert.throws(() => canonicalize(Number.NaN));
  assert.throws(() => compileRevision({ entityType: "benchmark", entityId: "b1", revisionNumber: 1, manifest: ["name", "scope"], values: { name: "B" } }), /manifest mismatch/);
});

test("state-machine guards reject publication shortcuts and stale terminal transitions", () => {
  assert.deepEqual(assertTransition("publication", "draft", "in_review"), { machine: "publication", from: "draft", to: "in_review" });
  assert.throws(() => assertTransition("publication", "draft", "published"));
  assert.throws(() => assertTransition("publicationRequest", "consumed", "approved"));
  assert.throws(() => assertTransition("claim", "accepted", "rejected"));
  assert.throws(() => assertTransition("unknown", "draft", "published"));
  assert.equal(assertConcurrencyVersion(3, 3), 3);
  assert.throws(() => assertConcurrencyVersion(2, 3), /stale concurrency version/);
});

test("canonical and alias collisions are normalized and rejected", () => {
  assert.throws(() => assertNoIdentityCollisions([{ slug: "foo-bar", aliases: [] }, { slug: "other", aliases: [" Foo Bar "] }]));
});

test("seed importer produces only draft/unverified plans with exact cardinality", () => {
  const plan = planDraftSeedImport(seed);
  assert.equal(plan.mode, "atomic");
  assert.equal(plan.publicationAuthorized, false);
  assert.equal(plan.rows.filter((row) => row.table === "benchmarks").length, 10);
  assert.equal(plan.rows.filter((row) => row.table === "sources").length, 40);
  assert.ok(plan.rows.filter((row) => row.table === "benchmarks").every((row) => row.publicationStatus === "draft" && row.verificationState === "unverified" && row.isDemo === false));
});

test("seed importer aborts before returning a plan on one adverse record", () => {
  const invalid = structuredClone(seed);
  invalid.records[4].publication_status = "published";
  assert.throws(() => planDraftSeedImport(invalid), /unsafe seed record/);
  const unbound = structuredClone(seed);
  unbound.records[0].claims[0].source_ids = [];
  assert.throws(() => planDraftSeedImport(unbound), /unbound claim/);
});

test("audit event is complete, immutable, and deterministically hashed", () => {
  const event = createAuditEvent({ id: "a1", actor: "curator:1", action: "draft.update", targetType: "benchmark", targetId: "b1", requestId: "r1", reason: "fixture", beforeReference: "rev:1", afterReference: "rev:2", occurredAt: "2026-08-25T12:00:00Z" });
  assert.equal(event.eventHash.length, 64);
  assert.equal(Object.isFrozen(event), true);
  assert.throws(() => createAuditEvent({ id: "a1" }), /required/);
});
