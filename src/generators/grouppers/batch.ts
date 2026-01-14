import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

function batchSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): SyncYieldedProvider<TInput[]> {
  return function* batchSyncGenerator(signal) {
    let acc: TInput[] = [];
    using generator = getDisposableGenerator(source, signal);
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

export default batchSync;

export function batchAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  predicate: (batch: TInput[]) => boolean,
): AsyncYieldedProvider<TInput[]> {
  return async function* batchGenerator(signal) {
    let acc: TInput[] = [];
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}
