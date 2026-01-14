import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function toSortedSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* sortSyncGenerator() {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc;
    return acc;
  };
}

export function toSortedAsync<TInput = never>(
  source: AsyncYieldedProvider<TInput>,
  comparator: (a: TInput, b: TInput) => number = defaultCompare,
): AsyncYieldedProvider<Awaited<TInput>, Array<Awaited<TInput>>> {
  return async function* sortAsyncGenerator() {
    const acc: TInput[] = [];
    const findIndex = createIndexFinder(acc, comparator);
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      acc.splice(findIndex(next), 0, next);
    }
    yield* acc as Array<Awaited<TInput>>;
    return acc as Array<Awaited<TInput>>;
  };
}

function createJsonComparable(value: any) {
  const { stack } = new Error("");
  console.warn(`Yielded:\nCreating Object tack trace using JSON.stringify for comparison at:
${stack}\nNote this might be quite heavy operation and the sort result might be unpredictable`);
  return JSON.stringify(value);
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
  const sa = a === undefined || a === null ? "\uffff" : createJsonComparable(a);
  const sb = b === undefined || b === null ? "\uffff" : createJsonComparable(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
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
