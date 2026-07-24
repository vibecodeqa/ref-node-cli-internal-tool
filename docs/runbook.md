# Operations Runbook

## Local setup

1. Install dependencies with `pnpm install`.
2. Keep credentials outside the repo.
3. Run `pnpm dev health --env dev`.
4. Run `pnpm run ci` before pushing changes.

## Credential policy

The CLI resolves credentials in this order:

1. `--token`
2. `VCQA_REF_TOKEN`
3. `--token-file`
4. `VCQA_REF_TOKEN_FILE`

Do not commit token files, `.env`, shell history exports, or captured command output that
contains credentials. Error messages and JSON output must not echo token values.

## Production safety

Commands that mutate production must include `--confirm-production`. The CLI exits with
code `4` when production mutation is attempted without that flag. There are no interactive
prompts because internal tools must be safe in CI and cron contexts.

## Exit-code contract

- `0`: success
- `1`: runtime failure
- `2`: usage or validation error
- `3`: missing or invalid credentials
- `4`: safety gate blocked the command
- `5`: upstream API failure

## Deployment

This reference repo is private-by-default in package metadata and has no npm publish
workflow. A real internal tool should publish through the owning org's private package
registry or be invoked through a pinned GitHub release artifact.

