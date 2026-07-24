import { readFile } from "node:fs/promises";
import { CliError } from "./errors.js";
import { ExitCode } from "./exit-codes.js";
import type { Credential, ParsedArgs } from "./types.js";

export async function resolveCredential(
  args: ParsedArgs,
  env: NodeJS.ProcessEnv = process.env
): Promise<Credential | undefined> {
  if (args.token) {
    return credential("flag", args.token);
  }

  if (env.VCQA_REF_TOKEN) {
    return credential("env", env.VCQA_REF_TOKEN);
  }

  const tokenFile = args.tokenFile ?? env.VCQA_REF_TOKEN_FILE;
  if (tokenFile) {
    try {
      return credential("file", await readFile(tokenFile, "utf8"));
    } catch (error) {
      throw new CliError(
        "token_file_unreadable",
        `Token file could not be read: ${tokenFile}`,
        ExitCode.Auth
      );
    }
  }

  return undefined;
}

export function requireCredential(credentialValue: Credential | undefined): Credential {
  if (!credentialValue) {
    throw new CliError("missing_credentials", "Credentials are required for this command", ExitCode.Auth);
  }

  return credentialValue;
}

function credential(source: Credential["source"], rawToken: string): Credential {
  const token = rawToken.trim();
  if (token.length < 8) {
    throw new CliError("invalid_credentials", "Credential value is too short", ExitCode.Auth);
  }

  return { source, token };
}

