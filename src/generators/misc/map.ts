import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function mapSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  mapper: (next: TInput) => TOutput,
): YieldedSyncProvider<TOutput> {
  return function* mapSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
