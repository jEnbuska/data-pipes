import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function take<TInput>(
  source: SyncStreamlessProvider<TInput>,
  count: number,
): SyncStreamlessProvider<TInput> {
  return function* takeGenerator() {
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
): AsyncStreamlessProvider<TInput> {
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
