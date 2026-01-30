import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { createParallel } from "../createParallel.ts";

export interface IYieldedChunkBy<T, TParallel extends boolean> {
  /**
   * Splits the items produced by the generator into chunks based on the
   * key returned by the provided selector function.
   *
   * Items producing the same key (as returned by `fn`) are grouped together
   * into the same chunk. The order of items within each chunk is preserved
   * according to their original order in the generator.
   *
   * After all items are collected, the chunks (groups) are **yielded as
   * lists** to the next operation in the pipeline.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4, 5])
   *   .chunkBy(n => n % 2)
   *   .toArray() satisfies number[][] // [[1, 3, 5], [2, 4]]
   * ```
   * ```ts
   * Yielded.from(['apple', 'banana', 'apricot', 'blueberry'])
   *   .chunkBy(fruit => fruit[0])
   *   .toArray() satisfies string[][] // [['apple', 'apricot'], ['banana', 'blueberry']]
   */
  chunkBy<TIdentifier>(
    fn: (next: T) => ICallbackReturn<TIdentifier, TParallel>,
  ): INextYielded<T[], TParallel>;
}

export function* chunkBySync<T, TIdentifier = any>(
  generator: IYieldedIterator<T>,
  keySelector: (next: T) => TIdentifier,
): IYieldedIterator<T[]> {
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
  generator: IYieldedAsyncGenerator<T>,
  keySelector: (next: T) => IPromiseOrNot<TIdentifier>,
): IYieldedAsyncGenerator<T[]> {
  const acc: T[][] = [];
  const indexMap = new Map<TIdentifier, number>();
  for await (const next of generator) {
    // Start waiting for the next one even though resolving the key might take a while
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

export function chunkByParallel<T, TIdentifier = any>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  keySelector: (next: T) => IPromiseOrNot<TIdentifier>,
): IYieldedParallelGenerator<T[]> {
  const acc: T[][] = [];
  const indexMap = new Map<TIdentifier, number>();
  const pending = new Set<Promise<void>>();
  async function storePending(promise: Promise<void>) {
    pending.add(promise);
    await promise;
    pending.delete(promise);
  }
  async function stash(next: T) {
    const key = await keySelector(next);
    if (!indexMap.has(key)) {
      indexMap.set(key, acc.length);
      acc.push([]);
    }
    const index = indexMap.get(key)!;
    acc[index].push(next);
  }
  return createParallel<T, T[]>({
    generator,
    parallel,
    onNext(next) {
      void storePending(next.then(stash));
      return { CONTINUE: null };
    },
    async onDone() {
      await Promise.all(pending);
      if (acc.length) {
        return { YIELD: acc.shift()! };
      }
      return { RETURN: null };
    },
  });
}
