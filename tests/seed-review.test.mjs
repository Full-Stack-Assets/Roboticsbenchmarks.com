import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const review = JSON.parse(await readFile(new URL("../canon/reviews/unit-2-seed-review-v1.json", import.meta.url), "utf8"));
const calvinHealth = JSON.parse(await readFile(new URL("../canon/reviews/calvin-health-2026-08-25.json", import.meta.url), "utf8"));
const calvinManifest = await readFile(new URL("../canon/reviews/snapshots/calvin-sha256sum-2026-08-25.txt", import.meta.url), "utf8");

test("Unit 2 review ledger covers the complete seed without publishing", () => {
  assert.equal(review.summary.records, 10);
  assert.equal(review.summary.sources, 40);
  assert.equal(review.posture.publication_authorized, false);
  assert.equal(review.posture.accepted_claims_written, false);
  assert.equal(review.posture.production_write_authorized, false);
  assert.equal(review.receipt.outcome, "draft_review_packet");
  assert.equal(review.receipt.human_acceptance_recorded, false);
  assert.equal(review.receipt.publication_authorized, false);
  assert.ok(review.claims.every((claim) => claim.evidence_state === "proposed"));
});

test("review candidates require an exact supporting source locator", () => {
  for (const claim of review.claims.filter((item) => item.review_state === "review_candidate")) {
    assert.ok(claim.bindings.some((binding) => binding.support_type === "supports" && binding.locator_value));
  }
});

test("source retrieval attempts are exhaustive and fail closed", () => {
  assert.equal(review.summary.retrieved_sources, 34);
  assert.equal(review.summary.retrieval_failures, 6);
  assert.equal(review.summary.pending_retrieval_sources, 0);
  assert.equal(review.summary.retrieved_sources + review.summary.retrieval_failures, review.summary.sources);
  assert.ok(review.sources.filter((source) => source.review_retrieval_state === "retrieval_failed")
    .every((source) => source.retrieval_outcome && source.retrieval_note && source.reviewed_at));
});

test("supporting locators only reference retrieved sources", () => {
  const sourceStates = new Map(review.sources.map((source) => [source.source_id, source.review_retrieval_state]));
  for (const binding of review.claims.flatMap((claim) => claim.bindings)) {
    if (binding.support_type === "supports") assert.equal(sourceStates.get(binding.source_id), "retrieved");
  }
});

test("all claims are independently locatable without being accepted", () => {
  const pending = review.claims.filter((claim) => claim.review_state === "pending_source_locator");
  assert.equal(review.summary.review_candidates, 22);
  assert.equal(review.summary.pending_source_locators, 0);
  assert.deepEqual(pending, []);
  assert.ok(review.claims.every((claim) => claim.reviewer === null && claim.reviewed_at === null));
});

test("CALVIN health receipt preserves endpoint and checksum-manifest evidence", () => {
  const manifestEntries = new Map(calvinManifest.trim().split("\n").map((line) => {
    const [digest, fileName] = line.split(/\s+/);
    return [fileName, digest];
  }));
  assert.equal(createHash("sha256").update(calvinManifest).digest("hex"), calvinHealth.checksum_manifest.snapshot_sha256);
  assert.equal(calvinHealth.project_endpoint.status, 200);
  assert.equal(calvinHealth.archive_endpoints.length, 4);
  assert.ok(calvinHealth.archive_endpoints.every((archive) => archive.status === 200 && manifestEntries.get(archive.file_name) === archive.manifest_sha256));
  assert.equal(calvinHealth.verification.full_archive_checksums_recomputed, false);
  assert.equal(calvinHealth.posture.launch_day_recheck_required, true);
  assert.equal(calvinHealth.posture.publication_authorized, false);
});
