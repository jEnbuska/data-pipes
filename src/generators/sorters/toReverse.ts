import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function toReverseSync<TArgs extends any[], TIn>(): SyncOperatorResolver<
  TArgs,
  TIn
> {
  return function* reverseSyncResolver(...args) {
    using generator = startGenerator(...args);
    const acc: TIn[] = [];
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}

export function toReverseAsync<
  TArgs extends any[],
  TIn,
>(): AsyncOperatorResolver<TArgs, TIn> {
  return async function* reverseAsyncResolver(...args) {
    using generator = startGenerator(...args);
    const acc: TIn[] = [];
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}

export default defineOperator({
  name: "toReverse",
  toReverseSync,
  toReverseAsync,
});
