import { CliError } from "./errors.js";
import { ExitCode } from "./exit-codes.js";
import type { Credential, Environment } from "./types.js";

export interface ApiClient {
  health(environment: Environment): Promise<{ ok: true; service: string }>;
  syncTenants(input: {
    environment: Environment;
    credential: Credential;
    dryRun: boolean;
  }): Promise<{ synced: number; skipped: number }>;
}

export class DemoApiClient implements ApiClient {
  async health(environment: Environment): Promise<{ ok: true; service: string }> {
    return { ok: true, service: `vcqa-ref-${environment}` };
  }

  async syncTenants(input: {
    environment: Environment;
    credential: Credential;
    dryRun: boolean;
  }): Promise<{ synced: number; skipped: number }> {
    if (input.credential.token === "simulate-upstream-failure") {
      throw new CliError("upstream_failure", "Tenant API returned an error", ExitCode.Upstream);
    }

    return input.dryRun ? { synced: 0, skipped: 3 } : { synced: 3, skipped: 0 };
  }
}

