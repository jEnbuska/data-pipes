import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function countSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
): YieldedSyncProvider<number> {
  return function* countSyncGenerator(signal) {
    using generator = _yielded.getDisposableGenerator(provider, signal);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
): YieldedAsyncProvider<number> {
  return async function* countAsyncGenerator(signal) {
    let count = 0;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
