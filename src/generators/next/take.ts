import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { YieldedParallelGenerator } from "../YieldedParallelGenerator.ts";

export interface IYieldedTake<T, TAsync extends boolean> {
  /**
   * Yields only the first `count` items produced by the generator to the
   * next operation in the pipeline, then stops the generator.
   *
   * Once `count` items have been yielded, the generator stops producing
   * further items. Downstream operations continue to receive the items
   * that were yielded.
   *
   * If `count` is greater than the number of items produced, all items
   * are yielded.
   *
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4, 5])
   *   .take(2)
   *   .toArray() satisfies number[] // [1, 2]
   * ```
   * ```ts
   * Yielded.from([1, 2])
   *   .take(5)
   *   .toArray() satisfies number[] // [1, 2]
   * ```
   * ```ts
   * Yielded.from([1, 2, 3, 4, 5])
   *   .take(0)
   *   .toArray() satisfies number[] // []
   * ```
   */
  take(count: number): INextYielded<T, TAsync>;
}

export function* takeSync<T>(
  generator: IYieldedIterator<T>,
  count: number,
): IYieldedIterator<T> {
  if (count <= 0) return;
  for (const next of generator) {
    yield next;
    if (!--count) return;
  }
}

export async function* takeAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  count: number,
): IYieldedAsyncGenerator<T> {
  if (count <= 0) return;
  for await (const next of generator) {
    yield next;
    if (!--count) return;
  }
}

export function takeParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  count: number,
): IYieldedParallelGenerator<T> {
  if (count <= 0) return (async function* () {})();
  return YieldedParallelGenerator.create<T>({
    generator,
    parallel,
    handleNext(next) {
      if (count-- <= 0) {
        return { type: "RETURN" };
      }
      return { type: "YIELD", payload: next };
    },
  });
}
