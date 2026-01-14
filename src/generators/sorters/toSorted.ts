import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function toSortedSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  compareFn: (a: TInput, b: TInput) => number,
): YieldedSyncProvider<TInput, TInput[]> {
  return function* sortSyncGenerator(signal) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, compareFn);
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
    return acc;
  };
}

export function toSortedAsync<TInput = never>(
  provider: YieldedAsyncProvider<TInput>,
  compareFn: (a: TInput, b: TInput) => number,
): YieldedAsyncProvider<Awaited<TInput>, Array<Awaited<TInput>>> {
  return async function* sortAsyncGenerator(signal) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, compareFn);
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}

function createIndexFinder<TInput>(
  arr: TInput[],
  comparator: (a: TInput, b: TInput) => number,
) {
  return function findIndex(next: TInput, low = 0, high = arr.length - 1) {
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
