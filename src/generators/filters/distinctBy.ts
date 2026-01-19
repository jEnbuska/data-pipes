import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

function distinctBySync<TArgs extends any[], TIn, TSelect>(
  selector: (next: TIn) => TSelect,
): SyncOperatorResolver<TArgs, TIn> {
  return function* distinctBySyncResolver(...args) {
    using generator = startGenerator(...args);
    const set = new Set<TSelect>();
    for (const value of generator) {
      const key = selector(value);
      if (set.has(key)) continue;
      set.add(key);
      yield value;
    }
  };
}
function distinctByAsync<TArgs extends any[], TIn, TSelect>(
  selector: (next: TIn) => Promise<TSelect> | TSelect,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* distinctBySyncResolver(...args) {
    using generator = startGenerator(...args);
    const set = new Set<TSelect>();
    for await (const value of generator) {
      const key = await selector(value);
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
