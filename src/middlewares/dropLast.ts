import type {
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export function* dropLastSync<T>(
  generator: YieldedIterator<T>,
  count: number,
): YieldedIterator<T> {
  const buffer: T[] = [];
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

export async function* dropLastAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  const buffer: T[] = [];
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
