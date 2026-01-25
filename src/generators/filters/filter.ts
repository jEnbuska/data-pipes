import type { YieldedAsyncGenerator } from "../../types.ts";

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (next: TInput) => next is TOutput,
): YieldedAsyncGenerator<TOutput>;
export function filterAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  predicate: (next: TInput) => unknown,
): YieldedAsyncGenerator<TInput>;
export async function* filterAsync(
  generator: YieldedAsyncGenerator,
  predicate: (next: unknown) => unknown,
): YieldedAsyncGenerator {
  for await (const next of generator) {
    if (await predicate(next)) yield next;
  }
}
