import { $map } from "commands/$map.ts";
import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type { AsyncOperatorResolver } from "../../types.ts";

export function mapSync<TIn, TOut>(
  toAsync: boolean,
  mapper: (next: TIn) => TOut,
) {
  return function* map() {
    yield* $map<TIn, TOut>(mapper, toAsync);
  };
}

export function mapAsync<TArgs extends any[], TIn, TOut>(
  mapper: (next: TIn) => TOut,
): AsyncOperatorResolver<TArgs, TIn, TOut> {
  return async function* map(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}

export default defineOperator({
  name: "map",
  mapSync,
  mapAsync,
});
