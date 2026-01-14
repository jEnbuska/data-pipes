import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function findSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* findSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* findAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
