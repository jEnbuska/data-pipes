import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function skipWhileSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<TInput> {
  return function* skipWhileSyncGenerator(signal) {
    let skip = true;
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}

export function skipWhileAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* skipWhileAsyncGenerator(signal) {
    let skip = true;
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
