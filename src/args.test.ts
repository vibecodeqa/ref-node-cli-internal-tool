import { describe, expect, it } from "vitest";
import { parseArgs } from "./args.js";
import { CliError } from "./errors.js";

describe("parseArgs", () => {
  it("parses health defaults", () => {
    expect(parseArgs(["health"])).toMatchObject({
      command: "health",
      environment: "dev",
      json: false
    });
  });

  it("parses tenant sync flags", () => {
    expect(
      parseArgs(["tenants", "sync", "--env", "staging", "--json", "--dry-run"])
    ).toMatchObject({
      command: "tenants sync",
      environment: "staging",
      json: true,
      dryRun: true
    });
  });

  it("rejects unknown options", () => {
    expect(() => parseArgs(["health", "--surprise"])).toThrow(CliError);
  });
});

