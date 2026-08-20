# ADR 0001 — Application architecture

- Status: Accepted for Unit 0
- Date: 2026-08-20
- Owner: Backend
- Supersession: A later numbered ADR must name and replace this decision.

## Decision

Use a server-rendered TypeScript application with the Next.js App Router compatibility surface, Vinext/Vite production build, and Cloudflare Worker-compatible ESM output. Keep domain logic in provider-neutral modules. Public reads are cacheable; protected writes are server-authorized and audited.

## Alternatives and consequences

Static-only export was rejected because durable provenance and contributions require server behavior. Hosting-specific persistence throughout the app was rejected to preserve portability. The build must emit the Worker-compatible server artifact. Deployment is a separate Human Authority gate.
