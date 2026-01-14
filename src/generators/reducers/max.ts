import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function maxSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  callback: (next: TInput) => number,
): YieldedSyncProvider<TInput> {
  return function* maxSyncGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  callback: (next: TInput) => number,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* maxGenerator(signal) {
    let currentMax: undefined | number;
    let current: undefined | TInput;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
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
