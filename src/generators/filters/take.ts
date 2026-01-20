import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function takeSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn> {
  if (count < 1) throw new Error(`take ${count} must be greater than 0`);
  return function* takeSyncResolver() {
    while (true) {
      const value = yield* $next<TIn>();
      yield value;
      if (!--count) return;
    }
  };
}

export function takeAsync<TArgs extends any[], TIn>(
  count: number,
): AsyncOperatorResolver<TArgs, TIn> {
  if (count < 1) throw new Error(`take ${count} must be greater than 0`);
  return async function* takeAsyncResolver(...args) {
    using generator = startGenerator(...args);
    if (count <= 0) {
      return;
    }
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export default defineOperator({
  name: "take",
  takeSync,
  takeAsync,
});
