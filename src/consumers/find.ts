import type { YieldedAsyncGenerator } from "../types.ts";

export function findAsync<TInput, TOutput extends TInput = TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (value: TInput, index: number) => value is TOutput,
): Promise<TOutput | undefined>;
export function findAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (value: TInput, index: number) => unknown,
): Promise<TInput | undefined>;
export async function findAsync(
  generator: YieldedAsyncGenerator,
  predicate: (value: unknown, index: number) => unknown,
): Promise<unknown | undefined> {
  const index = 0;
  for await (const next of generator) {
    if (await predicate(next, index)) return next;
  }
}
