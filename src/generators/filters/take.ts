import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function takeSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput> {
  return function* takeSyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
