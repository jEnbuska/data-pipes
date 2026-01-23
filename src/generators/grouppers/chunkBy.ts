import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function chunkBySync<TInput, TIdentifier = any>(
  keySelector: (next: TInput) => TIdentifier,
): YieldedSyncMiddleware<TInput, TInput[]> {
  return function* chunkBySyncResolver(generator) {
    const acc: TInput[][] = [];
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
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  keySelector: (next: TInput) => Promise<TIdentifier> | TIdentifier,
): YieldedAsyncMiddleware<TInput, TInput[]> {
  return async function* chunkByAsyncResolver(generator) {
    const acc: TInput[][] = [];
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
  };
}
