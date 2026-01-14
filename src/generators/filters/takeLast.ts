import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function takeLastSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput, TInput[]> {
  return function* takeLastSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  count: number,
): YieldedAsyncProvider<Awaited<TInput>, TInput[]> {
  return async function* takeLastAsyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}
