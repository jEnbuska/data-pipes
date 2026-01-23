import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function takeLastSync<TInput>(
  count: number,
): YieldedSyncMiddleware<TInput, TInput, TInput[]> {
  return function* takeLastSyncResolver(generator) {
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
    return list;
  };
}

export function takeLastAsync<TInput>(
  count: number,
): YieldedAsyncMiddleware<TInput, TInput, TInput[]> {
  return async function* takeLastAsyncResolver(generator) {
    const acc: TInput[] = [];
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
    return list;
  };
}
