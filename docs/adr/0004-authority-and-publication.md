# ADR 0004 — Authority and publication

- Status: Accepted for Unit 0
- Date: 2026-08-20
- Owner: Product + Backend

## Decision

Publication and archive transitions require a frozen revision, canonical request payload hash, independent Human Approval, expiry, nonce, and atomic single-use consumption. Admin and Curator roles cannot manufacture approval.

## Alternatives and consequences

Confirmation dialogs, chat acknowledgments, role-only checks, and mutable approval rows were rejected. Drafts and previews may be prepared without launch authority. Deployment, DNS, legal publication, email activation, and record publication remain separate gates.
