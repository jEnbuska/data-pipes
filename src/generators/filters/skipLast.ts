import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function skipLastSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput> {
  return function* skipLastSyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  count: number,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* skipLastAsyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
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
