import type { YieldedProvider } from "../../types.ts";

export function lift<In, Out, Return>(
  middleware: YieldedProvider<In, Out, Return>,
): YieldedProvider<In, Out, Return> {
  return middleware;
}
