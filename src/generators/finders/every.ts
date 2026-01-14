import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function everySync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<boolean> {
  return function* everySyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedAsyncProvider<boolean> {
  return async function* everyAsyncGenerator(signal) {
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
