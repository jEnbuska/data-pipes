import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function findSync<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncStreamlessProvider<TInput> {
  return function* findSyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* findAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
