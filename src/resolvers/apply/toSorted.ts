import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { resolveParallel } from "../resolveParallel.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedToSorted<T, TAsync extends boolean> {
  /**
   * Returns the items produced by the generator in sorted order as a new array.
   *
   * Items are inserted into the sorted result incrementally as they are
   * produced by the generator. Sorting happens **one item at a time** using
   * the provided comparison function, rather than collecting all items first
   * and sorting afterward.
   *
   * The generator is still fully consumed before the final array is returned.
   *
   * The `compare` function follows the same contract as
   * `Array.prototype.sort`:
   * - returns a negative number if `previous` should come before `next`
   * - returns a positive number if `previous` should come after `next`
   * - returns `0` to keep their relative order
   * */
  toSorted(
    compare: (previous: T, next: T) => ICallbackReturn<number, TAsync>,
  ): ReturnValue<T[], TAsync>;
}

function createIndexFinder<T>(arr: T[], comparator: (a: T, b: T) => number) {
  return function findIndex(next: T, low = 0, high = arr.length - 1) {
    if (low > high) {
      return low;
    }
    const mid = Math.floor((low + high) / 2);
    const diff = comparator(next, arr[mid]);
    if (diff < 0) {
      return findIndex(next, low, mid - 1);
    }
    return findIndex(next, mid + 1, high);
  };
}

export function toSortedSync<T>(
  generator: IYieldedIterator<T>,
  compareFn: (a: T, b: T) => number,
): T[] {
  const arr: T[] = [];
  const findIndex = createIndexFinder(arr, compareFn);
  for (const next of generator) {
    arr.splice(findIndex(next), 0, next);
  }
  return arr;
}

export async function toSortedAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  compareFn: (a: T, b: T) => IPromiseOrNot<number>,
): Promise<T[]> {
  const arr: T[] = [];
  const findIndex = createIndexFinderAsync(arr, compareFn);
  let pending: Promise<unknown> = Promise.resolve();
  for await (const next of generator) {
    pending = pending.then(() =>
      findIndex(next).then((index) => arr.splice(index, 0, next)),
    );
  }
  await pending;
  return arr;
}

export function toSortedParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  compareFn: (a: T, b: T) => IPromiseOrNot<number>,
): Promise<T[]> {
  const arr: T[] = [];
  const findIndex = createIndexFinderAsync(arr, compareFn);
  return resolveParallel({
    generator,
    parallel,
    parallelOnNext: 1,
    async onNext(value) {
      const index = await findIndex(value);
      arr.splice(index, 0, value);
    },
    onDone(resolve) {
      resolve(arr);
    },
  });
}

export function createIndexFinderAsync<T>(
  arr: T[],
  comparator: (a: T, b: T) => IPromiseOrNot<number>,
) {
  return async function findIndexAsync(
    next: T,
    low = 0,
    high = arr.length - 1,
  ) {
    if (low > high) {
      return low;
    }
    const mid = Math.floor((low + high) / 2);
    const diff = await comparator(next, arr[mid]);
    if (diff < 0) {
      return findIndexAsync(next, low, mid - 1);
    }
    return findIndexAsync(next, mid + 1, high);
  };
}
