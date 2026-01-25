import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export async function* awaited<TInput>(
  generator: YieldedIterator<TInput>,
): YieldedAsyncGenerator<Awaited<TInput>> {
  for (const next of generator) {
    yield next;
  }
}
