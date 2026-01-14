import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function skipLastSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* skipLastSyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = getDisposableGenerator(source, signal);
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

export function skipLastAsync<TInput>(
  source: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* skipLastAsyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = getDisposableAsyncGenerator(source, signal);
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
