import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function distinctBySync<TInput, TSelect>(
  provider: YieldedSyncProvider<TInput>,
  selector: (next: TInput) => TSelect,
): YieldedSyncProvider<TInput>;
export function distinctBySync(
  provider: YieldedSyncProvider<any, any>,
  selector: (next: any) => any,
) {
  return function* distinctBySyncGenerator(
    signal: AbortSignal,
  ): Generator<any, void, undefined & void> {
    const set = new Set<any>();
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
export function distinctByAsync<TInput, TSelect>(
  provider: YieldedAsyncProvider<TInput>,
  selector: (next: TInput) => TSelect,
): YieldedAsyncProvider<Awaited<TInput>> {
  return async function* distinctByAsyncGenerator(signal) {
    const set = new Set<TSelect>();
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
