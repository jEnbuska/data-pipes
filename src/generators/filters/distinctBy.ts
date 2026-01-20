import { createResolver } from "../../commands/$await.ts";
import { $next } from "../../commands/$next.ts";
import { defineOperator } from "../../defineOperator.ts";
import type { SyncOperatorResolver } from "../../types.ts";

function distinctBySync<TAsync extends boolean, TIn, TSelect>(
  toAwaited: TAsync,
  selector: (next: TIn) => TSelect,
): SyncOperatorResolver<TIn> {
  const resolve = createResolver<TAsync>(toAwaited);
  return function* distinctBySyncResolver() {
    const set = new Set<TSelect>();
    while (true) {
      const value = yield* $next<TIn>();
      const key = yield* resolve(selector, value);
      if (set.has(key)) continue;
      set.add(key);
      yield value;
    }
  };
}

export default defineOperator({
  name: "distinctBy",
  distinctBySync,
  distinctByAsync,
});
