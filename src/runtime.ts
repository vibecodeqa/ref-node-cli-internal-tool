import { DemoApiClient, type ApiClient } from "./api-client.js";
import { parseArgs } from "./args.js";
import { resolveCredential } from "./credentials.js";
import { CliError } from "./errors.js";
import { ExitCode } from "./exit-codes.js";
import { renderError, renderSuccess } from "./output.js";
import { assertSafe } from "./safety.js";

export interface RuntimeIO {
  stdout: Pick<NodeJS.WriteStream, "write">;
  stderr: Pick<NodeJS.WriteStream, "write">;
  env: NodeJS.ProcessEnv;
}

export async function runCli(
  argv: string[],
  io: RuntimeIO,
  client: ApiClient = new DemoApiClient()
): Promise<number> {
  let json = false;

  try {
    const args = parseArgs(argv);
    json = args.json;
    assertSafe(args);

    const credential = await resolveCredential(args, io.env);
    const { runCommand } = await import("./commands.js");
    const result = await runCommand(client, { args, credential });
    const output = renderSuccess(result, args.json);
    io.stdout.write(output.stdout);
    io.stderr.write(output.stderr);
    return ExitCode.Success;
  } catch (error) {
    const output = renderError(error, json);
    io.stdout.write(output.stdout);
    io.stderr.write(output.stderr);

    if (error instanceof CliError) {
      return error.exitCode;
    }

    return ExitCode.RuntimeFailure;
  }
}

