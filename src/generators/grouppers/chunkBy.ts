import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function chunkBySync<TArgs extends any[], TIn, TIdentifier = any>(
  keySelector: (next: TIn) => TIdentifier,
): SyncOperatorResolver<TArgs, TIn, TIn[]> {
  return function* chunkBySyncResolver(...args) {
    using generator = startGenerator(...args);
    const map = new Map<any, TIn[]>();
    for (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export function chunkByAsync<TArgs extends any[], TIn, TIdentifier = any>(
  keySelector: (next: TIn) => TIdentifier,
): AsyncOperatorResolver<TArgs, TIn, TIn[]> {
  return async function* chunkByAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const map = new Map<any, TIn[]>();
    for await (const next of generator) {
      const key = keySelector(next);
      if (!map.has(next)) map.set(next, []);
      map.get(key)!.push(next);
    }
    yield* map.values();
  };
}

export default defineOperator({
  name: "chunkBy",
  chunkByAsync,
  chunkBySync,
});
