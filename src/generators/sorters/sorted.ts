import { toSortedAsync, toSortedSync } from "../../consumers/toSorted.ts";
import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* sortedSync<TInput>(
  generator: YieldedIterator<TInput>,
  compareFn: (a: TInput, b: TInput) => number,
): YieldedIterator<TInput> {
  yield* toSortedSync(generator, compareFn);
}

export async function* sortedAsync<TInput = never>(
  generator: YieldedAsyncGenerator<TInput>,
  compareFn: (a: TInput, b: TInput) => Promise<number> | number,
): YieldedAsyncGenerator<TInput> {
  yield* await toSortedAsync(generator, compareFn);
}
