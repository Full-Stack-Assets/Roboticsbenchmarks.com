import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const reviewUrl = new URL("canon/reviews/unit-2-seed-review-v1.json", root);
const reviewBytes = await readFile(reviewUrl);
const review = JSON.parse(reviewBytes);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const packet = {
  schema_id: "roboticsbenchmarks.human-review-packet/v1",
  generated_at: "2026-08-25T21:30:00Z",
  work_item_id: "RB-U2-01",
  source_review_sha256: sha256(reviewBytes),
  decision_scope: "Accept, reject, or defer each proposed claim and its exact supporting locator; this packet grants no publication or merge authority.",
  posture: {
    all_decisions_pending: true,
    publication_authorized: false,
    merge_authorized: false,
  },
  claims: review.claims.map((claim) => ({
    claim_id: claim.claim_id,
    entity_slug: claim.entity_slug,
    field_path: claim.field_path,
    value: claim.value,
    supporting_bindings: claim.bindings.filter((binding) => binding.support_type === "supports"),
    decision: "pending_human_review",
    reviewer: null,
    reviewed_at: null,
    decision_note: null,
  })),
};

const packetText = `${JSON.stringify(packet, null, 2)}\n`;
const packetName = "unit-2-human-review-packet-v1.json";
await writeFile(new URL(`canon/reviews/${packetName}`, root), packetText);
await writeFile(new URL(`canon/reviews/${packetName}.sha256`, root), `${sha256(packetText)}  ${packetName}\n`);
