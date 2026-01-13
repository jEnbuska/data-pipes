import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function takeSync<TInput>(
  source: SyncStreamlessProvider<TInput>,
  count: number,
): SyncStreamlessProvider<TInput> {
  return function* takeSyncGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  count: number,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* takeAsyncGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
