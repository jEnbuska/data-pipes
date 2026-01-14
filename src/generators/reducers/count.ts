import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { getDisposableAsyncGenerator, getDisposableGenerator } from "../../";

export function countSync<TInput>(
  source: SyncYieldedProvider<TInput>,
): SyncYieldedProvider<number> {
  return function* countSyncGenerator(signal) {
    using generator = getDisposableGenerator(source, signal);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
): AsyncYieldedProvider<number> {
  return async function* countAsyncGenerator(signal) {
    let count = 0;
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
