import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function defaultToSync<TInput, TDefault>(
  source: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
): SyncYieldedProvider<TInput | TDefault> {
  return function* defaultToSyncGenerator() {
    let empty = true;
    using generator = _internalYielded.disposable(source);
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
  source: AsyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
): AsyncYieldedProvider<TInput | TDefault> {
  return async function* defaultToAsyncGenerator() {
    let empty = true;
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
