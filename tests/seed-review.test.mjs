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
  assert.ok(review.claims.every((claim) => claim.evidence_state === "proposed"));
});

test("review candidates require an exact supporting source locator", () => {
  for (const claim of review.claims.filter((item) => item.review_state === "review_candidate")) {
    assert.ok(claim.bindings.some((binding) => binding.support_type === "supports" && binding.locator_value));
  }
});

test("unreviewed claims fail closed", () => {
  assert.ok(review.claims.some((claim) => claim.review_state === "pending_source_locator"));
  assert.ok(review.claims.filter((claim) => claim.review_state === "pending_source_locator").every((claim) => claim.reviewer === null && claim.reviewed_at === null));
});
