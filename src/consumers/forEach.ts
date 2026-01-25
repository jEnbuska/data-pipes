import type { YieldedAsyncGenerator } from "../shared.types.ts";

export async function forEachAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  callback: (next: T, index: number) => unknown,
): Promise<void> {
  let index = 0;
  for await (const next of generator) callback(next, index++);
}
