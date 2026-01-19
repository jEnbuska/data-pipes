import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function skipLastSync<TArgs extends any[], TIn>(
  count: number,
): SyncOperatorResolver<TArgs, TIn> {
  return function* skipLastSyncResolver(...args) {
    using generator = startGenerator(...args);
    const buffer: TIn[] = [];
    let skipped = 0;
    for (const value of generator) {
      buffer.push(value);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift() as TIn;
    }
  };
}

export function skipLastAsync<TArgs extends any[], TIn>(
  count: number,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* skipLastAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const buffer: TIn[] = [];
    let skipped = 0;
    for await (const value of generator) {
      buffer.push(value);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift() as TIn;
    }
  };
}

export default defineOperator({
  name: "skipLast",
  toMaybe: true,
  skipLastSync,
  skipLastAsync,
});
