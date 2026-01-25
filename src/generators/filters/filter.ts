import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  generator: YieldedSyncGenerator<TInput>,
  predicate: (next: TInput) => next is TOutput,
): YieldedSyncGenerator<TOutput>;
export function filterSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  predicate: (next: TInput) => unknown,
): YieldedSyncGenerator<TInput>;
export function* filterSync(
  generator: YieldedSyncGenerator,
  predicate: (next: unknown) => unknown,
): YieldedSyncGenerator {
  for (const next of generator) {
    if (predicate(next)) yield next;
  }
}

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
