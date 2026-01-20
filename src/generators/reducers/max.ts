import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function maxBySync<TArgs extends any[], TIn>(
  callback: (next: TIn) => number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* maxSyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = generator.next();
    if (initial.done) return;
    let currentMax = callback(initial.value);
    let current = initial.value;
    for (const next of generator) {
      const value = callback(next);
      if (value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    yield current;
  };
}

export function maxByAsync<TArgs extends any[], TIn>(
  callback: (next: TIn) => number | Promise<number>,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* maxByGenerator(...args) {
    using generator = startGenerator(...args);
    const initial = await generator.next();
    if (initial.done) return;
    let currentMax = await callback(initial.value);
    let current = initial.value;
    for await (const next of generator) {
      const value = await callback(next);
      if (value > currentMax) {
        current = next;
        currentMax = value;
      }
    }
    yield current;
  };
}

export default defineOperator({
  name: "maxBy",
  maxByAsync,
  maxBySync,
  toOne: true,
});
