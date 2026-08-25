import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const seed = JSON.parse(await readFile(new URL("canon/roboticsbenchmarks_seed_v1.json", root), "utf8"));
const locatorOverrides = JSON.parse(await readFile(new URL("canon/reviews/source-locators-v1.json", root), "utf8"));
const locators = new Map(locatorOverrides.locators.map((item) => [`${item.claim_id}:${item.source_id}`, item]));
const retrievedSourceIds = new Set(locatorOverrides.retrieved_source_ids);
const retrievalFailures = new Map(locatorOverrides.retrieval_failures.map((item) => [item.source_id, item]));
const retrievedAt = "2026-08-25T17:30:00Z";
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

for (const sourceId of retrievedSourceIds) {
  if (retrievalFailures.has(sourceId)) throw new Error(`Source ${sourceId} cannot be both retrieved and failed`);
}

const sources = seed.sources.map((source) => {
  const failure = retrievalFailures.get(source.id);
  const reviewRetrievalState = retrievedSourceIds.has(source.id)
    ? "retrieved"
    : failure
      ? "retrieval_failed"
      : "pending_retrieval";
  return {
    source_id: source.id,
    entity_slug: source.entity_slug,
    url: source.url,
    source_type: source.source_type,
    prior_retrieved_on: source.retrieved_on,
    review_retrieval_state: reviewRetrievalState,
    retrieval_outcome: failure?.outcome ?? null,
    retrieval_note: failure?.note ?? null,
    reviewed_at: reviewRetrievalState === "pending_retrieval" ? null : retrievedAt,
  };
});

const claims = seed.records.flatMap((record) => record.claims.map((claim) => {
  const claimId = `claim:${record.slug}:${claim.claim_key}`;
  const bindings = claim.source_ids.map((sourceId) => {
    const locator = locators.get(`${claimId}:${sourceId}`);
    return {
      source_id: sourceId,
      locator_type: locator?.locator_type ?? null,
      locator_value: locator?.locator_value ?? null,
      support_type: locator?.support_type ?? "pending_review",
    };
  });
  const independentlyLocatable = bindings.some((binding) => binding.support_type === "supports" && binding.locator_value);
  return {
    claim_id: claimId,
    entity_slug: record.slug,
    field_path: claim.claim_key,
    value: claim.value,
    bindings,
    review_state: independentlyLocatable ? "review_candidate" : "pending_source_locator",
    evidence_state: "proposed",
    reviewer: null,
    reviewed_at: null,
  };
}));

const ledger = {
  schema_id: "roboticsbenchmarks.seed-review/v1",
  generated_at: retrievedAt,
  source_seed_sha256: sha256(JSON.stringify(seed)),
  posture: {
    publication_authorized: false,
    accepted_claims_written: false,
    production_write_authorized: false,
    review_rule: "A claim remains proposed until a human reviewer confirms an exact locator in a retrieved source snapshot.",
  },
  receipt: {
    work_item_id: "RB-U2-01",
    outcome: "draft_review_packet",
    evidence_methods: ["primary_web_retrieval", "arxiv_source_archive", "official_repository"],
    human_acceptance_recorded: false,
    publication_authorized: false,
  },
  summary: {
    records: seed.records.length,
    sources: sources.length,
    claims: claims.length,
    retrieved_sources: sources.filter((source) => source.review_retrieval_state === "retrieved").length,
    retrieval_failures: sources.filter((source) => source.review_retrieval_state === "retrieval_failed").length,
    pending_retrieval_sources: sources.filter((source) => source.review_retrieval_state === "pending_retrieval").length,
    located_bindings: claims.flatMap((claim) => claim.bindings).filter((binding) => binding.locator_value).length,
    review_candidates: claims.filter((claim) => claim.review_state === "review_candidate").length,
    pending_source_locators: claims.filter((claim) => claim.review_state === "pending_source_locator").length,
  },
  sources,
  claims,
};

await mkdir(new URL("canon/reviews/", root), { recursive: true });
await writeFile(new URL("canon/reviews/unit-2-seed-review-v1.json", root), `${JSON.stringify(ledger, null, 2)}\n`);
