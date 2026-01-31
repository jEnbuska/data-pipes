import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { createParallel } from "../createParallel.ts";

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
  parallel: number,
  count: number,
): IYieldedParallelGenerator<T> {
  const acc: Array<Promise<T>> = [];
  return createParallel<T>({
    generator,
    parallel,
    onNext(next) {
      acc.push(next);
      if (acc.length <= count) return { CONTINUE: null };
      return { YIELD: acc.shift()! };
    },
    onDone() {
      if (!acc.length) return { RETURN: null };
      return { YIELD_FLAT: acc };
    },
  });
}
