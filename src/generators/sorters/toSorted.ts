import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

function createIndexFinder<TIn>(
  arr: TIn[],
  comparator: (a: TIn, b: TIn) => number,
) {
  return function findIndex(next: TIn, low = 0, high = arr.length - 1) {
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

export function toSortedSync<TArgs extends any[], TIn>(
  compareFn: (a: TIn, b: TIn) => number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* sortSyncResolver(...args) {
    using generator = startGenerator(...args);
    const acc: TIn[] = [];
    const findIndex = createIndexFinder(acc, compareFn);

    for (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
  };
}

export function toSortedAsync<TArgs extends any[], TIn = never>(
  compareFn: (a: TIn, b: TIn) => number,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* sortAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const acc: TIn[] = [];
    const findIndex = createIndexFinder(acc, compareFn);

    for await (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
  };
}

export default defineOperator({
  name: "toSorted",
  toSortedAsync,
  toSortedSync,
});
