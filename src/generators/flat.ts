import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../types.ts";

/**
 * Returns a new array with all sub-array elements concatenated into it recursively up to the
 * specified depth.
 *
 * @example
 * pipe(
 *  [[1], [2], [3]],
 *  flat()
 * ).toArray() // [1,2,3]
 *
 * @example
 * pipe(
 *  [[1], [[2]], [[[3]]]],
 *  flat(2)
 * ).toArray() // [1,2,[3]]
 * */
export function flat<const Depth extends number = 1, ImperativeTInput = never>(
  depth?: Depth,
) {
  return function* flatGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<FlatArray<TInput[], Depth>> {
    depth = depth ?? (1 as Depth);
    for (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}

export function flatAsync<
  const Depth extends number = 1,
  ImperativeTInput = never,
>(depth?: Depth) {
  return async function* flatGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorProvider<FlatArray<TInput[], Depth>> {
    depth = depth ?? (1 as Depth);
    for await (const next of generator) {
      if (!Array.isArray(next) || depth <= 0) {
        yield next as any;
        continue;
      }
      yield* next.flat(depth - 1) as any;
    }
  };
}
