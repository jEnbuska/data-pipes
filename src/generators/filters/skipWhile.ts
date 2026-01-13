import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function skipWhile<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncStreamlessProvider<TInput> {
  return function* skipWhileGenerator() {
    let skip = true;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}

export function skipWhileAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<Awaited<TInput>> {
  return async function* skipWhileAsyncGenerator() {
    let skip = true;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
