import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function countSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
): YieldedSyncProvider<number> {
  return function* countSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
): YieldedAsyncProvider<number> {
  return async function* countAsyncGenerator(signal) {
    let count = 0;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
