import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type { AsyncOperator, SyncOperator } from "../../types.ts";

export function* everySync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperator<TArgs, TIn, boolean, boolean> {
  yield true;
  return function* everySyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const value of generator) {
      if (!predicate(value)) {
        yield false;
        return;
      }
    }
    yield true;
  };
}

export function* everyAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperator<TArgs, TIn, boolean, boolean> {
  yield true;
  return async function* everyAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const value of generator) {
      if (!(await predicate(value))) {
        yield false;
        return;
      }
    }
    yield true;
  };
}

export default defineOperator({
  name: "every",
  everyAsync,
  everySync,
  toOne: true,
});
