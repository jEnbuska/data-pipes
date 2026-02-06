import {
  createIndexFinderAsync,
  toSortedAsync,
  toSortedSync,
} from "../../resolvers/apply/toSorted.ts";
import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedIterator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../../shared.types";
import { throttle } from "../../utils/throttle.ts";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedSorted<T, TFlow extends IYieldedFlow> {
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
    compareFn: (a: T, b: T) => ICallbackReturn<number, TFlow>,
  ): INextYielded<T, TFlow>;
}

export function* sortedSync<T>(
  generator: IYieldedIterator<T>,
  compareFn: (a: T, b: T) => number,
): IYieldedIterator<T> {
  yield* toSortedSync(generator, compareFn);
}

export async function* sortedAsync<T = never>(
  generator: IYieldedAsyncGenerator<T>,
  compareFn: (a: T, b: T) => MaybeAsync<number>,
): IYieldedAsyncGenerator<T> {
  yield* await toSortedAsync(generator, compareFn);
}

export function sortedParallel<T = never>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  compareFn: (a: T, b: T) => MaybeAsync<number>,
): IYieldedParallelGenerator<T> {
  const arr: T[] = [];
  const findIndex = createIndexFinderAsync(arr, compareFn);
  const lockedUpdate = throttle(1, async (next: T) => {
    const index = await findIndex(next);
    arr.splice(index, 0, next);
  });
  return ParallelGenerator.create<T, T>({
    generator,
    parallel,
    onNext(next) {
      void next.then(lockedUpdate);
      return [];
    },
    async onDone() {
      await lockedUpdate.all();
      return arr;
    },
  });
}
