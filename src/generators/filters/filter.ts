import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function filterSync<TInput, TOutput extends TInput = TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): YieldedSyncProvider<TOutput>;
export function filterSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => any,
): YieldedSyncProvider<TInput>;
export function filterSync(
  provider: YieldedSyncProvider<any, any>,
  predicate: (next: unknown) => unknown,
): YieldedSyncProvider<any, any> {
  return function* filterSyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TInput, TOutput extends TInput = TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => next is TOutput,
): YieldedAsyncProvider<Awaited<TOutput>>;
export function filterAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => any,
): YieldedAsyncProvider<Awaited<TInput>>;
export function filterAsync(
  provider: YieldedAsyncProvider<any, any>,
  predicate: (next: unknown) => any,
): YieldedAsyncProvider<any, any> {
  return async function* filterAsyncGenerator(signal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}
