import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function chunkBySync<TInput, TIdentifier = any>(
  provider: YieldedSyncProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): YieldedSyncProvider<TInput[]> {
  return function* chunkBySyncGenerator(signal) {
    const map = new Map<any, TInput[]>();
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  provider: YieldedAsyncProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): YieldedAsyncProvider<TInput[]> {
  return async function* chunkByAsyncGenerator(signal) {
    const map = new Map<any, TInput[]>();
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}
