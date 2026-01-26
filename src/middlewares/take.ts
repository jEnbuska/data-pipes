import type {
  NextYielded,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

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
  take(count: number): NextYielded<T, TAsync>;
}

export function* takeSync<T>(
  generator: YieldedIterator<T>,
  count: number,
): YieldedIterator<T> {
  if (count <= 0) return;
  for (const next of generator) {
    yield next;
    if (!--count) return;
  }
}

export async function* takeAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  if (count <= 0) return;
  for await (const next of generator) {
    yield next;
    if (!--count) return;
  }
}
