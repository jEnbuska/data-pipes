import type { YieldedAsyncGenerator } from "../shared.types.ts";

export interface IYieldedFilter<T, TAsync extends boolean> {}

export function filterAsync<T, TOut extends T = T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (next: T) => next is TOut,
): YieldedAsyncGenerator<TOut>;
export function filterAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (next: T) => unknown,
): YieldedAsyncGenerator<T>;
export async function* filterAsync(
  generator: YieldedAsyncGenerator,
  predicate: (next: unknown) => unknown,
): YieldedAsyncGenerator {
  for await (const next of generator) {
    if (await predicate(next)) yield next;
  }
}
