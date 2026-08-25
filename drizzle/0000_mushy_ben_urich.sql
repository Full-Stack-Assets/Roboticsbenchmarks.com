CREATE TABLE `access_artifacts` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text NOT NULL,
	`benchmark_version_id` text,
	`evaluation_protocol_id` text,
	`artifact_type` text NOT NULL,
	`url` text,
	`structured_value_json` text,
	`access_state` text DEFAULT 'unknown' NOT NULL,
	`display_label` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`benchmark_version_id`) REFERENCES `benchmark_versions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`evaluation_protocol_id`) REFERENCES `evaluation_protocols`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `access_artifacts_scope_idx` ON `access_artifacts` (`benchmark_id`,`benchmark_version_id`,`evaluation_protocol_id`);--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`request_id` text NOT NULL,
	`reason` text NOT NULL,
	`before_reference` text,
	`after_reference` text,
	`occurred_at` text NOT NULL,
	`event_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_events_request_uq` ON `audit_events` (`request_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `audit_events_hash_uq` ON `audit_events` (`event_hash`);--> statement-breakpoint
CREATE INDEX `audit_events_target_time_idx` ON `audit_events` (`target_type`,`target_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `benchmark_categories` (
	`benchmark_id` text NOT NULL,
	`category_id` text NOT NULL,
	`relationship` text DEFAULT 'secondary' NOT NULL,
	PRIMARY KEY(`benchmark_id`, `category_id`),
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `benchmark_embodiments` (
	`benchmark_id` text NOT NULL,
	`embodiment_id` text NOT NULL,
	`relationship` text NOT NULL,
	`version_scope` text,
	`protocol_scope` text,
	PRIMARY KEY(`benchmark_id`, `embodiment_id`, `relationship`),
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`embodiment_id`) REFERENCES `embodiments`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `benchmark_settings` (
	`benchmark_id` text NOT NULL,
	`setting` text NOT NULL,
	PRIMARY KEY(`benchmark_id`, `setting`),
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `benchmark_tags` (
	`benchmark_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`benchmark_id`, `tag_id`),
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `benchmark_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text NOT NULL,
	`version_label` text NOT NULL,
	`normalized_version_label` text NOT NULL,
	`version_type` text NOT NULL,
	`released_on` text,
	`status` text DEFAULT 'unknown' NOT NULL,
	`change_summary` text,
	`identity_claim_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `benchmark_versions_identity_uq` ON `benchmark_versions` (`benchmark_id`,`normalized_version_label`,`version_type`);--> statement-breakpoint
CREATE INDEX `benchmark_versions_benchmark_status_idx` ON `benchmark_versions` (`benchmark_id`,`status`);--> statement-breakpoint
CREATE TABLE `benchmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`canonical_name` text NOT NULL,
	`short_name` text,
	`entity_kind` text NOT NULL,
	`primary_category_id` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`description_md` text,
	`scope_summary` text NOT NULL,
	`access_state` text NOT NULL,
	`official_url` text NOT NULL,
	`lifecycle_status` text DEFAULT 'unknown' NOT NULL,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`verification_state` text DEFAULT 'unverified' NOT NULL,
	`freshness_days` integer DEFAULT 90 NOT NULL,
	`first_released_on` text,
	`current_version_id` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`published_at` text,
	`archived_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`primary_category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "benchmarks_freshness_days_check" CHECK("benchmarks"."freshness_days" between 7 and 365),
	CONSTRAINT "benchmarks_demo_not_published_check" CHECK(not ("benchmarks"."is_demo" = 1 and "benchmarks"."publication_status" = 'published')),
	CONSTRAINT "benchmarks_archive_state_check" CHECK("benchmarks"."archived_at" is null or "benchmarks"."publication_status" = 'archived')
);
--> statement-breakpoint
CREATE UNIQUE INDEX `benchmarks_slug_uq` ON `benchmarks` (`slug`);--> statement-breakpoint
CREATE INDEX `benchmarks_publication_verification_idx` ON `benchmarks` (`publication_status`,`verification_state`);--> statement-breakpoint
CREATE INDEX `benchmarks_category_publication_idx` ON `benchmarks` (`primary_category_id`,`publication_status`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`selection_guidance_md` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_uq` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `claim_sources` (
	`claim_id` text NOT NULL,
	`source_id` text NOT NULL,
	`locator_type` text NOT NULL,
	`locator_value` text NOT NULL,
	`short_excerpt` text,
	`support_type` text NOT NULL,
	`added_by` text NOT NULL,
	`added_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`claim_id`, `source_id`),
	FOREIGN KEY (`claim_id`) REFERENCES `evidence_claims`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `claim_sources_source_idx` ON `claim_sources` (`source_id`);--> statement-breakpoint
CREATE TABLE `embodiments` (
	`id` text PRIMARY KEY NOT NULL,
	`manufacturer` text,
	`model` text,
	`free_text_name` text,
	`embodiment_type` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `embodiments_manufacturer_model_idx` ON `embodiments` (`manufacturer`,`model`);--> statement-breakpoint
CREATE TABLE `entity_aliases` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text NOT NULL,
	`alias_text` text NOT NULL,
	`normalized_alias` text NOT NULL,
	`alias_type` text NOT NULL,
	`redirect_slug` text,
	`active_from` text,
	`active_to` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entity_aliases_benchmark_alias_uq` ON `entity_aliases` (`benchmark_id`,`normalized_alias`);--> statement-breakpoint
CREATE UNIQUE INDEX `entity_aliases_redirect_slug_uq` ON `entity_aliases` (`redirect_slug`);--> statement-breakpoint
CREATE INDEX `entity_aliases_lookup_idx` ON `entity_aliases` (`normalized_alias`);--> statement-breakpoint
CREATE TABLE `entity_maintainers` (
	`benchmark_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`relationship` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`active_from` text,
	`active_to` text,
	PRIMARY KEY(`benchmark_id`, `organization_id`, `relationship`),
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `entity_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`revision_number` integer NOT NULL,
	`state` text DEFAULT 'draft' NOT NULL,
	`manifest_id` text NOT NULL,
	`canonical_payload` text NOT NULL,
	`revision_hash` text NOT NULL,
	`parent_revision_hash` text,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`frozen_at` text,
	FOREIGN KEY (`manifest_id`) REFERENCES `material_field_manifests`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "entity_revisions_number_check" CHECK("entity_revisions"."revision_number" > 0),
	CONSTRAINT "entity_revisions_frozen_state_check" CHECK("entity_revisions"."frozen_at" is null or "entity_revisions"."state" in ('frozen', 'published', 'archived'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entity_revisions_number_uq` ON `entity_revisions` (`entity_type`,`entity_id`,`revision_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `entity_revisions_hash_uq` ON `entity_revisions` (`revision_hash`);--> statement-breakpoint
CREATE INDEX `entity_revisions_entity_state_idx` ON `entity_revisions` (`entity_type`,`entity_id`,`state`);--> statement-breakpoint
CREATE TABLE `evaluation_protocols` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text NOT NULL,
	`benchmark_version_id` text,
	`name` text NOT NULL,
	`protocol_status` text DEFAULT 'unknown' NOT NULL,
	`description` text,
	`task_set` text,
	`split_definition` text,
	`observation_space` text,
	`action_space` text,
	`reset_conditions` text,
	`termination_conditions` text,
	`run_count` integer,
	`seed_policy` text,
	`time_limit` text,
	`hardware_or_simulator` text,
	`aggregation_method` text,
	`missing_run_treatment` text,
	`comparability_notes` text,
	`identity_claim_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`benchmark_version_id`) REFERENCES `benchmark_versions`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `evaluation_protocols_benchmark_version_idx` ON `evaluation_protocols` (`benchmark_id`,`benchmark_version_id`);--> statement-breakpoint
CREATE TABLE `evidence_claims` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text,
	`resource_id` text,
	`benchmark_version_id` text,
	`evaluation_protocol_id` text,
	`metric_definition_id` text,
	`field_path` text NOT NULL,
	`value_json` text NOT NULL,
	`claim_text` text NOT NULL,
	`evidence_state` text DEFAULT 'proposed' NOT NULL,
	`confidence` text DEFAULT 'low' NOT NULL,
	`version_scope` text,
	`valid_from` text,
	`valid_to` text,
	`conflict_group_id` text,
	`created_by` text NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`benchmark_version_id`) REFERENCES `benchmark_versions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`evaluation_protocol_id`) REFERENCES `evaluation_protocols`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`metric_definition_id`) REFERENCES `metric_definitions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `evidence_claims_benchmark_field_state_idx` ON `evidence_claims` (`benchmark_id`,`field_path`,`evidence_state`);--> statement-breakpoint
CREATE INDEX `evidence_claims_conflict_group_idx` ON `evidence_claims` (`conflict_group_id`);--> statement-breakpoint
CREATE TABLE `evidence_disputes` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text,
	`claim_id` text,
	`field_path` text NOT NULL,
	`state` text DEFAULT 'open' NOT NULL,
	`rationale` text NOT NULL,
	`opened_by` text NOT NULL,
	`opened_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`resolved_by` text,
	`resolved_at` text,
	`resolution_note` text,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`claim_id`) REFERENCES `evidence_claims`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "evidence_disputes_resolution_check" CHECK("evidence_disputes"."resolved_at" is null or "evidence_disputes"."state" != 'open')
);
--> statement-breakpoint
CREATE INDEX `evidence_disputes_benchmark_state_idx` ON `evidence_disputes` (`benchmark_id`,`state`);--> statement-breakpoint
CREATE TABLE `material_field_manifests` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`schema_version` text NOT NULL,
	`field_paths_json` text NOT NULL,
	`manifest_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_field_manifests_version_uq` ON `material_field_manifests` (`entity_type`,`schema_version`);--> statement-breakpoint
CREATE UNIQUE INDEX `material_field_manifests_hash_uq` ON `material_field_manifests` (`manifest_hash`);--> statement-breakpoint
CREATE TABLE `metric_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text NOT NULL,
	`benchmark_version_id` text,
	`evaluation_protocol_id` text,
	`name` text NOT NULL,
	`short_name` text,
	`definition` text NOT NULL,
	`formula_latex` text,
	`direction` text,
	`unit` text,
	`value_type` text,
	`range_min` text,
	`range_max` text,
	`aggregation` text,
	`success_threshold` text,
	`missing_run_treatment` text,
	`is_primary_within_protocol` integer DEFAULT false NOT NULL,
	`comparability_notes` text,
	`identity_claim_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`benchmark_version_id`) REFERENCES `benchmark_versions`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`evaluation_protocol_id`) REFERENCES `evaluation_protocols`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "metric_primary_requires_protocol_check" CHECK("metric_definitions"."is_primary_within_protocol" = 0 or "metric_definitions"."evaluation_protocol_id" is not null)
);
--> statement-breakpoint
CREATE INDEX `metric_definitions_scope_idx` ON `metric_definitions` (`benchmark_id`,`benchmark_version_id`,`evaluation_protocol_id`);--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`canonical_name` text NOT NULL,
	`official_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_uq` ON `organizations` (`slug`);--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`resource_type` text NOT NULL,
	`publisher_organization_id` text,
	`inclusion_reason` text,
	`official_url` text NOT NULL,
	`related_benchmark_id` text,
	`publication_status` text DEFAULT 'draft' NOT NULL,
	`verification_state` text DEFAULT 'unverified' NOT NULL,
	`freshness_days` integer DEFAULT 90 NOT NULL,
	`active_revision_id` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`publisher_organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`related_benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "resources_freshness_days_check" CHECK("resources"."freshness_days" between 7 and 365),
	CONSTRAINT "resources_demo_not_published_check" CHECK(not ("resources"."is_demo" = 1 and "resources"."publication_status" = 'published'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resources_slug_uq` ON `resources` (`slug`);--> statement-breakpoint
CREATE TABLE `revision_field_values` (
	`revision_id` text NOT NULL,
	`field_path` text NOT NULL,
	`value_json` text NOT NULL,
	`claim_id` text,
	`value_hash` text NOT NULL,
	PRIMARY KEY(`revision_id`, `field_path`),
	FOREIGN KEY (`revision_id`) REFERENCES `entity_revisions`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`claim_id`) REFERENCES `evidence_claims`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `revision_field_values_claim_idx` ON `revision_field_values` (`claim_id`);--> statement-breakpoint
CREATE TABLE `source_retrieval_outcomes` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`checked_at` text NOT NULL,
	`request_outcome` text NOT NULL,
	`http_status` integer,
	`final_url` text,
	`error_code` text,
	`source_snapshot_id` text,
	`actor_or_job` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`source_snapshot_id`) REFERENCES `source_snapshots`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `source_retrieval_outcomes_source_checked_idx` ON `source_retrieval_outcomes` (`source_id`,`checked_at`);--> statement-breakpoint
CREATE TABLE `source_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`retrieved_at` text NOT NULL,
	`request_outcome` text NOT NULL,
	`final_url` text,
	`http_metadata_json` text,
	`content_fingerprint` text,
	`archival_object_reference` text,
	`snapshot_hash` text NOT NULL,
	`capture_actor` text NOT NULL,
	`retention_class` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `source_snapshots_hash_uq` ON `source_snapshots` (`snapshot_hash`);--> statement-breakpoint
CREATE INDEX `source_snapshots_source_retrieved_idx` ON `source_snapshots` (`source_id`,`retrieved_at`);--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`benchmark_id` text,
	`resource_id` text,
	`url` text NOT NULL,
	`normalized_url_hash` text NOT NULL,
	`title` text NOT NULL,
	`publisher` text,
	`source_type` text NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`published_on` text,
	`retrieved_at` text,
	`last_checked_at` text,
	`http_status` integer,
	`final_url` text,
	`source_health` text DEFAULT 'unknown' NOT NULL,
	`content_fingerprint` text,
	`license_note` text,
	`archival_url` text,
	`curator_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`benchmark_id`) REFERENCES `benchmarks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sources_benchmark_url_hash_uq` ON `sources` (`benchmark_id`,`normalized_url_hash`);--> statement-breakpoint
CREATE INDEX `sources_health_checked_idx` ON `sources` (`source_health`,`last_checked_at`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`display_name` text NOT NULL,
	`tag_group` text,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_uq` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `verification_event_snapshots` (
	`verification_event_id` text NOT NULL,
	`source_snapshot_id` text NOT NULL,
	PRIMARY KEY(`verification_event_id`, `source_snapshot_id`),
	FOREIGN KEY (`verification_event_id`) REFERENCES `verification_events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_snapshot_id`) REFERENCES `source_snapshots`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `verification_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`outcome` text NOT NULL,
	`scope_json` text NOT NULL,
	`verified_by` text NOT NULL,
	`verified_at` text NOT NULL,
	`fresh_until` text,
	`notes_public` text,
	`notes_internal` text,
	`request_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_events_entity_time_idx` ON `verification_events` (`entity_type`,`entity_id`,`verified_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `verification_events_request_uq` ON `verification_events` (`request_id`);
--> statement-breakpoint
CREATE TRIGGER `entity_revisions_immutable_update`
BEFORE UPDATE ON `entity_revisions`
BEGIN
  SELECT RAISE(ABORT, 'entity revisions are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `entity_revisions_immutable_delete`
BEFORE DELETE ON `entity_revisions`
BEGIN
  SELECT RAISE(ABORT, 'entity revisions are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `revision_field_values_immutable_update`
BEFORE UPDATE ON `revision_field_values`
BEGIN
  SELECT RAISE(ABORT, 'revision field values are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `revision_field_values_immutable_delete`
BEFORE DELETE ON `revision_field_values`
BEGIN
  SELECT RAISE(ABORT, 'revision field values are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `source_snapshots_immutable_update`
BEFORE UPDATE ON `source_snapshots`
BEGIN
  SELECT RAISE(ABORT, 'source snapshots are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `source_snapshots_immutable_delete`
BEFORE DELETE ON `source_snapshots`
BEGIN
  SELECT RAISE(ABORT, 'source snapshots are immutable');
END;
--> statement-breakpoint
CREATE TRIGGER `evidence_claim_acceptance_guard_insert`
BEFORE INSERT ON `evidence_claims`
WHEN NEW.`evidence_state` = 'accepted'
BEGIN
  SELECT CASE WHEN NOT EXISTS (
    SELECT 1 FROM `claim_sources` cs
    JOIN `source_snapshots` ss ON ss.`source_id` = cs.`source_id`
    WHERE cs.`claim_id` = NEW.`id`
      AND cs.`support_type` = 'supports'
      AND length(trim(cs.`locator_value`)) > 0
  ) THEN RAISE(ABORT, 'accepted claims require a supporting source, locator, and snapshot') END;
END;
--> statement-breakpoint
CREATE TRIGGER `evidence_claim_acceptance_guard_update`
BEFORE UPDATE OF `evidence_state` ON `evidence_claims`
WHEN NEW.`evidence_state` = 'accepted'
BEGIN
  SELECT CASE WHEN NOT EXISTS (
    SELECT 1 FROM `claim_sources` cs
    JOIN `source_snapshots` ss ON ss.`source_id` = cs.`source_id`
    WHERE cs.`claim_id` = NEW.`id`
      AND cs.`support_type` = 'supports'
      AND length(trim(cs.`locator_value`)) > 0
  ) THEN RAISE(ABORT, 'accepted claims require a supporting source, locator, and snapshot') END;
END;
--> statement-breakpoint
CREATE TRIGGER `audit_events_append_only_update`
BEFORE UPDATE ON `audit_events`
BEGIN
  SELECT RAISE(ABORT, 'audit events are append-only');
END;
--> statement-breakpoint
CREATE TRIGGER `audit_events_append_only_delete`
BEFORE DELETE ON `audit_events`
BEGIN
  SELECT RAISE(ABORT, 'audit events are append-only');
END;
