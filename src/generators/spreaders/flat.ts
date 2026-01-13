import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function flatSync<TInput, const Depth extends number = 1>(
  source: SyncStreamlessProvider<TInput>,
  depth?: Depth,
): SyncStreamlessProvider<FlatArray<TInput[], Depth>> {
  return function* flatSyncGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = _internalStreamless.disposable(source);
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
  source: AsyncStreamlessProvider<TInput>,
  depth?: Depth,
): AsyncStreamlessProvider<Awaited<FlatArray<TInput[], Depth>>> {
  return async function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
