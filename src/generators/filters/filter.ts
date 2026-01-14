import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
  type YieldedProviderArgs,
} from "../../types";
import { _internalY } from "../../utils";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): SyncYieldedProvider<TOutput>;
export function filterSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): SyncYieldedProvider<TInput>;
export function filterSync(
  provider: SyncYieldedProvider<YieldedProviderArgs, unknown>,
  predicate: (next: unknown) => unknown,
): SyncYieldedProvider<YieldedProviderArgs, unknown> {
  return function* filterSyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): AsyncYieldedProvider<Awaited<TOutput>>;
export function filterAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => any,
): AsyncYieldedProvider<Awaited<TInput>>;
export function filterAsync(
  provider: AsyncYieldedProvider<YieldedProviderArgs, unknown>,
  predicate: (next: unknown) => any,
): AsyncYieldedProvider<YieldedProviderArgs, unknown> {
  return async function* filterAsyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}
