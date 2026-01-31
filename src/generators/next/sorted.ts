import {
  createIndexFinderAsync,
  toSortedAsync,
  toSortedSync,
} from "../../resolvers/apply/toSorted.ts";
import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { locked } from "../../utils.ts";
import { createParallel } from "../createParallel.ts";

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
  parallel: number,
  compareFn: (a: T, b: T) => IPromiseOrNot<number>,
): IYieldedParallelGenerator<T> {
  const arr: T[] = [];
  const findIndex = createIndexFinderAsync(arr, compareFn);
  const lockedUpdate = locked(async (next: T) => {
    const index = await findIndex(next);
    arr.splice(index, 0, next);
  });
  return createParallel<T>({
    generator,
    parallel,
    onNext(next) {
      void next.then(lockedUpdate);
      return { CONTINUE: null };
    },
    onDone() {
      if (!arr.length) return { RETURN: null };
      return { YIELD_FLAT: arr };
    },
  });
}
