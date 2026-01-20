import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorGenerator,
  SyncOperatorResolver,
} from "../../types.ts";

export function createReducer<TIn, TNext>(
  reducer: (acc: TNext, next: TIn, index: number) => TNext,
  initialValue: TNext,
) {
  let index = 0;
  let acc = initialValue;
  return {
    acc,
    reduce(next: TIn): TNext {
      acc = reducer(acc, next, index++);
      return acc;
    },
  };
}

export function reduce<TArgs extends any[], TIn, TNext>(
  reducer: (acc: TNext, next: TIn, index: number) => TNext,
  initialValue: TNext,
): SyncOperatorResolver<TArgs, TIn, TNext> {
  return function* reduceSyncResolver(generator: SyncOperatorGenerator<TIn>) {
    generator.drop(2);
    using generator = startGenerator(...args);
    let { acc, reduce } = createReducer(reducer, initialValue);
    for (const next of generator) {
      acc = reduce(next);
    }
    yield acc;
  };
}

export function reduceAsync<TArgs extends any[], TIn, TNext>(
  reducer: (acc: TNext, next: TIn, index: number) => TNext,
  initialValue: TNext,
): AsyncOperatorResolver<TArgs, TIn, TNext> {
  return async function* reduceAsyncResolver(...args) {
    using generator = startGenerator(...args);
    let { acc, reduce } = createReducer(reducer, initialValue);
    for await (const next of generator) {
      acc = reduce(next);
    }
    yield acc;
  };
}

export default defineOperator({
  name: "reduce",
  reduceAsync,
  reduceSync,
  toOne: true,
});
