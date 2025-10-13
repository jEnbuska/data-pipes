import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function flat<TInput, const Depth extends number = 1>(
  source: PipeSource<TInput>,
  depth?: Depth,
): PipeSource<FlatArray<TInput[], Depth>> {
  return function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = disposable(source);
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
  source: AsyncPipeSource<TInput>,
  depth?: Depth,
): AsyncPipeSource<FlatArray<TInput[], Depth>> {
  return async function* flatGenerator() {
    depth = depth ?? (1 as Depth);
    using generator = disposable(source);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
