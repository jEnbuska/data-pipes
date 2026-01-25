import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* takeLastSync<TInput>(
  generator: YieldedIterator<TInput>,
  count: number,
): YieldedIterator<TInput> {
  const array = [...generator]; // TODO store only last N ones
  const list = array.slice(Math.max(array.length - count, 0));
  yield* list;
}

export async function* takeLastAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  count: number,
): YieldedAsyncGenerator<TInput> {
  const acc: TInput[] = [];
  for await (const next of generator) {
    acc.push(next); // TODO store only last N ones
  }
  const list = acc.slice(Math.max(acc.length - count, 0));
  yield* list;
}
