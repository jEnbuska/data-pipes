import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";

export function mapSync<TArgs extends any[], TIn, TNext>(
  mapper: (next: TIn) => TNext,
): SyncOperatorResolver<TArgs, TIn, TNext> {
  return function* map(provider) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TArgs extends any[], TIn, TNext>(
  mapper: (next: TIn) => TNext,
): AsyncOperatorResolver<TArgs, TIn, TNext> {
  return async function* map(provider) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}

export default defineOperator({
  name: "map",
  mapSync,
  mapAsync,
});
