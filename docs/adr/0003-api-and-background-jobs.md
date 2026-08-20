# ADR 0003 — API and background-job boundary

- Status: Accepted for Unit 0
- Date: 2026-08-20
- Owner: Backend

## Decision

Expose versioned `/api/v1` contracts. Public reads are deterministic and side-effect free. Contributions use pending-only writes plus a transactional outbox. Email, source-health retrieval, analytics, and monitoring are adapters invoked after durable transitions.

## Alternatives and consequences

Synchronous email/source retrieval in public requests was rejected. Adapters can be disabled. Failure never converts to success or “unchanged.” Idempotency and optimistic concurrency are mandatory on writes.
