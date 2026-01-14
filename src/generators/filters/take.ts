import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function takeSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput> {
  return function* takeSyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  count: number,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* takeAsyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
