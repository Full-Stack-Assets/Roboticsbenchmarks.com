import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    selectionGuidanceMd: text("selection_guidance_md"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("categories_slug_uq").on(table.slug)]
);

export const benchmarks = sqliteTable(
  "benchmarks",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    canonicalName: text("canonical_name").notNull(),
    shortName: text("short_name"),
    entityKind: text("entity_kind").notNull(),
    primaryCategoryId: text("primary_category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    summary: text("summary").notNull().default(""),
    descriptionMd: text("description_md"),
    scopeSummary: text("scope_summary").notNull(),
    accessState: text("access_state").notNull(),
    officialUrl: text("official_url").notNull(),
    lifecycleStatus: text("lifecycle_status").notNull().default("unknown"),
    publicationStatus: text("publication_status").notNull().default("draft"),
    verificationState: text("verification_state").notNull().default("unverified"),
    freshnessDays: integer("freshness_days").notNull().default(90),
    firstReleasedOn: text("first_released_on"),
    currentVersionId: text("current_version_id"),
    isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
    publishedAt: text("published_at"),
    archivedAt: text("archived_at"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("benchmarks_slug_uq").on(table.slug),
    index("benchmarks_publication_verification_idx").on(table.publicationStatus, table.verificationState),
    index("benchmarks_category_publication_idx").on(table.primaryCategoryId, table.publicationStatus),
    check("benchmarks_freshness_days_check", sql`${table.freshnessDays} between 7 and 365`),
    check(
      "benchmarks_demo_not_published_check",
      sql`not (${table.isDemo} = 1 and ${table.publicationStatus} = 'published')`
    ),
    check(
      "benchmarks_archive_state_check",
      sql`${table.archivedAt} is null or ${table.publicationStatus} = 'archived'`
    ),
  ]
);

export const benchmarkCategories = sqliteTable(
  "benchmark_categories",
  {
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    relationship: text("relationship").notNull().default("secondary"),
  },
  (table) => [primaryKey({ columns: [table.benchmarkId, table.categoryId] })]
);

export const benchmarkSettings = sqliteTable(
  "benchmark_settings",
  {
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    setting: text("setting").notNull(),
  },
  (table) => [primaryKey({ columns: [table.benchmarkId, table.setting] })]
);

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    displayName: text("display_name").notNull(),
    tagGroup: text("tag_group"),
    description: text("description"),
  },
  (table) => [uniqueIndex("tags_slug_uq").on(table.slug)]
);

export const benchmarkTags = sqliteTable(
  "benchmark_tags",
  {
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.benchmarkId, table.tagId] })]
);

export const entityAliases = sqliteTable(
  "entity_aliases",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    aliasText: text("alias_text").notNull(),
    normalizedAlias: text("normalized_alias").notNull(),
    aliasType: text("alias_type").notNull(),
    redirectSlug: text("redirect_slug"),
    activeFrom: text("active_from"),
    activeTo: text("active_to"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("entity_aliases_benchmark_alias_uq").on(table.benchmarkId, table.normalizedAlias),
    uniqueIndex("entity_aliases_redirect_slug_uq").on(table.redirectSlug),
    index("entity_aliases_lookup_idx").on(table.normalizedAlias),
  ]
);

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    canonicalName: text("canonical_name").notNull(),
    officialUrl: text("official_url"),
    ...timestamps,
  },
  (table) => [uniqueIndex("organizations_slug_uq").on(table.slug)]
);

export const entityMaintainers = sqliteTable(
  "entity_maintainers",
  {
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "restrict" }),
    relationship: text("relationship").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    activeFrom: text("active_from"),
    activeTo: text("active_to"),
  },
  (table) => [primaryKey({ columns: [table.benchmarkId, table.organizationId, table.relationship] })]
);

export const embodiments = sqliteTable(
  "embodiments",
  {
    id: text("id").primaryKey(),
    manufacturer: text("manufacturer"),
    model: text("model"),
    freeTextName: text("free_text_name"),
    embodimentType: text("embodiment_type"),
    ...timestamps,
  },
  (table) => [index("embodiments_manufacturer_model_idx").on(table.manufacturer, table.model)]
);

export const benchmarkEmbodiments = sqliteTable(
  "benchmark_embodiments",
  {
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    embodimentId: text("embodiment_id")
      .notNull()
      .references(() => embodiments.id, { onDelete: "restrict" }),
    relationship: text("relationship").notNull(),
    versionScope: text("version_scope"),
    protocolScope: text("protocol_scope"),
  },
  (table) => [primaryKey({ columns: [table.benchmarkId, table.embodimentId, table.relationship] })]
);

export const benchmarkVersions = sqliteTable(
  "benchmark_versions",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "restrict" }),
    versionLabel: text("version_label").notNull(),
    normalizedVersionLabel: text("normalized_version_label").notNull(),
    versionType: text("version_type").notNull(),
    releasedOn: text("released_on"),
    status: text("status").notNull().default("unknown"),
    changeSummary: text("change_summary"),
    identityClaimId: text("identity_claim_id"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("benchmark_versions_identity_uq").on(
      table.benchmarkId,
      table.normalizedVersionLabel,
      table.versionType
    ),
    index("benchmark_versions_benchmark_status_idx").on(table.benchmarkId, table.status),
  ]
);

export const evaluationProtocols = sqliteTable(
  "evaluation_protocols",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "restrict" }),
    benchmarkVersionId: text("benchmark_version_id").references(() => benchmarkVersions.id, {
      onDelete: "restrict",
    }),
    name: text("name").notNull(),
    protocolStatus: text("protocol_status").notNull().default("unknown"),
    description: text("description"),
    taskSet: text("task_set"),
    splitDefinition: text("split_definition"),
    observationSpace: text("observation_space"),
    actionSpace: text("action_space"),
    resetConditions: text("reset_conditions"),
    terminationConditions: text("termination_conditions"),
    runCount: integer("run_count"),
    seedPolicy: text("seed_policy"),
    timeLimit: text("time_limit"),
    hardwareOrSimulator: text("hardware_or_simulator"),
    aggregationMethod: text("aggregation_method"),
    missingRunTreatment: text("missing_run_treatment"),
    comparabilityNotes: text("comparability_notes"),
    identityClaimId: text("identity_claim_id"),
    ...timestamps,
  },
  (table) => [index("evaluation_protocols_benchmark_version_idx").on(table.benchmarkId, table.benchmarkVersionId)]
);

export const metricDefinitions = sqliteTable(
  "metric_definitions",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "restrict" }),
    benchmarkVersionId: text("benchmark_version_id").references(() => benchmarkVersions.id, {
      onDelete: "restrict",
    }),
    evaluationProtocolId: text("evaluation_protocol_id").references(() => evaluationProtocols.id, {
      onDelete: "restrict",
    }),
    name: text("name").notNull(),
    shortName: text("short_name"),
    definition: text("definition").notNull(),
    formulaLatex: text("formula_latex"),
    direction: text("direction"),
    unit: text("unit"),
    valueType: text("value_type"),
    rangeMin: text("range_min"),
    rangeMax: text("range_max"),
    aggregation: text("aggregation"),
    successThreshold: text("success_threshold"),
    missingRunTreatment: text("missing_run_treatment"),
    isPrimaryWithinProtocol: integer("is_primary_within_protocol", { mode: "boolean" })
      .notNull()
      .default(false),
    comparabilityNotes: text("comparability_notes"),
    identityClaimId: text("identity_claim_id"),
    ...timestamps,
  },
  (table) => [
    index("metric_definitions_scope_idx").on(table.benchmarkId, table.benchmarkVersionId, table.evaluationProtocolId),
    check(
      "metric_primary_requires_protocol_check",
      sql`${table.isPrimaryWithinProtocol} = 0 or ${table.evaluationProtocolId} is not null`
    ),
  ]
);

export const resources = sqliteTable(
  "resources",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    resourceType: text("resource_type").notNull(),
    publisherOrganizationId: text("publisher_organization_id").references(() => organizations.id, {
      onDelete: "restrict",
    }),
    inclusionReason: text("inclusion_reason"),
    officialUrl: text("official_url").notNull(),
    relatedBenchmarkId: text("related_benchmark_id").references(() => benchmarks.id, {
      onDelete: "set null",
    }),
    publicationStatus: text("publication_status").notNull().default("draft"),
    verificationState: text("verification_state").notNull().default("unverified"),
    freshnessDays: integer("freshness_days").notNull().default(90),
    activeRevisionId: text("active_revision_id"),
    isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("resources_slug_uq").on(table.slug),
    check("resources_freshness_days_check", sql`${table.freshnessDays} between 7 and 365`),
    check(
      "resources_demo_not_published_check",
      sql`not (${table.isDemo} = 1 and ${table.publicationStatus} = 'published')`
    ),
  ]
);

export const accessArtifacts = sqliteTable(
  "access_artifacts",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id")
      .notNull()
      .references(() => benchmarks.id, { onDelete: "cascade" }),
    benchmarkVersionId: text("benchmark_version_id").references(() => benchmarkVersions.id, {
      onDelete: "cascade",
    }),
    evaluationProtocolId: text("evaluation_protocol_id").references(() => evaluationProtocols.id, {
      onDelete: "cascade",
    }),
    artifactType: text("artifact_type").notNull(),
    url: text("url"),
    structuredValueJson: text("structured_value_json"),
    accessState: text("access_state").notNull().default("unknown"),
    displayLabel: text("display_label"),
    displayOrder: integer("display_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("access_artifacts_scope_idx").on(table.benchmarkId, table.benchmarkVersionId, table.evaluationProtocolId)]
);

export const sources = sqliteTable(
  "sources",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id").references(() => benchmarks.id, { onDelete: "cascade" }),
    resourceId: text("resource_id").references(() => resources.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    normalizedUrlHash: text("normalized_url_hash").notNull(),
    title: text("title").notNull(),
    publisher: text("publisher"),
    sourceType: text("source_type").notNull(),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
    publishedOn: text("published_on"),
    retrievedAt: text("retrieved_at"),
    lastCheckedAt: text("last_checked_at"),
    httpStatus: integer("http_status"),
    finalUrl: text("final_url"),
    sourceHealth: text("source_health").notNull().default("unknown"),
    contentFingerprint: text("content_fingerprint"),
    licenseNote: text("license_note"),
    archivalUrl: text("archival_url"),
    curatorNote: text("curator_note"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("sources_benchmark_url_hash_uq").on(table.benchmarkId, table.normalizedUrlHash),
    index("sources_health_checked_idx").on(table.sourceHealth, table.lastCheckedAt),
  ]
);

export const evidenceClaims = sqliteTable(
  "evidence_claims",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id").references(() => benchmarks.id, { onDelete: "cascade" }),
    resourceId: text("resource_id").references(() => resources.id, { onDelete: "cascade" }),
    benchmarkVersionId: text("benchmark_version_id").references(() => benchmarkVersions.id, {
      onDelete: "cascade",
    }),
    evaluationProtocolId: text("evaluation_protocol_id").references(() => evaluationProtocols.id, {
      onDelete: "cascade",
    }),
    metricDefinitionId: text("metric_definition_id").references(() => metricDefinitions.id, {
      onDelete: "cascade",
    }),
    fieldPath: text("field_path").notNull(),
    valueJson: text("value_json").notNull(),
    claimText: text("claim_text").notNull(),
    evidenceState: text("evidence_state").notNull().default("proposed"),
    confidence: text("confidence").notNull().default("low"),
    versionScope: text("version_scope"),
    validFrom: text("valid_from"),
    validTo: text("valid_to"),
    conflictGroupId: text("conflict_group_id"),
    createdBy: text("created_by").notNull(),
    reviewedBy: text("reviewed_by"),
    reviewedAt: text("reviewed_at"),
    ...timestamps,
  },
  (table) => [
    index("evidence_claims_benchmark_field_state_idx").on(
      table.benchmarkId,
      table.fieldPath,
      table.evidenceState
    ),
    index("evidence_claims_conflict_group_idx").on(table.conflictGroupId),
  ]
);

export const claimSources = sqliteTable(
  "claim_sources",
  {
    claimId: text("claim_id")
      .notNull()
      .references(() => evidenceClaims.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    locatorType: text("locator_type").notNull(),
    locatorValue: text("locator_value").notNull(),
    shortExcerpt: text("short_excerpt"),
    supportType: text("support_type").notNull(),
    addedBy: text("added_by").notNull(),
    addedAt: text("added_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.claimId, table.sourceId] }),
    index("claim_sources_source_idx").on(table.sourceId),
  ]
);

export const sourceSnapshots = sqliteTable(
  "source_snapshots",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    retrievedAt: text("retrieved_at").notNull(),
    requestOutcome: text("request_outcome").notNull(),
    finalUrl: text("final_url"),
    httpMetadataJson: text("http_metadata_json"),
    contentFingerprint: text("content_fingerprint"),
    archivalObjectReference: text("archival_object_reference"),
    snapshotHash: text("snapshot_hash").notNull(),
    captureActor: text("capture_actor").notNull(),
    retentionClass: text("retention_class").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("source_snapshots_hash_uq").on(table.snapshotHash),
    index("source_snapshots_source_retrieved_idx").on(table.sourceId, table.retrievedAt),
  ]
);

export const sourceRetrievalOutcomes = sqliteTable(
  "source_retrieval_outcomes",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    checkedAt: text("checked_at").notNull(),
    requestOutcome: text("request_outcome").notNull(),
    httpStatus: integer("http_status"),
    finalUrl: text("final_url"),
    errorCode: text("error_code"),
    sourceSnapshotId: text("source_snapshot_id").references(() => sourceSnapshots.id, {
      onDelete: "set null",
    }),
    actorOrJob: text("actor_or_job").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("source_retrieval_outcomes_source_checked_idx").on(table.sourceId, table.checkedAt)]
);

export const verificationEvents = sqliteTable(
  "verification_events",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    outcome: text("outcome").notNull(),
    scopeJson: text("scope_json").notNull(),
    verifiedBy: text("verified_by").notNull(),
    verifiedAt: text("verified_at").notNull(),
    freshUntil: text("fresh_until"),
    notesPublic: text("notes_public"),
    notesInternal: text("notes_internal"),
    requestId: text("request_id").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("verification_events_entity_time_idx").on(table.entityType, table.entityId, table.verifiedAt),
    uniqueIndex("verification_events_request_uq").on(table.requestId),
  ]
);

export const verificationEventSnapshots = sqliteTable(
  "verification_event_snapshots",
  {
    verificationEventId: text("verification_event_id")
      .notNull()
      .references(() => verificationEvents.id, { onDelete: "cascade" }),
    sourceSnapshotId: text("source_snapshot_id")
      .notNull()
      .references(() => sourceSnapshots.id, { onDelete: "restrict" }),
  },
  (table) => [primaryKey({ columns: [table.verificationEventId, table.sourceSnapshotId] })]
);

export const evidenceDisputes = sqliteTable(
  "evidence_disputes",
  {
    id: text("id").primaryKey(),
    benchmarkId: text("benchmark_id").references(() => benchmarks.id, { onDelete: "cascade" }),
    claimId: text("claim_id").references(() => evidenceClaims.id, { onDelete: "set null" }),
    fieldPath: text("field_path").notNull(),
    state: text("state").notNull().default("open"),
    rationale: text("rationale").notNull(),
    openedBy: text("opened_by").notNull(),
    openedAt: text("opened_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    resolvedBy: text("resolved_by"),
    resolvedAt: text("resolved_at"),
    resolutionNote: text("resolution_note"),
  },
  (table) => [
    index("evidence_disputes_benchmark_state_idx").on(table.benchmarkId, table.state),
    check(
      "evidence_disputes_resolution_check",
      sql`${table.resolvedAt} is null or ${table.state} != 'open'`
    ),
  ]
);

export const materialFieldManifests = sqliteTable(
  "material_field_manifests",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    schemaVersion: text("schema_version").notNull(),
    fieldPathsJson: text("field_paths_json").notNull(),
    manifestHash: text("manifest_hash").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("material_field_manifests_version_uq").on(table.entityType, table.schemaVersion),
    uniqueIndex("material_field_manifests_hash_uq").on(table.manifestHash),
  ]
);

export const entityRevisions = sqliteTable(
  "entity_revisions",
  {
    id: text("id").primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    revisionNumber: integer("revision_number").notNull(),
    state: text("state").notNull().default("draft"),
    manifestId: text("manifest_id")
      .notNull()
      .references(() => materialFieldManifests.id, { onDelete: "restrict" }),
    canonicalPayload: text("canonical_payload").notNull(),
    revisionHash: text("revision_hash").notNull(),
    parentRevisionHash: text("parent_revision_hash"),
    createdBy: text("created_by").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    frozenAt: text("frozen_at"),
  },
  (table) => [
    uniqueIndex("entity_revisions_number_uq").on(table.entityType, table.entityId, table.revisionNumber),
    uniqueIndex("entity_revisions_hash_uq").on(table.revisionHash),
    index("entity_revisions_entity_state_idx").on(table.entityType, table.entityId, table.state),
    check("entity_revisions_number_check", sql`${table.revisionNumber} > 0`),
    check(
      "entity_revisions_frozen_state_check",
      sql`${table.frozenAt} is null or ${table.state} in ('frozen', 'published', 'archived')`
    ),
  ]
);

export const revisionFieldValues = sqliteTable(
  "revision_field_values",
  {
    revisionId: text("revision_id")
      .notNull()
      .references(() => entityRevisions.id, { onDelete: "restrict" }),
    fieldPath: text("field_path").notNull(),
    valueJson: text("value_json").notNull(),
    claimId: text("claim_id").references(() => evidenceClaims.id, { onDelete: "restrict" }),
    valueHash: text("value_hash").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.revisionId, table.fieldPath] }),
    index("revision_field_values_claim_idx").on(table.claimId),
  ]
);

export const auditEvents = sqliteTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    requestId: text("request_id").notNull(),
    reason: text("reason").notNull(),
    beforeReference: text("before_reference"),
    afterReference: text("after_reference"),
    occurredAt: text("occurred_at").notNull(),
    eventHash: text("event_hash").notNull(),
  },
  (table) => [
    uniqueIndex("audit_events_request_uq").on(table.requestId),
    uniqueIndex("audit_events_hash_uq").on(table.eventHash),
    index("audit_events_target_time_idx").on(table.targetType, table.targetId, table.occurredAt),
  ]
);
