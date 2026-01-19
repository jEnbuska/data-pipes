import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function defaultToSync<TArgs extends any[], TInput, TDefault>(
  getDefault: () => TDefault,
): SyncOperatorResolver<TArgs, TInput, TInput | TDefault> {
  return function* syncDefaultToSyncResolver(...args) {
    using generator = startGenerator(...args);
    const next = generator.next();
    if (next.done) return yield getDefault();
    yield next.value;
    for (const value of generator) {
      yield value;
    }
  };
}
export function defaultToAsync<TArgs extends any[], TInput, TDefault>(
  getDefault: () => Promise<TDefault> | TDefault,
): AsyncOperatorResolver<TArgs, TInput, TInput | TDefault> {
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
  defaultToAsync,
  defaultToSync,
});
