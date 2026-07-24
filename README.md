# Node CLI Internal Tool Reference

Reference implementation for the VibeCode QA Node CLI Internal Tool stack.

This repo models the operational CLI shape that appears across local product repos:

- TypeScript source with a `bin` entrypoint
- deterministic noninteractive commands
- explicit exit-code contract
- credential resolution order
- production safety guard
- text and JSON output modes
- API/client code reused by the CLI instead of duplicated command logic
- CI gates for typecheck, tests, build, and executable smoke checks

## Local workflow

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
```

Run from source:

```bash
pnpm dev health --env dev --json
```

Run the built CLI:

```bash
pnpm build
node dist/cli.js health --env dev
VCQA_REF_TOKEN=dev-token node dist/cli.js tenants sync --env staging --json
VCQA_REF_TOKEN=prod-token node dist/cli.js tenants sync --env prod --confirm-production
```

## Exit codes

| Code | Meaning |
|---:|---|
| 0 | Success |
| 1 | Runtime failure |
| 2 | Usage or validation error |
| 3 | Missing or invalid credentials |
| 4 | Safety gate blocked the command |
| 5 | Upstream API failure |

## Secrets

The CLI never stores credentials in the repo. Resolution order is:

1. `--token`
2. `VCQA_REF_TOKEN`
3. `--token-file`
4. `VCQA_REF_TOKEN_FILE`

Token files should live outside the repo, for example
`~/.config/vcqa-ref-node-cli/token`.

See [docs/runbook.md](docs/runbook.md) and [docs/vcqa-report.md](docs/vcqa-report.md).

