import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeWhileSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<TInput> {
  return function* takeWhileSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export function takeWhileAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* takeWhileAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
