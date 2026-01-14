import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function chunkBySync<TInput, TIdentifier = any>(
  source: SyncYieldedProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): SyncYieldedProvider<TInput[]> {
  return function* chunkBySyncGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  source: AsyncYieldedProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): AsyncYieldedProvider<TInput[]> {
  return async function* chunkByAsyncGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}
