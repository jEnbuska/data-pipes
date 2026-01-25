import { _yielded } from "../_internal.ts";
import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function toSortedSync<TInput>(
  generator: YieldedIterator<TInput>,
  compareFn: (a: TInput, b: TInput) => number,
): TInput[] {
  const acc: TInput[] = [];
  const findIndex = _yielded.createIndexFinder(acc, compareFn);
  for (const next of generator) {
    acc.splice(findIndex(next), 0, next);
  }
  return acc;
}
export async function toSortedAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  compareFn: (a: TInput, b: TInput) => Promise<number> | number,
): Promise<TInput[]> {
  const acc: TInput[] = [];
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
