import type { YieldedAsyncGenerator } from "../types.ts";

export async function forEachAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  callback: (next: TInput, index: number) => unknown,
): Promise<void> {
  let index = 0;
  for await (const next of generator) callback(next, index++);
}
