import type { YieldedAsyncGenerator, YieldedIterator } from "../types.ts";

export function* flatSync<T, const Depth extends number = 1>(
  generator: YieldedIterator<T>,
  depth?: Depth,
): YieldedIterator<FlatArray<T[], Depth>> {
  depth = depth ?? (1 as Depth);
  for (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}

export async function* flatAsync<T, const Depth extends number = 1>(
  generator: YieldedAsyncGenerator<T>,
  depth?: Depth,
): YieldedAsyncGenerator<FlatArray<T[], Depth>> {
  depth = depth ?? (1 as Depth);
  for await (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}
