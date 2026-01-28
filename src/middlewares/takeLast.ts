import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

export interface IYieldedTakeLast<T, TAsync extends boolean> {
  /**
   * Yields only the last `count` items produced by the generator to the
   * next operation in the pipeline.
   *
   * The operator buffers items internally. The number of items specified
   * by `count` will be kept in memory, and **no items are yielded to the
   * next operation until the upstream generator is fully consumed**.
   *
   * If the generator produces fewer items than `count`, all items are yielded.
   *
   * @example
   * ```ts
   * Yielded.from([1,2,3,4,5])
   *  .takeLast(2)
   *  .toArray() satisfies number[] // [4,5]
   *  ```
   * ```ts
   * Yielded.from([1, 2])
   *   .takeLast(5)
   *   .toArray() satisfies number[] // [1, 2]
   *   ```
   */
  takeLast(count: number): INextYielded<T, TAsync>;
}

export function* takeLastSync<T>(
  generator: IYieldedIterator<T>,
  count: number,
): IYieldedIterator<T> {
  const acc: T[] = [];
  for (const next of generator) {
    acc.push(next);
    if (acc.length > count) acc.shift();
  }
  yield* acc;
}

export async function* takeLastAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  count: number,
): IYieldedAsyncGenerator<T> {
  const acc: T[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (acc.length > count) acc.shift();
  }
  yield* acc;
}

export function takeLastParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  count: number,
): IYieldedParallelGeneratorOnNext<T> {
  const acc: Array<Promise<T>> = [];
  return async (wrap) => {
    const next = await generator.next();
    while (!next.done) {
      acc.push(next.value);
      if (acc.length > count) void acc.shift();
    }
    if (next.done) return;
    if (!acc.length) return;
    return wrap(acc.shift()!);
  };
}
