import {
  type YieldedAsyncMiddleware,
  type YieldedSyncMiddleware,
} from "../../types.ts";

export function flatSync<TInput, const Depth extends number = 1>(
  depth?: Depth,
): YieldedSyncMiddleware<TInput, FlatArray<TInput[], Depth>> {
  return function* flatSyncResolver(generator) {
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

export function flatAsync<TInput, const Depth extends number = 1>(
  depth?: Depth,
): YieldedAsyncMiddleware<TInput, FlatArray<TInput[], Depth>> {
  return async function* flatResolver(generator) {
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
