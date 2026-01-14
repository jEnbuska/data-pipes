import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function flatSync<TInput, const Depth extends number = 1>(
  source: SyncYieldedProvider<TInput>,
  depth?: Depth,
): SyncYieldedProvider<FlatArray<TInput[], Depth>> {
  return function* flatSyncGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = _internalYielded.disposable(source);
    for (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}

export function flatAsync<TInput, const Depth extends number = 1>(
  source: AsyncYieldedProvider<TInput>,
  depth?: Depth,
): AsyncYieldedProvider<Awaited<FlatArray<TInput[], Depth>>> {
  return async function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
