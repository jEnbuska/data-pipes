import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function skipWhileSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
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
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
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
