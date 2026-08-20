import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));

const seed = await readJson("canon/roboticsbenchmarks_seed_v1.json");
const publicSchema = await readJson("contracts/benchmark.public.schema.json");
const seedSchema = await readJson("contracts/seed-import.schema.json");
const analyticsSchema = await readJson("contracts/analytics-events.schema.json");
const legalSchema = await readJson("contracts/legal-config.schema.json");

assert.equal(seed.schema_id, "roboticsbenchmarks.seed/v1");
assert.equal(seed.schema_version, "1.0.0");
assert.equal(seed.records.length, 10);
assert.equal(seed.sources.length, 40);
assert.equal(new Set(seed.records.map((record) => record.slug)).size, 10);
assert.equal(new Set(seed.sources.map((source) => source.id)).size, 40);
assert.ok(seed.records.every((record) => record.publication_status === "draft" && record.is_demo === false));
assert.ok(seed.records.every((record) => record.source_ids.every((id) => seed.sources.some((source) => source.id === id))));
assert.equal(publicSchema.additionalProperties, false);
assert.equal(seedSchema.additionalProperties, false);
assert.equal(analyticsSchema.additionalProperties, false);
assert.equal(legalSchema.additionalProperties, false);
console.log("contract validation passed: 10 draft records, 40 sources, closed public/analytics/legal schemas");
