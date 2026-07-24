import type { ApiClient } from "./api-client.js";
import { requireCredential } from "./credentials.js";
import type { CommandContext, CommandResult } from "./types.js";

export async function runCommand(client: ApiClient, context: CommandContext): Promise<CommandResult> {
  if (context.args.command === "health") {
    const health = await client.health(context.args.environment);
    return {
      command: context.args.command,
      environment: context.args.environment,
      changed: false,
      dryRun: context.args.dryRun,
      message: `Service ${health.service} is healthy`,
      details: health
    };
  }

  const credential = requireCredential(context.credential);
  const result = await client.syncTenants({
    environment: context.args.environment,
    credential,
    dryRun: context.args.dryRun
  });

  return {
    command: context.args.command,
    environment: context.args.environment,
    changed: result.synced > 0,
    dryRun: context.args.dryRun,
    message: context.args.dryRun
      ? `Dry run skipped ${result.skipped} tenant updates`
      : `Synced ${result.synced} tenant records`,
    details: {
      synced: result.synced,
      skipped: result.skipped,
      credentialSource: credential.source
    }
  };
}

