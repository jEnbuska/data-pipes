import {
  type AsyncStreamlessProvider,
  type SyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function takeWhile<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncStreamlessProvider<TInput> {
  return function* takeWhileAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* takeWhileAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
