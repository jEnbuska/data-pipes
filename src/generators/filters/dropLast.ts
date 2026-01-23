import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function dropLastSync<TInput>(
  count: number,
): YieldedSyncMiddleware<TInput> {
  return function* skipLastSyncResolver(generator) {
    const buffer: TInput[] = [];
    let skipped = 0;

    for (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

export function dropLastAsync<TInput>(
  count: number,
): YieldedAsyncMiddleware<Awaited<TInput>> {
  return async function* skipLastAsyncResolver(generator) {
    const buffer: TInput[] = [];
    let skipped = 0;
    for await (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}
