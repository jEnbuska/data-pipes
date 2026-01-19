import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

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

export function reduceSync<TArgs extends any[], TIn, TNext>(
  reducer: (acc: TNext, next: TIn, index: number) => TNext,
  initialValue: TNext,
): SyncOperatorResolver<TArgs, TIn, TNext> {
  return function* reduceSyncResolver(...args) {
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
