import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const seed = JSON.parse(await readFile(new URL("../canon/roboticsbenchmarks_seed_v1.json", import.meta.url), "utf8"));
const schemaSource = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");

const validateSeedBoundary = (candidate) => {
  assert.equal(candidate.records.length, 10);
  assert.equal(candidate.sources.length, 40);
  assert.ok(candidate.records.every((row) => row.publication_status === "draft" && row.is_demo === false));
  const ids = new Set(candidate.sources.map((source) => source.id));
  assert.ok(candidate.records.every((row) => row.source_ids.every((id) => ids.has(id))));
};

test("seed remains draft-only and source-complete", () => {
  validateSeedBoundary(seed);
});

test("seed contains no result, rank, or traffic rows", () => {
  const text = JSON.stringify(seed);
  for (const key of ["leaderboard_rows", "result_rows", "traffic", "rankings"]) assert.equal(text.includes(`\"${key}\"`), false);
});

test("rejects a fixture that attempts to publish unreviewed seed data", () => {
  const invalid = structuredClone(seed);
  invalid.records[0].publication_status = "published";
  assert.throws(() => validateSeedBoundary(invalid));
});

test("rejects a fixture with a missing provenance source", () => {
  const invalid = structuredClone(seed);
  invalid.sources = invalid.sources.filter((source) => source.id !== invalid.records[0].source_ids[0]);
  invalid.sources.push({ ...invalid.sources[0], id: "fixture-source" });
  assert.throws(() => validateSeedBoundary(invalid));
});

test("Unit 1 schema declares the core benchmark and provenance tables", () => {
  for (const exportName of [
    "benchmarks",
    "categories",
    "benchmarkCategories",
    "benchmarkSettings",
    "entityAliases",
    "organizations",
    "entityMaintainers",
    "embodiments",
    "benchmarkEmbodiments",
    "accessArtifacts",
    "benchmarkVersions",
    "evaluationProtocols",
    "metricDefinitions",
    "sources",
  ]) {
    assert.match(schemaSource, new RegExp(`export const ${exportName} = sqliteTable\\(`), `missing ${exportName}`);
  }
});

test("Unit 1 schema encodes critical draft and identity constraints", () => {
  assert.match(schemaSource, /publicationStatus: text\("publication_status"/);
  assert.match(schemaSource, /isDemo: integer\("is_demo", \{ mode: "boolean" \}\)/);
  assert.match(schemaSource, /uniqueIndex\("benchmarks_slug_uq"\)/);
  assert.match(schemaSource, /check\("benchmarks_freshness_days_check"/);
  assert.match(schemaSource, /uniqueIndex\("benchmark_versions_identity_uq"\)/);
});
