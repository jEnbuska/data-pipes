import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeWhileSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* takeWhileSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export function takeWhileAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* takeWhileAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
