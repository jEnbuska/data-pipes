import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function takeSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* takeSyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* takeAsyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
