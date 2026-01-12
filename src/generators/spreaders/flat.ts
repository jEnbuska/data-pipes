import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function flat<TInput, const Depth extends number = 1>(
  source: StreamlessProvider<TInput>,
  depth?: Depth,
): StreamlessProvider<FlatArray<TInput[], Depth>> {
  return function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = InternalStreamless.disposable(source);
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
): AsyncStreamlessProvider<FlatArray<TInput[], Depth>> {
  return async function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
