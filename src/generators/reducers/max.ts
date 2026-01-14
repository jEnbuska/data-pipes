import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function maxSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): SyncYieldedProvider<TInput> {
  return function* maxSyncGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalY.getDisposableGenerator(source, signal);
    for (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}

export function maxAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* maxGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      const value = callback(next);
      if (currentMax === undefined || value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    if (currentMax === undefined) {
      return;
    }
    yield current as TInput;
  };
}
