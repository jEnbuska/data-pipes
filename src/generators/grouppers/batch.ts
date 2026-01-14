import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

function batchSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  predicate: (acc: TInput[]) => boolean,
): SyncYieldedProvider<TInput[]> {
  return function* batchSyncGenerator(signal) {
    let acc: TInput[] = [];
    using generator = _internalY.getDisposableGenerator(source, signal);
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
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc.push(next);
      if (!predicate(acc)) continue;
      yield acc;
      acc = [];
    }
    if (acc.length) yield acc;
  };
}
