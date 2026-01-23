import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function takeSync<TInput>(count: number): YieldedSyncMiddleware<TInput> {
  return function* takeSyncResolver(generator) {
    if (count <= 0) return;
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  count: number,
): YieldedAsyncMiddleware<Awaited<TInput>> {
  return async function* takeAsyncResolver(generator) {
    if (count <= 0) return;
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
