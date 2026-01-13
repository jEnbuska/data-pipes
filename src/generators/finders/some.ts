import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function some<TInput>(
  source: SyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): SyncStreamlessProvider<boolean> {
  return function* someGenerator() {
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncStreamlessProvider<boolean> {
  return async function* someAsyncGenerator() {
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
