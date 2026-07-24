import { z } from "zod";

export const EnvironmentSchema = z.enum(["dev", "staging", "prod"]);
export type Environment = z.infer<typeof EnvironmentSchema>;

export const CommandSchema = z.enum(["health", "tenants sync"]);
export type Command = z.infer<typeof CommandSchema>;

export interface ParsedArgs {
  command: Command;
  environment: Environment;
  json: boolean;
  confirmProduction: boolean;
  token?: string | undefined;
  tokenFile?: string | undefined;
  dryRun: boolean;
}

export interface Credential {
  source: "flag" | "env" | "file";
  token: string;
}

export interface CommandContext {
  args: ParsedArgs;
  credential?: Credential | undefined;
}

export interface CommandResult {
  command: Command;
  environment: Environment;
  changed: boolean;
  dryRun: boolean;
  message: string;
  details: Record<string, unknown>;
}
