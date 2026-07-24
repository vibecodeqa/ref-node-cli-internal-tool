export const ExitCode = {
  Success: 0,
  RuntimeFailure: 1,
  Usage: 2,
  Auth: 3,
  Safety: 4,
  Upstream: 5
} as const;

export type ExitCode = (typeof ExitCode)[keyof typeof ExitCode];

