import { createHash } from "node:crypto";

const jsonScalar = (value) =>
  value === null || typeof value === "boolean" || typeof value === "string" ||
  (typeof value === "number" && Number.isFinite(value));

export function canonicalize(value) {
  if (jsonScalar(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  throw new TypeError("Only finite JSON values can be canonicalized");
}

export const sha256 = (value) => createHash("sha256").update(typeof value === "string" ? value : canonicalize(value)).digest("hex");

export function compileRevision({ entityType, entityId, revisionNumber, manifest, values, parentRevisionHash = null }) {
  if (!Number.isInteger(revisionNumber) || revisionNumber < 1) throw new Error("revisionNumber must be a positive integer");
  const fieldPaths = [...new Set(manifest)].sort();
  const missing = fieldPaths.filter((field) => !(field in values));
  const extra = Object.keys(values).filter((field) => !fieldPaths.includes(field));
  if (missing.length || extra.length) throw new Error(`manifest mismatch: missing=${missing.join(",")} extra=${extra.join(",")}`);
  const payload = { entityType, entityId, revisionNumber, parentRevisionHash, fields: Object.fromEntries(fieldPaths.map((field) => [field, values[field]])) };
  const canonicalPayload = canonicalize(payload);
  return { canonicalPayload, revisionHash: sha256(canonicalPayload), fieldValues: fieldPaths.map((fieldPath) => ({ fieldPath, valueJson: canonicalize(values[fieldPath]), valueHash: sha256(values[fieldPath]) })) };
}

export const TRANSITIONS = Object.freeze({
  publication: { draft: ["in_review"], in_review: ["draft", "frozen"], frozen: ["published", "draft"], published: ["archived"], archived: [] },
  claim: { proposed: ["accepted", "rejected", "disputed"], disputed: ["accepted", "rejected"], accepted: ["disputed"], rejected: ["proposed"] },
  contribution: { pending: ["in_review", "rejected"], in_review: ["accepted", "rejected", "needs_information"], needs_information: ["in_review", "rejected"], accepted: [], rejected: [] },
  subscription: { pending: ["active", "cancelled"], active: ["unsubscribed"], cancelled: [], unsubscribed: [] },
  publicationRequest: { pending: ["approved", "rejected", "expired"], approved: ["consumed", "expired"], rejected: [], expired: [], consumed: [] },
});

export function assertTransition(machine, from, to) {
  if (!TRANSITIONS[machine]?.[from]?.includes(to)) throw new Error(`invalid ${machine} transition: ${from} -> ${to}`);
  return { machine, from, to };
}

export function assertConcurrencyVersion(expected, actual) {
  if (!Number.isInteger(expected) || !Number.isInteger(actual) || expected !== actual) throw new Error(`stale concurrency version: expected ${expected}, actual ${actual}`);
  return actual;
}

export function normalizeIdentity(value) {
  return value.normalize("NFKC").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function assertNoIdentityCollisions(records) {
  const owners = new Map();
  for (const record of records) {
    for (const raw of [record.slug, ...(record.aliases ?? [])]) {
      const key = normalizeIdentity(raw);
      if (!key || (owners.has(key) && owners.get(key) !== record.slug)) throw new Error(`canonical identity collision: ${raw}`);
      owners.set(key, record.slug);
    }
  }
}

export function planDraftSeedImport(seed, { actor = "seed-importer", importedAt = seed.generated_at } = {}) {
  if (seed.records?.length !== 10 || seed.sources?.length !== 40) throw new Error("seed cardinality mismatch");
  assertNoIdentityCollisions(seed.records);
  const sources = new Map(seed.sources.map((source) => [source.id, source]));
  const rows = [];
  for (const record of seed.records) {
    if (record.publication_status !== "draft" || record.is_demo !== false) throw new Error(`unsafe seed record: ${record.slug}`);
    if (!record.claims?.length) throw new Error(`missing material claims: ${record.slug}`);
    for (const sourceId of record.source_ids) if (!sources.has(sourceId)) throw new Error(`missing source ${sourceId}`);
    rows.push({ table: "benchmarks", id: `benchmark:${record.slug}`, slug: record.slug, publicationStatus: "draft", verificationState: "unverified", isDemo: false, actor, importedAt });
    for (const claim of record.claims) {
      if (!claim.source_ids?.length) throw new Error(`unbound claim ${record.slug}:${claim.claim_key}`);
      for (const sourceId of claim.source_ids) if (!sources.has(sourceId)) throw new Error(`missing claim source ${sourceId}`);
      rows.push({ table: "evidence_claims", id: `claim:${record.slug}:${claim.claim_key}`, benchmarkId: `benchmark:${record.slug}`, fieldPath: claim.claim_key, valueJson: canonicalize(claim.value), evidenceState: "proposed", confidence: "low", createdBy: actor, sourceIds: [...claim.source_ids].sort() });
    }
  }
  for (const source of [...sources.values()].sort((a, b) => a.id.localeCompare(b.id))) rows.push({ table: "sources", ...source, benchmarkId: `benchmark:${source.entity_slug}` });
  return { mode: "atomic", publicationAuthorized: false, rows };
}

export function createAuditEvent(input) {
  for (const key of ["id", "actor", "action", "targetType", "targetId", "requestId", "reason", "occurredAt"]) if (!input[key]) throw new Error(`audit ${key} is required`);
  const event = { ...input };
  return Object.freeze({ ...event, eventHash: sha256(event) });
}
