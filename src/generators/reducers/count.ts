import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function countSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<number> {
  return function* countSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
): AsyncYieldedProvider<number> {
  return async function* countAsyncGenerator(signal) {
    let count = 0;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
