import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function sort<TInput>(
  source: ProviderFunction<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): ProviderFunction<TInput, TInput[]> {
  return function* sortGenerator() {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    using generator = disposable(source);
    for (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
    return acc;
  };
}

export function sortAsync<TInput = never>(
  source: AsyncProviderFunction<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): AsyncProviderFunction<TInput, TInput[]> {
  return async function* sortAsyncGenerator() {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    using generator = disposable(source);
    for await (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
    return acc;
  };
}

export function defaultCompare(a: unknown, b: unknown): number {
  // Numbers: handle NaN, undefined, null last
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a)) {
      return 1;
    }
    if (Number.isNaN(b)) {
      return -1;
    }
    return a - b;
  }
  // Strings
  if (typeof a === "string" && typeof b === "string") {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  // Fallback: JSON string compare to keep deterministic
  const sa = a === undefined || a === null ? "\uffff" : JSON.stringify(a);
  const sb = b === undefined || b === null ? "\uffff" : JSON.stringify(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

function createIndexFinder<TInput>(
  arr: TInput[],
  comparator: (a: TInput, b: TInput) => number,
) {
  return function findIndex(
    next: TInput,
    low = 0,
    high = arr.length - 1,
    cursor = Math.floor((low + high) / 2),
  ) {
    if (low >= high) {
      return low;
    }
    const mid = Math.floor((high + low) / 2);
    const diff = comparator(next, arr[cursor]);
    if (diff < 0) {
      return findIndex(next, low, mid);
    }
    return findIndex(next, mid + 1, high);
  };
}
