import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
  type YieldedProviderArgs,
} from "../../types";
import { _internalY } from "../../utils";

export function distinctBySync<TInput, TSelect>(
  source: SyncYieldedProvider<TInput>,
  selector: (next: TInput) => TSelect,
): SyncYieldedProvider<TInput>;
export function distinctBySync(
  source: SyncYieldedProvider<YieldedProviderArgs, any>,
  selector: (next: any) => any,
) {
  return function* distinctBySyncGenerator(
    signal: AbortSignal,
  ): Generator<any, void, undefined & void> {
    const set = new Set<any>();
    using generator = _internalY.getDisposableGenerator(source, signal);
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
  source: AsyncYieldedProvider<TInput>,
  selector: (next: TInput) => TSelect,
): AsyncYieldedProvider<Awaited<TInput>> {
  return async function* distinctByAsyncGenerator(signal) {
    const set = new Set<TSelect>();
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
