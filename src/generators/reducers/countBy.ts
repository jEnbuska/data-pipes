import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { getDisposableGenerator } from "../../";
import { _internalY } from "../../utils";

export function countBySync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  mapper: (next: TInput) => number,
): YieldedSyncProvider<number> {
  return function* countSyncByGenerator(signal) {
    let acc = 0;
    using generator = getDisposableGenerator(provider, signal);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  mapper: (next: TInput) => number,
): YieldedAsyncProvider<number> {
  return async function* countByAsyncGenerator(signal) {
    let acc = 0;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
