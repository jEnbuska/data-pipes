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
  for await (const next of generator) {
    const key = await keySelector(next);
    if (!indexMap.has(key)) {
      indexMap.set(key, acc.length);
      acc.push([]);
    }
    const index = indexMap.get(key)!;
    acc[index].push(next);
  }
  yield* acc;
}
