import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function skipSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* skipSyncResolver(...args) {
    using generator = startGenerator(...args);
    let skipped = 0;
    for (const next of generator) {
      if (skipped >= count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync<TArgs extends any[], TIn>(
  count: number,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* skipAsyncResolver(...args) {
    using generator = startGenerator(...args);
    let skipped = 0;
    for await (const next of generator) {
      if (skipped >= count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}

export default defineOperator({
  name: "skip",
  toMaybe: true,
  skipSync,
  skipAsync,
});
