import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function dropWhileSync<TInput>(
  predicate: (next: TInput) => boolean,
): YieldedSyncMiddleware<TInput> {
  return function* skipWhileSyncResolver(generator) {
    for (const next of generator) {
      if (predicate(next)) continue;
      yield next;
      break;
    }
    for (const next of generator) {
      yield next;
    }
  };
}

export function dropWhileAsync<TInput>(
  predicate: (next: TInput) => Promise<boolean> | boolean,
): YieldedAsyncMiddleware<Awaited<TInput>> {
  const pending = Promise.resolve(true);
  return async function* skipWhileAsyncResolver(generator) {
    for await (const next of generator) {
      if (await predicate(next)) continue;
      yield next;
      break;
    }
    for await (const next of generator) {
      yield next;
    }
  };
}
