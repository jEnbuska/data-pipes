import type { SyncYieldedProvider, AsyncYieldedProvider } from "../../types";
import { _internalYielded } from "../../utils";

export function batchSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): SyncYieldedProvider<TInput[]> {
  return function* batchSyncGenerator() {
    let acc: TInput[] = [];
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) {
        continue;
      }
      yield acc;
      acc = [];
    }
    if (acc.length) {
      yield acc;
    }
  };
}

export function batchAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (batch: TInput[]) => boolean,
): AsyncYieldedProvider<TInput[]> {
  return async function* batchGenerator() {
    let acc: TInput[] = [];
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}
