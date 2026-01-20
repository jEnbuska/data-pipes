import { createResolver } from "../../commands/$await.ts";
import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";
import type { SyncOperatorResolver } from "../../types.ts";

export function filter<TAsync extends boolean, TIn, TNext extends TIn = TIn>(
  toAwaited: TAsync,
  predicate: (next: TIn) => next is TNext,
): SyncOperatorResolver<TIn, TNext>;
export function filter<TAsync extends boolean, TIn>(
  toAwaited: TAsync,
  predicate: (next: TIn) => any,
): SyncOperatorResolver<TIn>;
export function filter(
  toAwaited: boolean,
  predicate: (next: unknown) => unknown,
): SyncOperatorResolver<unknown[], unknown, unknown> {
  const resolve = createResolver(toAwaited);
  return function* filterSyncResolver() {
    while (true) {
      const value = yield* $next<unknown>();
      if (yield* resolve(predicate, value)) yield value;
    }
  };
}

export default defineOperator({
  name: "filter",
  toMaybe: undefined,
  operator: filter,
});
