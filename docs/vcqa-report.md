# VCQA Report

Score: **92/100**

This reference repo is intentionally small, but it carries the evidence VCQA expects from
a Node CLI internal tool.

## Covered by authored standards

- [Security v1](https://vibecodeqa.online/standards/security/v1/): credentials are
  resolved without persistence, production mutation is gated, JSON errors do not leak
  token values, and CI has read-only repository permissions.
- [Testing v1](https://vibecodeqa.online/standards/testing/v1/): parser, credential,
  output, API client, safety, and executable smoke behavior are covered by automated tests.
- [TypeScript v1](https://vibecodeqa.online/standards/typescript/v1/): strict NodeNext
  TypeScript config, typed command contracts, no `any`, and build/typecheck scripts.

## Node CLI-specific evidence

- `src/exit-codes.ts` defines stable process exit codes.
- `src/args.ts` rejects unknown options and validates command shape.
- `src/credentials.ts` documents and implements credential resolution order.
- `src/safety.ts` blocks production mutations without `--confirm-production`.
- `src/api-client.ts` is the reusable client used by command execution.
- `src/output.ts` owns text and JSON output envelopes.
- `pnpm smoke` runs the built executable and verifies production safety behavior.

## Remaining standard gaps

- Node CLI Internal Tool is not yet an authored VCQA rubric.
- Dependency Hygiene is still planned.

## Why this is not 100

This fixture uses an in-memory demo API client rather than a real staging service. A
production internal tool should add request tracing, audit-log emission, release artifact
provenance, and protected environment approvals for real mutation commands.

