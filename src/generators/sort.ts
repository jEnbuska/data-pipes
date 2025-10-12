import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function sort<TInput>(
  source: PipeSource<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): PipeSource<TInput> {
  return function* sortGenerator(signal) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    for (const next of source(signal)) {
      const index = findIndex(next);
      acc.splice(index, 0, next);
    }
    yield* acc;
  };
}

export function sortAsync<TInput = never>(
  source: AsyncPipeSource<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): AsyncPipeSource<TInput> {
  return async function* sortAsyncGenerator(signal) {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    for await (const next of source(signal)) {
      const index = findIndex(next);
      acc.splice(index, 0, next);
    }
    yield* acc;
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
