import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function takeWhileSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn> {
  return function* takeWhileSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export function takeWhileAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* takeWhileAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}

export default defineOperator({
  name: "takeWhile",
  takeWhileAsync,
  takeWhileSync,
});
