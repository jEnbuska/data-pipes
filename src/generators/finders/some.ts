import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableAsyncGenerator,
  getDisposableGenerator,
} from "../../index.ts";

export function someSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncYieldedProvider<boolean> {
  return function* someSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncYieldedProvider<boolean> {
  return async function* someAsyncGenerator(signal) {
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
