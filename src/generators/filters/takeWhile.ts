import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeWhileSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* takeWhileSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export function takeWhileAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* takeWhileAsyncGenerator(signal) {
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
