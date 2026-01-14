import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
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
  provider: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
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
