import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { YieldedParallelGenerator } from "../YieldedParallelGenerator.ts";

export interface IYieldedFlat<T, TAsync extends boolean> {
  /**
   * Returns a new sequence where all sub-array elements are recursively
   * concatenated into it up to the specified depth.
   *
   * By default, `depth` is `1`, meaning only the first level of nested arrays
   * will be flattened. Supports deeper levels by specifying a `depth`.
   *
   * @example
   * ```ts
   * Yielded.from([[1], [2], [3]])
   *   .flat()
   *   .toArray() satisfies number[] // [1, 2, 3]
   * ```
   * ```ts
   * Yielded.from([[1], [[2]], [[[3]]]])
   *   .flat(2)
   *   .toArray() satisfies Array<number | number[]> // [1, 2, [3]]
   * ```
   * ```ts
   * Yielded.from([1, [2, [3, 4]], 5])
   *   .flat()
   *   .toArray() satisfies Array<number | number[]> // [1, 2, [3, 4], 5]
   * ```
   */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): INextYielded<FlatArray<T[], Depth>, TAsync>;
}

export function* flatSync<T, const Depth extends number = 1>(
  generator: IYieldedIterator<T>,
  depth?: Depth,
): IYieldedIterator<FlatArray<T[], Depth>> {
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
  generator: IYieldedAsyncGenerator<T>,
  depth?: Depth,
): IYieldedAsyncGenerator<FlatArray<T[], Depth>> {
  depth = depth ?? (1 as Depth);
  for await (const next of generator) {
    if (!Array.isArray(next) || depth <= 0) {
      yield next as any;
      continue;
    }
    yield* next.flat(depth - 1) as any;
  }
}

export function flatParallel<T, const Depth extends number = 1>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  depth?: Depth,
): IYieldedParallelGenerator<FlatArray<T[], Depth>> {
  depth = depth ?? (1 as Depth);
  return YieldedParallelGenerator.create<T, FlatArray<T[], Depth>>({
    generator,
    parallel,
    async handleNext(next) {
      const value = await next;
      if (!Array.isArray(value) || depth <= 0) {
        return { type: "YIELD", payload: next as any };
      }
      return { type: "YIELD_ALL", payload: value.flat(depth - 1) as any };
    },
  });
}
