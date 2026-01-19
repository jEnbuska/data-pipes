import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function skipWhileSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean,
): SyncOperatorResolver<TArgs, TIn> {
  return function* skipWhileSyncResolver(...args) {
    using generator = startGenerator(...args);
    let skip = true;
    for (const value of generator) {
      if (skip && predicate(value)) continue;
      skip = false;
      yield value;
    }
  };
}

export function skipWhileAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => boolean | Promise<boolean>,
): AsyncOperatorResolver<TArgs, TIn> {
  return async function* skipWhileAsyncResolver(...args) {
    using generator = startGenerator(...args);
    let skip = true;
    for await (const value of generator) {
      if (skip && (await predicate(value))) continue;
      skip = false;
      yield value;
    }
  };
}

export default defineOperator({
  name: "skipWhile",
  skipWhileSync,
  skipWhileAsync,
  toMaybe: true,
});
