import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function takeSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* takeSyncGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = _internalYielded.disposable(source);
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
  return async function* takeAsyncGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
