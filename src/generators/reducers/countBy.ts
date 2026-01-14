import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { getDisposableGenerator } from "../../";
import { _internalY } from "../../utils";

export function countBySync<TInput>(
  source: SyncYieldedProvider<TInput>,
  mapper: (next: TInput) => number,
): SyncYieldedProvider<number> {
  return function* countSyncByGenerator(signal) {
    let acc = 0;
    using generator = getDisposableGenerator(source, signal);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  mapper: (next: TInput) => number,
): AsyncYieldedProvider<number> {
  return async function* countByAsyncGenerator(signal) {
    let acc = 0;
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
