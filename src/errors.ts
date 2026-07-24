import type { ExitCode } from "./exit-codes.js";

export class CliError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly exitCode: ExitCode
  ) {
    super(message);
  }
}

