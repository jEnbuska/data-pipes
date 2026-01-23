import type { YieldedAsyncProvider, YieldedSyncProvider } from "../types.ts";

export function countBySync<TInput>(
  invoke: YieldedSyncProvider<TInput>,
  mapper: (next: TInput) => number,
): number {
  return invoke().reduce((acc, next) => mapper(next) + acc, 0);
}

export async function countByAsync<TInput>(
  invoke: YieldedAsyncProvider<TInput>,
  mapper: (next: TInput) => Promise<number> | number,
): Promise<number> {
  let acc = 0;
  function increment(value: number) {
    acc += value;
  }
  const pending = new Set<Promise<unknown>>();
  for await (const next of invoke()) {
    const promise = Promise.resolve(mapper(next)).then(increment);
    pending.add(promise);
    void promise.then(() => pending.delete(promise));
  }
  await Promise.all(pending.values());
  return acc;
}
