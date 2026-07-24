import { describe, expect, it } from "vitest";
import { runCli } from "./runtime.js";

function memoryIo(env: NodeJS.ProcessEnv = {}) {
  let stdout = "";
  let stderr = "";

  return {
    io: {
      stdout: { write: (chunk: string) => Boolean((stdout += chunk)) },
      stderr: { write: (chunk: string) => Boolean((stderr += chunk)) },
      env
    },
    read: () => ({ stdout, stderr })
  };
}

describe("runCli", () => {
  it("returns JSON health output", async () => {
    const { io, read } = memoryIo();
    const exitCode = await runCli(["health", "--env", "dev", "--json"], io);

    expect(exitCode).toBe(0);
    expect(JSON.parse(read().stdout)).toMatchObject({
      ok: true,
      command: "health",
      environment: "dev"
    });
  });

  it("uses env credentials for mutating staging commands", async () => {
    const { io, read } = memoryIo({ VCQA_REF_TOKEN: "staging-token" });
    const exitCode = await runCli(["tenants", "sync", "--env", "staging", "--json"], io);

    expect(exitCode).toBe(0);
    expect(JSON.parse(read().stdout)).toMatchObject({
      ok: true,
      changed: true,
      details: {
        credentialSource: "env"
      }
    });
  });

  it("returns safety exit code for unconfirmed production mutation", async () => {
    const { io, read } = memoryIo({ VCQA_REF_TOKEN: "prod-token" });
    const exitCode = await runCli(["tenants", "sync", "--env", "prod", "--json"], io);

    expect(exitCode).toBe(4);
    expect(JSON.parse(read().stderr)).toMatchObject({
      ok: false,
      error: {
        code: "production_confirmation_required"
      }
    });
  });

  it("does not leak credentials into output", async () => {
    const { io, read } = memoryIo({ VCQA_REF_TOKEN: "secret-token-value" });
    await runCli(["tenants", "sync", "--env", "staging", "--json"], io);

    expect(read().stdout).not.toContain("secret-token-value");
    expect(read().stderr).not.toContain("secret-token-value");
  });
});
