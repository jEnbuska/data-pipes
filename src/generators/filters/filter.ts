import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
  type YieldedProviderArgs,
} from "../../types";
import {
  getDisposableAsyncGenerator,
  getDisposableGenerator,
} from "../../index.ts";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): SyncYieldedProvider<TOutput>;
export function filterSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): SyncYieldedProvider<TInput>;
export function filterSync(
  source: SyncYieldedProvider<YieldedProviderArgs, unknown>,
  predicate: (next: unknown) => unknown,
): SyncYieldedProvider<YieldedProviderArgs, unknown> {
  return function* filterSyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncYieldedProvider<Awaited<TOutput>>;
export function filterAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): AsyncYieldedProvider<Awaited<TInput>>;
export function filterAsync(
  source: AsyncYieldedProvider<YieldedProviderArgs, unknown>,
  predicate: (next: unknown) => any,
): AsyncYieldedProvider<YieldedProviderArgs, unknown> {
  return async function* filterAsyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}
