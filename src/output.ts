import { CliError } from "./errors.js";
import type { CommandResult } from "./types.js";

export interface RenderedOutput {
  stdout: string;
  stderr: string;
}

export function renderSuccess(result: CommandResult, json: boolean): RenderedOutput {
  if (json) {
    return {
      stdout: `${JSON.stringify({ ok: true, ...result })}\n`,
      stderr: ""
    };
  }

  return {
    stdout: `${result.message}\n`,
    stderr: ""
  };
}

export function renderError(error: unknown, json: boolean): RenderedOutput {
  const publicError =
    error instanceof CliError
      ? { code: error.code, message: error.message }
      : { code: "runtime_failure", message: "Unexpected runtime failure" };

  if (json) {
    return {
      stdout: "",
      stderr: `${JSON.stringify({ ok: false, error: publicError })}\n`
    };
  }

  return {
    stdout: "",
    stderr: `Error: ${publicError.message}\n`
  };
}

