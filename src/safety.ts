import { CliError } from "./errors.js";
import { ExitCode } from "./exit-codes.js";
import type { ParsedArgs } from "./types.js";

const mutatingCommands = new Set(["tenants sync"]);

export function assertSafe(args: ParsedArgs): void {
  if (
    args.environment === "prod" &&
    mutatingCommands.has(args.command) &&
    !args.dryRun &&
    !args.confirmProduction
  ) {
    throw new CliError(
      "production_confirmation_required",
      "Production mutation requires --confirm-production or --dry-run",
      ExitCode.Safety
    );
  }
}

