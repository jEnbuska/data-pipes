import {
  createIndexFinderAsync,
  toSortedAsync,
  toSortedSync,
} from "../consumers/toSorted.ts";
import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

export interface IYieldedSorted<T, TAsync extends boolean> {
  /**
   * Sorts the items produced by the generator according to the provided
   * comparison function, then yields them one by one to the next operation
   * in the pipeline in sorted order.
   *
   * The operator **buffers all items internally** and sorts them incrementally
   * as they arrive. **No items are yielded downstream until the upstream
   * generator is fully consumed**.
   *
   * @example
   * ```ts
   * Yielded.from([3, 2, 1, 4, 5])
   *   .sorted((a, b) => a - b)
   *   .toArray() satisfies number[] // [1, 2, 3, 4, 5]
   * ```
   * ```ts
   * Yielded.from(['banana', 'apple', 'cherry'])
   *   .sorted((a, b) => a.localeCompare(b))
   *   .toArray() satisfies string[] // ['apple', 'banana', 'cherry']
   * ```
   */
  sorted(
    compareFn: (a: T, b: T) => ICallbackReturn<number, TAsync>,
  ): INextYielded<T, TAsync>;
}

export function* sortedSync<T>(
  generator: IYieldedIterator<T>,
  compareFn: (a: T, b: T) => number,
): IYieldedIterator<T> {
  yield* toSortedSync(generator, compareFn);
}

export async function* sortedAsync<T = never>(
  generator: IYieldedAsyncGenerator<T>,
  compareFn: (a: T, b: T) => IPromiseOrNot<number>,
): IYieldedAsyncGenerator<T> {
  yield* await toSortedAsync(generator, compareFn);
}

export function sortedParallel<T = never>(
  generator: IYieldedParallelGenerator<T>,
  compareFn: (a: T, b: T) => IPromiseOrNot<number>,
): IYieldedParallelGeneratorOnNext<T> {
  const arr: T[] = [];
  using handler = new ParallelHandler<T>();
  const findIndex = createIndexFinderAsync(arr, compareFn);
  handler.onAddedResolved(async (next) => {
    const index = await findIndex(next);
    arr.splice(index, 0, next);
  });
  return async (wrap) => {
    let next = await generator.next();
    while (!next.done) {
      void handler.register(next.value);
      next = await generator.next();
    }

    await handler.waitUntilAllResolved();
    if (!arr.length) return;
    return wrap(Promise.resolve(arr.shift()!));
  };
}
