import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* takeSyncGenerator(signal) {
    if (count <= 0) {
      return;
    }
    using generator = _internalY.getDisposableGenerator(source, signal);
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
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
