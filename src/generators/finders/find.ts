import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableAsyncGenerator,
  getDisposableGenerator,
} from "../../index.ts";

export function findSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* findSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* findAsyncGenerator(signal) {
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
