import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";
import { startGenerator } from "../../startGenerator.ts";

export function flatMapSync<TArgs extends any[], TIn, TNext>(
  flatMapper: (next: TIn) => TNext | readonly TNext[],
): SyncOperatorResolver<TArgs, TIn, TNext> {
  return function* flatMapSyncResolver(...args) {
    using generator = startGenerator(...args);
    for (const next of generator) {
      const out = flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as any;
      } else {
        yield out as TNext;
      }
    }
  };
}

export function flatMapAsync<TArgs extends any[], TIn, TNext>(
  flatMapper: (
    next: TIn,
  ) => TNext | readonly TNext[] | Promise<TNext | readonly TNext[]>,
): AsyncOperatorResolver<TArgs, TIn, TNext> {
  return async function* flatMapAsyncResolver(...args) {
    using generator = startGenerator(...args);
    for await (const next of generator) {
      const out = await flatMapper(next);
      if (Array.isArray(out)) {
        yield* out as TNext[];
      } else {
        yield out as TNext;
      }
    }
  };
}

export default defineOperator({
  name: "flatMap",
  flatMapAsync,
  flatMapSync,
  toMany: true,
  toMaybe: true,
});
