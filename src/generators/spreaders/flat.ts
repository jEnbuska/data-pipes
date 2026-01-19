import type {
  AsyncOperatorResolver,
  SyncOperatorResolver,
} from "../../create/createYielded.ts";
import { defineOperator } from "../../create/createYielded.ts";

export function flatSync<
  TArgs extends any[],
  TIn,
  const Depth extends number = 1,
>(depth?: Depth): SyncOperatorResolver<TArgs, TIn, FlatArray<TIn[], Depth>> {
  return function* flatSyncResolver(...args) {
    using generator = useGenerator(...args);
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
    using generator = useGenerator(...args);
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
