import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function* takeLastSync<T>(
  generator: YieldedIterator<T>,
  count: number,
): YieldedIterator<T> {
  const array = [...generator]; // TODO store only last N ones
  const list = array.slice(Math.max(array.length - count, 0));
  yield* list;
}

export async function* takeLastAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  const acc: T[] = [];
  for await (const next of generator) {
    acc.push(next); // TODO store only last N ones
  }
  const list = acc.slice(Math.max(acc.length - count, 0));
  yield* list;
}
