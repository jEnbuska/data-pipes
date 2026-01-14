import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function skipWhileSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<TInput> {
  return function* skipWhileSyncGenerator(signal) {
    let skip = true;
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}

export function skipWhileAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* skipWhileAsyncGenerator(signal) {
    let skip = true;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
