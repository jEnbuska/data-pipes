import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function countBySync<TArgs extends any[], TIn>(
  mapper: (next: TIn) => number,
): SyncOperatorResolver<TArgs, TIn, number> {
  return function* countyBySyncResolver(...args) {
    using generator = startGenerator(...args);
    let acc = 0;
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TArgs extends any[], TIn>(
  mapper: (next: TIn) => number | Promise<number>,
): AsyncOperatorResolver<TArgs, TIn, number> {
  return async function* countByAsyncResolver(...args) {
    using generator = startGenerator(...args);
    let acc = 0;
    for await (const next of generator) {
      acc += await mapper(next);
    }
    yield acc;
  };
}

export default defineOperator({
  name: "countBy",
  countByAsync,
  countBySync,
  toOne: true,
});
