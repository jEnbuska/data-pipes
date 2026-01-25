import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* takeSync<TInput>(
  generator: YieldedIterator<TInput>,
  count: number,
): YieldedIterator<TInput> {
  if (count <= 0) return;
  for (const next of generator) {
    yield next;
    if (!--count) return;
  }
}

export async function* takeAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  count: number,
): YieldedAsyncGenerator<TInput> {
  if (count <= 0) return;
  for await (const next of generator) {
    yield next;
    if (!--count) return;
  }
}
