import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function skipLastSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput> {
  return function* skipLastSyncGenerator(signal) {
    const buffer: TInput[] = [];
    let skipped = 0;
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
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
