import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function skipWhileSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (next: TInput) => boolean,
): YieldedSyncProvider<TInput> {
  return function* skipWhileSyncGenerator(signal) {
    let skip = true;
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
