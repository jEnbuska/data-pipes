import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export async function* awaited<T>(
  generator: YieldedIterator<T>,
): YieldedAsyncGenerator<Awaited<T>> {
  for (const next of generator) {
    yield next;
  }
}
