import { CliError } from "./errors.js";
import { ExitCode } from "./exit-codes.js";
import { EnvironmentSchema, type Command, type ParsedArgs } from "./types.js";

const knownOptions = new Set([
  "--env",
  "--json",
  "--confirm-production",
  "--token",
  "--token-file",
  "--dry-run",
  "--help"
]);

export function parseArgs(argv: string[]): ParsedArgs {
  if (argv.includes("--help") || argv.length === 0) {
    throw new CliError("help", usage(), ExitCode.Usage);
  }

  const positionals: string[] = [];
  const values = new Map<string, string | true>();

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg) {
      continue;
    }

    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    if (!knownOptions.has(arg)) {
      throw new CliError("unknown_option", `Unknown option: ${arg}`, ExitCode.Usage);
    }

    if (arg === "--json" || arg === "--confirm-production" || arg === "--dry-run") {
      values.set(arg, true);
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      throw new CliError("missing_option_value", `Missing value for ${arg}`, ExitCode.Usage);
    }

    values.set(arg, next);
    i += 1;
  }

  const command = parseCommand(positionals);
  const environment = EnvironmentSchema.safeParse(values.get("--env") ?? "dev");
  if (!environment.success) {
    throw new CliError("invalid_environment", "--env must be dev, staging, or prod", ExitCode.Usage);
  }

  return {
    command,
    environment: environment.data,
    json: values.get("--json") === true,
    confirmProduction: values.get("--confirm-production") === true,
    token: stringValue(values.get("--token")),
    tokenFile: stringValue(values.get("--token-file")),
    dryRun: values.get("--dry-run") === true
  };
}

function parseCommand(positionals: string[]): Command {
  const joined = positionals.join(" ");
  if (joined === "health" || joined === "tenants sync") {
    return joined;
  }

  throw new CliError(
    "unknown_command",
    `Unknown command: ${joined || "(none)"}\n\n${usage()}`,
    ExitCode.Usage
  );
}

function stringValue(value: string | true | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function usage(): string {
  return [
    "Usage:",
    "  vcqa-ref-node-cli health [--env dev|staging|prod] [--json]",
    "  vcqa-ref-node-cli tenants sync --env dev|staging|prod [--dry-run] [--confirm-production]",
    "",
    "Credentials:",
    "  --token TOKEN | VCQA_REF_TOKEN | --token-file PATH | VCQA_REF_TOKEN_FILE"
  ].join("\n");
}

