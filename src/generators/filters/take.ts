import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function takeSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn> {
  if (count < 1) throw new Error(`take ${count} must be greater than 0`);
  return function* takeSyncResolver(...args) {
    using generator = startGenerator(...args);
    if (count <= 0) {
      return;
    }
    for (const next of generator) {
      yield next;
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
