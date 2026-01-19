import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function everySync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn, boolean> {
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

export function everyAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperatorResolver<TArgs, TIn, boolean> {
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
