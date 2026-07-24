import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseArgs } from "./args.js";
import { resolveCredential } from "./credentials.js";

describe("resolveCredential", () => {
  it("prefers explicit token over env", async () => {
    const credential = await resolveCredential(parseArgs(["health", "--token", "flag-token"]), {
      VCQA_REF_TOKEN: "env-token"
    });

    expect(credential).toEqual({ source: "flag", token: "flag-token" });
  });

  it("reads token files after env", async () => {
    const dir = await mkdtemp(join(tmpdir(), "vcqa-ref-cli-"));
    const tokenFile = join(dir, "token");
    await writeFile(tokenFile, "file-token\n", "utf8");

    const credential = await resolveCredential(parseArgs(["health", "--token-file", tokenFile]), {});

    expect(credential).toEqual({ source: "file", token: "file-token" });
  });
});

