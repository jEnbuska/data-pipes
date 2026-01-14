import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

function batchSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): YieldedSyncProvider<TInput[]> {
  return function* batchSyncGenerator(signal) {
    let acc: TInput[] = [];
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  predicate: (batch: TInput[]) => boolean,
): YieldedAsyncProvider<TInput[]> {
  return async function* batchGenerator(signal) {
    let acc: TInput[] = [];
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}
