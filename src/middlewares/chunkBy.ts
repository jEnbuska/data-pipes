import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* chunkBySync<T, TIdentifier = any>(
  generator: YieldedIterator<T>,
  keySelector: (next: T) => TIdentifier,
): YieldedIterator<T[]> {
  const acc: T[][] = [];
  const indexMap = new Map<TIdentifier, number>();
  for (const next of generator) {
    const key = keySelector(next);
    if (!indexMap.has(key)) {
      indexMap.set(key, acc.length);
      acc.push([]);
    }
    const index = indexMap.get(key)!;
    acc[index].push(next);
  }
  yield* acc;
}

export async function* chunkByAsync<T, TIdentifier = any>(
  generator: YieldedAsyncGenerator<T>,
  keySelector: (next: T) => PromiseOrNot<TIdentifier>,
): YieldedAsyncGenerator<T[]> {
  const acc: T[][] = [];
  const indexMap = new Map<TIdentifier, number>();

  const pending = new Set<Promise<unknown> | unknown>([]);
  for await (const next of generator) {
    // Start waiting for the next one even though resolving the key might take a while
    const promise = Promise.resolve(keySelector(next)).then((key) => {
      if (!indexMap.has(key)) {
        indexMap.set(key, acc.length);
        acc.push([]);
      }
      const index = indexMap.get(key)!;
      acc[index].push(next);
    });
    pending.add(promise);
    void promise.then(() => {
      pending.delete(promise);
    });
  }
  await Promise.all(pending.values());
  yield* acc;
}
