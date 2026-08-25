import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const review = JSON.parse(await readFile(new URL("../canon/reviews/unit-2-seed-review-v1.json", import.meta.url), "utf8"));

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
  assert.equal(review.summary.retrieved_sources, 33);
  assert.equal(review.summary.retrieval_failures, 7);
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

test("unreviewed claims fail closed", () => {
  const pending = review.claims.filter((claim) => claim.review_state === "pending_source_locator");
  assert.equal(review.summary.review_candidates, 21);
  assert.equal(review.summary.pending_source_locators, 1);
  assert.deepEqual(pending.map((claim) => claim.claim_id), ["claim:calvin:health_state"]);
  assert.ok(pending.every((claim) => claim.reviewer === null && claim.reviewed_at === null));
});
