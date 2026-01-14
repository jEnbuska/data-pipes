import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function minSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  callback: (next: TInput) => number,
): YieldedSyncProvider<TInput> {
  return function* minSyncGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  callback: (next: TInput) => number,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* minAsyncGenerator(signal) {
    let currentMin: undefined | number;
    let current: undefined | TInput;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
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
