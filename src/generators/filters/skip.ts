import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function skipSync<TInput>(
  provider: YieldedSyncProvider<TInput>,
  count: number,
): YieldedSyncProvider<TInput> {
  return function* skipSyncGenerator(signal) {
    let skipped = 0;
    using generator = _yielded.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync<TInput>(
  provider: YieldedAsyncProvider<TInput>,
  count: number,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* skipAsyncGenerator(signal) {
    let skipped = 0;
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
