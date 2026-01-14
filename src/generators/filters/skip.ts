import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function skipSync<TInput>(
  provider: SyncYieldedProvider<TInput>,
  count: number,
): SyncYieldedProvider<TInput> {
  return function* skipSyncGenerator(signal) {
    let skipped = 0;
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: AsyncYieldedProvider<TInput>,
  count: number,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* skipAsyncGenerator(signal) {
    let skipped = 0;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
