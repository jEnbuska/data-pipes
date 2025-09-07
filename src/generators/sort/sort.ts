import {
  type GeneratorMiddleware,
  type AsyncGeneratorMiddleware,
} from "../../types";

/**
 * sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
 *
 * @example
 * pipe(
 *  [3,2,1],
 *  sort((a, z) => a - z)
 * ).toArray() // [1,2,3]
 */
export function sort<TInput = never>(
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): GeneratorMiddleware<TInput> {
  return function* sortGenerator(generator) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    for (const next of generator) {
      const index = findIndex(next);
      acc.splice(index, 0, next);
    }
    yield* acc;
  };
}

export function sortAsync<TInput = never>(
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): AsyncGeneratorMiddleware<TInput> {
  return async function* sortAsyncGenerator(generator) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    for await (const next of generator) {
      const index = findIndex(next);
      acc.splice(index, 0, next);
    }
    yield* acc;
  };
}

export function defaultCompare(a: unknown, b: unknown): number {
  // Numbers: handle NaN, undefined, null last
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a)) return 1;
    if (Number.isNaN(b)) return -1;
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
    if (low >= high) return low;
    const mid = Math.floor((high + low) / 2);
    const diff = comparator(next, arr[cursor]);
    if (diff < 0) {
      return findIndex(next, low, mid);
    }
    return findIndex(next, mid + 1, high);
  };
}
