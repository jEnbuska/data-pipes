import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function takeWhileSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<TInput> {
  return function* takeWhileSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
