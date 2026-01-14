import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function defaultToSync<TInput, TDefault>(
  provider: YieldedSyncProvider<TInput>,
  getDefault: () => TDefault,
): YieldedSyncProvider<TInput | TDefault> {
  return function* defaultToSyncGenerator(signal) {
    let empty = true;
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  getDefault: () => TDefault,
): YieldedAsyncProvider<TInput | TDefault> {
  return async function* defaultToAsyncGenerator(signal) {
    let empty = true;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
