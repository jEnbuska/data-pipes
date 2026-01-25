import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* chunkBySync<TInput, TIdentifier = any>(
  generator: YieldedSyncGenerator<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): YieldedSyncGenerator<TInput[]> {
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
}

export async function* chunkByAsync<TInput, TIdentifier = any>(
  generator: YieldedAsyncGenerator<TInput>,
  keySelector: (next: TInput) => Promise<TIdentifier> | TIdentifier,
): YieldedAsyncGenerator<TInput[]> {
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
}
