# ADR 0002 — Data and evidence boundary

- Status: Accepted for Unit 0
- Date: 2026-08-20
- Owner: Data

## Decision

Separate source identity, immutable retrieval snapshots, claims, draft projections, immutable revisions, and public view models. Seed import creates review candidates only. A public field must compile from accepted claims or an explicit semantic-missing state.

## Alternatives and consequences

Publishing seed JSON directly and editable provenance blobs were rejected. Unit 1 will implement normalized tables and append-only evidence. Demo records cannot publish.
