import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function minBySync<TArgs extends any[], TIn>(
  callback: (next: TIn) => number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* minSyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = generator.next();
    if (initial.done) return;
    let currentMin = callback(initial.value);
    let current = initial.value;
    for (const next of generator) {
      const value = callback(next);
      if (value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    yield current;
  };
}

export function minByAsync<TArgs extends any[], TIn>(
  callback: (next: TIn) => number | Promise<number>,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* minAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = await generator.next();
    if (initial.done) return;
    let currentMin = await callback(initial.value);
    let current = initial.value;
    for await (const next of generator) {
      const value = await callback(next);
      if (value < currentMin) {
        current = next;
        currentMin = value;
      }
    }
    yield current;
  };
}

export default defineOperator({
  name: "minBy",
  minByAsync,
  minBySync,
  toOne: true,
});
