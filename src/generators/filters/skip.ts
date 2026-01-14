import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function skipSync<TInput>(
  source: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* skipSyncGenerator(signal) {
    let skipped = 0;
    using generator = getDisposableGenerator(source, signal);
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
  source: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* skipAsyncGenerator(signal) {
    let skipped = 0;
    using generator = getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
