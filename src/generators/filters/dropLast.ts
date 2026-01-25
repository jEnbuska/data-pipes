import type {
  YieldedAsyncGenerator,
  YieldedSyncGenerator,
} from "../../types.ts";

export function* dropLastSync<TInput>(
  generator: YieldedSyncGenerator<TInput>,
  count: number,
): YieldedSyncGenerator<TInput> {
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
}

export async function* dropLastAsync<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
  count: number,
): YieldedAsyncGenerator<TInput> {
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
}
