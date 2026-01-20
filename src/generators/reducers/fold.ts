import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function foldSync<TArgs extends any[], TIn>(
  fold: (previous: TIn, next: TIn, index: number) => TIn,
): SyncOperatorResolver<TArgs, TIn> {
  return function* foldSyncResolver(...args) {
    using generator = startGenerator(...args);
    const initial = generator.next();
    let acc: TIn;
    if (initial.done) {
      return;
    }
    acc = initial.value;
    let index = 0;
    for (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}

export function foldAsync<TArgs extends any[], TIn>(
  fold: (previous: TIn, next: TIn, index: number) => Promise<TIn> | TIn,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* foldGenerator(...args) {
    using generator = startGenerator(...args);
    const initial = await generator.next();
    let acc: TIn;
    if (initial.done) {
      return;
    }
    acc = initial.value;
    let index = 0;
    for await (const next of generator) {
      acc = await fold(acc, next, index++);
    }
    yield acc;
  };
}

export default defineOperator({
  name: "fold",
  foldAsync,
  foldSync,
});
