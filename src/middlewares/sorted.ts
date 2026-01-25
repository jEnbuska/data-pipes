import { toSortedAsync, toSortedSync } from "../consumers/toSorted.ts";
import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

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
