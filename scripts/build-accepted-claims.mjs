import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const packetName = "unit-2-human-review-packet-v1.json";
const decisionName = "unit-2-human-review-decision-v1.json";
const manifestName = "unit-2-accepted-claims-v1.json";
const reviewDirectory = new URL("canon/reviews/", root);
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const packetBytes = await readFile(new URL(packetName, reviewDirectory));
const packet = JSON.parse(packetBytes);
const packetChecksum = (await readFile(new URL(`${packetName}.sha256`, reviewDirectory), "utf8")).trim().split(/\s+/)[0];
const decisionBytes = await readFile(new URL(decisionName, reviewDirectory));
const decision = JSON.parse(decisionBytes);
const actualPacketChecksum = sha256(packetBytes);

if (actualPacketChecksum !== packetChecksum || decision.packet.sha256 !== actualPacketChecksum) {
  throw new Error("Human review decision is not bound to the immutable review packet");
}
if (decision.decision !== "accept_all" || decision.scope.claim_acceptance_authorized !== true) {
  throw new Error("Decision receipt does not authorize claim acceptance");
}
if (decision.scope.merge_authorized || decision.scope.publication_authorized || decision.scope.production_write_authorized) {
  throw new Error("Claim acceptance must not grant merge, publication, or production-write authority");
}

const packetClaimIds = packet.claims.map((claim) => claim.claim_id);
const acceptedClaimIds = decision.accepted_claim_ids;
if (new Set(packetClaimIds).size !== packetClaimIds.length || new Set(acceptedClaimIds).size !== acceptedClaimIds.length) {
  throw new Error("Claim IDs must be unique");
}
if (decision.claim_count !== packetClaimIds.length || JSON.stringify(acceptedClaimIds) !== JSON.stringify(packetClaimIds)) {
  throw new Error("Decision receipt must accept every claim in packet order and no others");
}
if (packet.claims.some((claim) => claim.decision !== "pending_human_review" || claim.supporting_bindings.length === 0)) {
  throw new Error("Review packet is not a complete pending decision set with supporting evidence");
}

const decisionChecksum = sha256(decisionBytes);
const manifest = {
  schema_id: "roboticsbenchmarks.accepted-claims-manifest/v1",
  work_item_id: decision.work_item_id,
  generated_at: decision.decided_at,
  packet: {
    path: decision.packet.path,
    sha256: actualPacketChecksum,
  },
  decision_receipt: {
    path: `canon/reviews/${decisionName}`,
    sha256: decisionChecksum,
    decision_id: decision.decision_id,
  },
  posture: {
    claims_accepted: true,
    merge_authorized: false,
    publication_authorized: false,
    production_write_authorized: false,
  },
  summary: {
    accepted_claims: packetClaimIds.length,
    rejected_claims: 0,
    deferred_claims: 0,
  },
  claims: packet.claims.map((claim) => ({
    claim_id: claim.claim_id,
    entity_slug: claim.entity_slug,
    field_path: claim.field_path,
    value: claim.value,
    supporting_bindings: claim.supporting_bindings,
    evidence_state: "accepted",
    reviewer: decision.reviewer,
    reviewed_at: decision.decided_at,
    decision_note: "Accepted by explicit Human Authority directive; publication and merge remain separately gated.",
  })),
};

const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(new URL(`${decisionName}.sha256`, reviewDirectory), `${decisionChecksum}  ${decisionName}\n`);
await writeFile(new URL(manifestName, reviewDirectory), manifestText);
await writeFile(new URL(`${manifestName}.sha256`, reviewDirectory), `${sha256(manifestText)}  ${manifestName}\n`);
