import { toSortedAsync, toSortedSync } from "../consumers/toSorted.ts";
import type {
  CallbackReturn,
  NextYielded,
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
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
   *
   * @example
   * ```ts
   * Yielded.from(['banana', 'apple', 'cherry'])
   *   .sorted((a, b) => a.localeCompare(b))
   *   .toArray() satisfies string[] // ['apple', 'banana', 'cherry']
   * ```
   */
  sorted(
    compareFn: (a: T, b: T) => CallbackReturn<number, TAsync>,
  ): NextYielded<T, TAsync>;
}

export function* sortedSync<T>(
  generator: YieldedIterator<T>,
  compareFn: (a: T, b: T) => number,
): YieldedIterator<T> {
  yield* toSortedSync(generator, compareFn);
}

export async function* sortedAsync<T = never>(
  generator: YieldedAsyncGenerator<T>,
  compareFn: (a: T, b: T) => PromiseOrNot<number>,
): YieldedAsyncGenerator<T> {
  yield* await toSortedAsync(generator, compareFn);
}
