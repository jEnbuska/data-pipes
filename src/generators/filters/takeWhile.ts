import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function takeWhileSync<TInput>(
  predicate: (next: TInput) => boolean,
): YieldedSyncMiddleware<TInput> {
  return function* takeWhileSyncResolver(generator) {
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export function takeWhileAsync<TInput>(
  predicate: (next: TInput) => Promise<boolean> | boolean,
): YieldedAsyncMiddleware<Awaited<TInput>> {
  return async function* takeWhileAsyncResolver(generator) {
    for await (const next of generator) {
      if (!(await predicate(next))) return;
      yield next;
    }
  };
}
