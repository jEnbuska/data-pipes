import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { getDisposableGenerator, getDisposableAsyncGenerator } from "../../";

export function defaultToSync<TInput, TDefault>(
  source: SyncYieldedProvider<TInput>,
  getDefault: () => TDefault,
): SyncYieldedProvider<TInput | TDefault> {
  return function* defaultToSyncGenerator(signal) {
    let empty = true;
    using generator = getDisposableGenerator(source, signal);
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
  return async function* defaultToAsyncGenerator(signal) {
    let empty = true;
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
