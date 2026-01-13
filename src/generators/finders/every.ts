import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function everySync<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncStreamlessProvider<boolean> {
  return function* everySyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<boolean> {
  return async function* everyAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }
    yield true;
  };
}
