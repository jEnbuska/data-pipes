import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function takeLastSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* takeLastSyncGenerator(signal) {
    using generator = _internalY.getDisposableGenerator(provider, signal);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  provider: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>, TInput[]> {
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
