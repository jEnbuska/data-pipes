import { $await } from "../../commands/$await.ts";
import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";
import type { MaybePromise, SyncOperatorResolver } from "../../types.ts";

export function takeWhile<TAsync extends boolean, TArgs extends any[], TIn>(
  predicate: (next: TIn) => MaybePromise<TAsync, boolean>,
): SyncOperatorResolver<TArgs, TIn> {
  return function* takeWhileSyncResolver() {
    while (true) {
      const value = yield* $next<TIn>();
      const done = !(yield* $await(predicate, value));
      if (!done) return;
      yield value;
    }
  };
}

export default defineOperator({
  name: "takeWhile",
  takeWhile,
});
