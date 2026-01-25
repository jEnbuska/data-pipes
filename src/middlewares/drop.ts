import type { YieldedAsyncGenerator } from "../shared.types.ts";

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
