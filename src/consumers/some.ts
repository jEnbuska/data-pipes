import type { YieldedAsyncGenerator } from "../types.ts";

export async function someAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    if (await predicate(next, index++)) return true;
  }
  return false;
}
