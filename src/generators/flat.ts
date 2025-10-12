import { type PipeSource, type AsyncPipeSource } from "../types.ts";

export function flat<TInput, const Depth extends number = 1>(
  source: PipeSource<TInput>,
  depth?: Depth,
): PipeSource<FlatArray<TInput[], Depth>> {
  return function* flatGenerator(signal) {
    depth = depth ?? (1 as Depth);
    for (const next of source(signal)) {
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
  return async function* flatGenerator(signal) {
    depth = depth ?? (1 as Depth);
    for await (const next of source(signal)) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
