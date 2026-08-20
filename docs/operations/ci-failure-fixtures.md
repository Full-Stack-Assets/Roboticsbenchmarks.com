# CI failure fixtures

The following controlled changes must fail before Unit 0 can be called complete. They are tested on temporary copies or reverted before commit:

1. Contract: change `expected_record_count` or remove one source from the seed; `contracts:validate` fails.
2. Type: assign a number to a string field in `lib/benchmarks.ts`; `typecheck` fails.
3. Lint: introduce an undeclared identifier; `lint` fails.
4. Test: change expected record count from 10 to 11; `test` fails.
5. Secret: add a fake token matching the documented fixture pattern; the CI secret gate fails.
6. Boundary: introduce a prohibited cross-product name or execution interface in `app/` or `lib/`; `boundaries:verify` fails.

Evidence from actual controlled execution is recorded in `docs/operations/unit-0-verification-receipt.md`.
