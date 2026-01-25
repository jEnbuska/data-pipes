import type { YieldedAsyncGenerator } from "../shared.types.ts";

export async function everyAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    // Do not perform predicates, since we might want to stop at any point
    if (!(await predicate(next, index++))) return false;
  }
  return true;
}
