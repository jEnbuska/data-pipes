import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function chunkBySync<TInput, TIdentifier = any>(
  provider: SyncYieldedProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): SyncYieldedProvider<TInput[]> {
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
  provider: AsyncYieldedProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): AsyncYieldedProvider<TInput[]> {
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
