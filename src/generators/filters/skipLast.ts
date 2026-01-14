import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function skipLastSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
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
  provider: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
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
