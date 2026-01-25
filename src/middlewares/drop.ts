import type { YieldedAsyncGenerator } from "../types.ts";

export async function* dropAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  for await (const next of generator) {
    if (count) {
      count++;
      continue;
    }
    yield next;
  }
}
