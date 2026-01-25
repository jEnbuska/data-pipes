import type { YieldedAsyncGenerator, YieldedIterator } from "../../types.ts";

export function* flatSync<TInput, const Depth extends number = 1>(
  generator: YieldedIterator<TInput>,
  depth?: Depth,
): YieldedIterator<FlatArray<TInput[], Depth>> {
  depth = depth ?? (1 as Depth);
  for (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}

export async function* flatAsync<TInput, const Depth extends number = 1>(
  generator: YieldedAsyncGenerator<TInput>,
  depth?: Depth,
): YieldedAsyncGenerator<FlatArray<TInput[], Depth>> {
  depth = depth ?? (1 as Depth);
  for await (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}
