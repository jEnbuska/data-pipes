import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { getDisposableGenerator } from "../../";
import { _internalY } from "../../utils";

export function minSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): SyncYieldedProvider<TInput> {
  return function* minSyncGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = getDisposableGenerator(provider, signal);
    for (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}

export function minAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  callback: (next: TInput) => number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* minAsyncGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      const value = callback(next);
      if (currentMin === undefined || value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    if (currentMin === undefined) {
      return;
    }
    yield current as TInput;
  };
}
