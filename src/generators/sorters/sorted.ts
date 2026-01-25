import { toSortedAsync, toSortedSync } from "../../consumers/toSorted.ts";
import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* sortedSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  compareFn: (a: TInput, b: TInput) => number,
): YieldedSyncGenerator<TInput> {
  yield* toSortedSync(() => generator, compareFn);
}

export async function* sortedAsync<TInput = never>(
  generator: YieldedAsyncGenerator<TInput>,
  compareFn: (a: TInput, b: TInput) => Promise<number> | number,
): YieldedAsyncGenerator<TInput> {
  yield* await toSortedAsync(() => generator, compareFn);
}
