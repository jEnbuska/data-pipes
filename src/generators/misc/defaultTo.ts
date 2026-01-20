import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type { AsyncOperator, SyncOperator } from "../../types.ts";

export function* defaultToSync<TArgs extends any[], TInput, TDefault>(
  getDefault: () => TDefault,
): SyncOperator<TArgs, TInput, TInput, TDefault> {
  yield getDefault();
  return function* syncDefaultToSyncResolver(...args) {
    using generator = startGenerator(...args);
    yield* generator;
  };
}
export function* defaultToAsync<TArgs extends any[], TInput, TDefault>(
  getDefault: () => Promise<TDefault> | TDefault,
): AsyncOperator<TArgs, TInput, TInput, TDefault | Promise<TDefault>> {
  yield getDefault();
  return async function* asyncDefaultToAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const next = await generator.next();
    if (next.done) {
      yield getDefault();
      return;
    }
    yield next.value;
    for await (const value of generator) {
      yield value;
    }
  };
}

export default defineOperator({
  name: "defaultTo",
  toSome: true,
  defaultToAsync,
  defaultToSync,
});
