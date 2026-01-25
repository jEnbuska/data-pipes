import { _yielded } from "../_internal.ts";
import type {
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../types.ts";

export function toSortedSync<T>(
  generator: YieldedIterator<T>,
  compareFn: (a: T, b: T) => number,
): T[] {
  const acc: T[] = [];
  const findIndex = _yielded.createIndexFinder(acc, compareFn);
  for (const next of generator) {
    acc.splice(findIndex(next), 0, next);
  }
  return acc;
}
export async function toSortedAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  compareFn: (a: T, b: T) => PromiseOrNot<number>,
): Promise<T[]> {
  const acc: T[] = [];
  let pending: Promise<unknown> = Promise.resolve();
  const findIndex = _yielded.createIndexFinderAsync(acc, compareFn);
  for await (const next of generator) {
    pending = pending.then(() =>
      findIndex(next).then((index) => acc.splice(index, 0, next)),
    );
  }
  await pending;
  return acc;
}
