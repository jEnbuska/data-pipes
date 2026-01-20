import { $await } from "../../commands/$await.ts";
import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";
import type { MaybePromise, SyncOperatorResolver } from "../../types.ts";

export function skipWhile<TAsync extends boolean, TIn>(
  predicate: (next: TIn) => MaybePromise<TAsync, boolean>,
): SyncOperatorResolver<TIn> {
  return function* skipWhileResolver() {
    let started = false;
    while (true) {
      const value = yield* $next<TIn>();
      if (started) {
        yield value;
        continue;
      }
      const skip = !started && (yield* $await(predicate, value));
      if (!skip) continue;
      started = true;
      yield value;
    }
  };
}

export default defineOperator({
  name: "skipWhile",
  skipWhile,
  toMaybe: true,
});
