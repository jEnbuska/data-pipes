import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function countBySync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  mapper: (next: TInput) => number,
): YieldedSyncProvider<number> {
  return function* countSyncByGenerator(signal) {
    let acc = 0;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
