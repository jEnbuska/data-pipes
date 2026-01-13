import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function chunkBy<TInput, TIdentifier = any>(
  source: SyncStreamlessProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): SyncStreamlessProvider<TInput[]> {
  return function* chunkByGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TInput, TIdentifier = any>(
  source: AsyncStreamlessProvider<TInput>,
  keySelector: (next: TInput) => TIdentifier,
): AsyncStreamlessProvider<TInput[]> {
  return async function* chunkByAsyncGenerator() {
    const map = new Map<any, TInput[]>();
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}
