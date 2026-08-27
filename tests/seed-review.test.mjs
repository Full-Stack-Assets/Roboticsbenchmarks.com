import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const review = JSON.parse(await readFile(new URL("../canon/reviews/unit-2-seed-review-v1.json", import.meta.url), "utf8"));
const calvinHealth = JSON.parse(await readFile(new URL("../canon/reviews/calvin-health-2026-08-25.json", import.meta.url), "utf8"));
const calvinManifest = await readFile(new URL("../canon/reviews/snapshots/calvin-sha256sum-2026-08-25.txt", import.meta.url), "utf8");
const humanPacketBytes = await readFile(new URL("../canon/reviews/unit-2-human-review-packet-v1.json", import.meta.url));
const humanPacket = JSON.parse(humanPacketBytes);
const humanPacketChecksum = await readFile(new URL("../canon/reviews/unit-2-human-review-packet-v1.json.sha256", import.meta.url), "utf8");
const humanDecisionBytes = await readFile(new URL("../canon/reviews/unit-2-human-review-decision-v1.json", import.meta.url));
const humanDecision = JSON.parse(humanDecisionBytes);
const humanDecisionChecksum = await readFile(new URL("../canon/reviews/unit-2-human-review-decision-v1.json.sha256", import.meta.url), "utf8");
const acceptedManifestBytes = await readFile(new URL("../canon/reviews/unit-2-accepted-claims-v1.json", import.meta.url));
const acceptedManifest = JSON.parse(acceptedManifestBytes);
const acceptedManifestChecksum = await readFile(new URL("../canon/reviews/unit-2-accepted-claims-v1.json.sha256", import.meta.url), "utf8");

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

test("human review packet is complete, payload-bound, and grants no authority", () => {
  const expectedChecksum = humanPacketChecksum.trim().split(/\s+/)[0];
  assert.equal(createHash("sha256").update(humanPacketBytes).digest("hex"), expectedChecksum);
  assert.equal(humanPacket.claims.length, review.claims.length);
  assert.deepEqual(humanPacket.claims.map((claim) => claim.claim_id), review.claims.map((claim) => claim.claim_id));
  assert.ok(humanPacket.claims.every((claim) => claim.supporting_bindings.length > 0));
  assert.ok(humanPacket.claims.every((claim) => claim.decision === "pending_human_review" && claim.reviewer === null && claim.reviewed_at === null));
  assert.equal(humanPacket.posture.publication_authorized, false);
  assert.equal(humanPacket.posture.merge_authorized, false);
});

test("human decision accepts exactly the packet claims without granting publication", () => {
  const packetChecksum = createHash("sha256").update(humanPacketBytes).digest("hex");
  const decisionChecksum = createHash("sha256").update(humanDecisionBytes).digest("hex");
  const manifestChecksum = createHash("sha256").update(acceptedManifestBytes).digest("hex");
  assert.equal(packetChecksum, "7534e8c065f26d341993d225b2a220c51ea3843f33e8003dc363cc531b9fcd90");
  assert.equal(humanDecision.packet.sha256, packetChecksum);
  assert.equal(humanDecisionChecksum.trim().split(/\s+/)[0], decisionChecksum);
  assert.equal(acceptedManifest.decision_receipt.sha256, decisionChecksum);
  assert.equal(acceptedManifestChecksum.trim().split(/\s+/)[0], manifestChecksum);
  assert.deepEqual(humanDecision.accepted_claim_ids, humanPacket.claims.map((claim) => claim.claim_id));
  assert.equal(acceptedManifest.summary.accepted_claims, 22);
  assert.equal(acceptedManifest.claims.length, 22);
  assert.ok(acceptedManifest.claims.every((claim) => claim.evidence_state === "accepted"));
  assert.ok(acceptedManifest.claims.every((claim) => claim.reviewer.id === "human_authority:nic" && claim.reviewed_at === humanDecision.decided_at));
  assert.ok(acceptedManifest.claims.every((claim) => claim.supporting_bindings.length > 0));
  assert.equal(acceptedManifest.posture.merge_authorized, false);
  assert.equal(acceptedManifest.posture.publication_authorized, false);
  assert.equal(acceptedManifest.posture.production_write_authorized, false);
});
