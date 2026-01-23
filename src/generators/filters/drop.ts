import type {
  YieldedAsyncMiddleware,
  YieldedSyncMiddleware,
} from "../../types.ts";

export function dropSync<TInput>(count: number): YieldedSyncMiddleware<TInput> {
  return function* dropSyncResolver(generator) {
    yield* generator.drop(count);
  };
}
export function skipAsync<TInput>(
  count: number,
): YieldedAsyncMiddleware<TInput> {
  return async function* skipAsyncResolver(generator) {
    let skipped = 0;
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
