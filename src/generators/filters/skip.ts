import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import {
  AsyncOperatorGenerator,
  AsyncOperatorResolver,
  SyncOperatorGenerator,
  SyncOperatorResolver,
} from "../../types.ts";

export function skipSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn, TIn> {
  return function* skipSyncResolver(generator: AsyncOperatorGenerator<TIn>) {
    generator.
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
