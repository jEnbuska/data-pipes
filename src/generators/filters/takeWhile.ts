import {
  type AsyncYieldedProvider,
  type SyncYieldedProvider,
} from "../../types";
import {
  getDisposableAsyncGenerator,
  getDisposableGenerator,
} from "../../index.ts";

export function takeWhileSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* takeWhileSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
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
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
