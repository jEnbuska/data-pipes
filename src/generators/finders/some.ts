import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function someSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<boolean> {
  return function* someSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedAsyncProvider<boolean> {
  return async function* someAsyncGenerator(signal) {
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
