import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function flatSync<TInput, const Depth extends number = 1>(
  provider: YieldedSyncProvider<TInput>,
  depth?: Depth,
): YieldedSyncProvider<FlatArray<TInput[], Depth>> {
  return function* flatSyncGenerator(signal) {
    depth = depth ?? (1 as Depth);
    using generator = _internalY.getDisposableGenerator(provider, signal);
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
  provider: YieldedAsyncProvider<TInput>,
  depth?: Depth,
): YieldedAsyncProvider<Awaited<FlatArray<TInput[], Depth>>> {
  return async function* flatGenerator(signal) {
    depth = depth ?? (1 as Depth);
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
