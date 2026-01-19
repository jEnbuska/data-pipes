import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function tapSync<TArgs extends any[], TIn>(
  consumer: (next: TIn) => unknown,
): SyncOperatorResolver<TArgs, TIn, TIn> {
  return function* tapSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function tapAsync<TArgs extends any[], TIn>(
  consumer: (next: TIn) => unknown,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* tapAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export default defineOperator({
  name: "tap",
  tapAsync,
  tapSync,
});
