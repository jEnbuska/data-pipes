import { getDisposableGenerator, getDisposableAsyncGenerator } from "index";
import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";

export function takeLastSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput, TInput[]> {
  return function* takeLastSyncGenerator(signal) {
    const generator = getDisposableGenerator(source, signal);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>, TInput[]> {
  return async function* takeLastAsyncGenerator(signal) {
    const acc: TInput[] = [];
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}
