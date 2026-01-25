import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function countBySync<TInput>(
  generator: YieldedIterator<TInput>,
  mapper: (next: TInput) => number,
): number {
  return generator.reduce((acc, next) => mapper(next) + acc, 0);
}

export async function countByAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  mapper: (next: TInput) => Promise<number> | number,
): Promise<number> {
  let acc = 0;
  function increment(value: number) {
    acc += value;
  }
  const pending = new Set<Promise<unknown>>();
  for await (const next of generator) {
    const promise = Promise.resolve(mapper(next)).then(increment);
    pending.add(promise);
    void promise.then(() => pending.delete(promise));
  }
  await Promise.all(pending.values());
  return acc;
}
