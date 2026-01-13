import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function defaultToSync<TInput, TDefault>(
  source: SyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): SyncStreamlessProvider<TInput | TDefault> {
  return function* defaultToSyncGenerator() {
    let empty = true;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}

export function defaultToAsync<TInput, TDefault>(
  source: AsyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): AsyncStreamlessProvider<TInput | TDefault> {
  return async function* defaultToAsyncGenerator() {
    let empty = true;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
