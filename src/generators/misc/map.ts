import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function mapSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): YieldedSyncProvider<TOutput> {
  return function* mapSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  provider: YieldedAsyncProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): YieldedAsyncProvider<Awaited<TOutput>> {
  return async function* mapAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
