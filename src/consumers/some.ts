import type { YieldedAsyncGenerator } from "../types.ts";

export async function someAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    if (await predicate(next, index++)) return true;
  }
  return false;
}
