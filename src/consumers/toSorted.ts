import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../types.ts";

export function toSortedSync<TInput>(
  compareFn: (a: TInput, b: TInput) => number,
): YieldedSyncMiddleware<TInput, TInput, TInput[]> {
  return function* sortSyncResolver(generator) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, compareFn);
    for (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
    return acc;
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

export function toSortedAsync<TInput = never>(
  compareFn: (a: TInput, b: TInput) => Promise<number> | number,
): YieldedAsyncMiddleware<TInput, TInput, TInput[]> {
  return async function* sortAsyncResolver(generator) {
    const acc: TInput[] = [];
    let pending: Promise<unknown> = Promise.resolve();
    const findIndex = createIndexFinderAsync(acc, compareFn);
    for await (const next of generator) {
      pending = pending.then(() =>
        findIndex(next).then((index) => acc.splice(index, 0, next)),
      );
    }
    await pending;
    yield* acc;
    return acc;
  };
}

function createIndexFinderAsync<TInput>(
  arr: TInput[],
  comparator: (a: TInput, b: TInput) => Promise<number> | number,
) {
  return async function findIndexAsync(
    next: TInput,
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
