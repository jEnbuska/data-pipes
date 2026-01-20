import { defineOperator } from "../../defineOperator.ts";
import { startGenerator } from "../../startGenerator.ts";
import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../types.ts";

export function flatSync<
  TArgs extends any[],
  TIn,
  const Depth extends number = 1,
>(depth?: Depth): SyncOperatorResolver<TArgs, TIn, FlatArray<TIn[], Depth>> {
  return function* flatSyncResolver(...args) {
    using generator = startGenerator(...args);
    depth = depth ?? (1 as Depth);
    for (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}

export function flatAsync<
  TArgs extends any[],
  TIn,
  const Depth extends number = 1,
>(depth?: Depth): AsyncOperatorResolver<TArgs, TIn, FlatArray<TIn[], Depth>> {
  return async function* flatGenerator(...args) {
    using generator = startGenerator(...args);
    depth = depth ?? (1 as Depth);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}

export default defineOperator({
  name: "flat",
  flatAsync,
  flatSync,
  toMany: true,
  toMaybe: true,
});
