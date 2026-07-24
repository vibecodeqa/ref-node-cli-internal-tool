import { describe, expect, it } from "vitest";
import { parseArgs } from "./args.js";
import { CliError } from "./errors.js";
import { assertSafe } from "./safety.js";

describe("assertSafe", () => {
  it("blocks production mutation without confirmation", () => {
    expect(() => assertSafe(parseArgs(["tenants", "sync", "--env", "prod"]))).toThrow(CliError);
  });

  it("allows production dry runs", () => {
    expect(() => assertSafe(parseArgs(["tenants", "sync", "--env", "prod", "--dry-run"]))).not.toThrow();
  });
});

