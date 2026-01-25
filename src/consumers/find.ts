import type { YieldedAsyncGenerator } from "../shared.types.ts";

export function findAsync<T, TOut extends T = T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => value is TOut,
): Promise<TOut | undefined>;
export function findAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<T | undefined>;
export async function findAsync(
  generator: YieldedAsyncGenerator,
  predicate: (value: unknown, index: number) => unknown,
): Promise<unknown | undefined> {
  const index = 0;
  for await (const next of generator) {
    if (await predicate(next, index)) return next;
  }
}
