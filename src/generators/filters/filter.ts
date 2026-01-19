import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";
import type { AsyncConsumerGenerator } from "../../types.ts";

export function filterSync<TArgs extends any[], TIn, TNext extends TIn = TIn>(
  predicate: (next: TIn) => next is TNext,
): SyncOperatorResolver<TArgs, TIn, TNext>;
export function filterSync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => any,
): SyncOperatorResolver<TArgs, TIn>;
export function filterSync(
  predicate: (next: unknown) => unknown,
): SyncOperatorResolver<unknown[], unknown, unknown> {
  return function* filterSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export function filterAsync<TArgs extends any[], TIn, TNext extends TIn = TIn>(
  predicate: (next: TIn) => next is TNext,
): AsyncOperatorResolver<TArgs, TIn, TNext>;
export function filterAsync<TArgs extends any[], TIn>(
  predicate: (next: TIn) => any,
): AsyncOperatorResolver<TArgs, TIn>;
export function filterAsync(
  predicate: (next: unknown) => unknown,
): AsyncOperatorResolver<unknown[], unknown, unknown> {
  return async function* filterAsyncResolver(
    provider,
    ...args
  ): AsyncConsumerGenerator<unknown> {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      if (predicate(next)) yield next;
    }
  };
}

export default defineOperator({
  name: "filter",
  toMaybe: undefined,
  filterSync,
  filterAsync,
});
