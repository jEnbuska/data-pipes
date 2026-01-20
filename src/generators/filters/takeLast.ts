import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function takeLastSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* takeLastSyncResolver(...args) {
    using generator = startGenerator(...args);
    const array = [...generator];
    const list = array.slice(Math.max(array.length - count, 0));
    yield* list;
  };
}

export function* takeLastAsync<TArgs extends any[], TIn>(
  count: number,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* takeLastAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const acc: TIn[] = [];
    for await (const next of generator) {
      acc.push(next);
    }
    const list = acc.slice(Math.max(acc.length - count, 0));
    yield* list;
  };
}

export default defineOperator({
  name: "takeLast",
  takeLastSync,
  takeLastAsync,
});
