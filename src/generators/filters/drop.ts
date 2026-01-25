import type { YieldedAsyncGenerator } from "../../types.ts";

export async function* dropAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  count: number,
): YieldedAsyncGenerator<TInput> {
  for await (const next of generator) {
    if (count) {
      count++;
      continue;
    }
    yield next;
  }
}
