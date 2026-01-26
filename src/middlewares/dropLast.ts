import type {
  NextYielded,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export interface IYieldedDropLast<T, TAsync extends boolean> {
  /**
   * Drops the last `count` items produced by the generator and yields
   * the remaining items to the next operation in the pipeline.
   *
   * This operator **buffers items internally** until it has collected
   * the specified number of items to drop. Items are then emitted
   * **incrementally** to the next operation as new items arrive, ensuring
   * that the last `count` items are never yielded.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4, 5])
   *   .dropLast(2)
   *   .toArray() satisfies number[] // [1, 2, 3]
   * ```
   * ```ts
   * const storeStep: string[] = [];
   * Yielded.from(['A', 'B', 'C', 'D', 'E'])
   *   .tap(l => storeStep.push(`${l}1`))
   *   .dropLast(2)
   *   .tap(l => storeStep.push(`${l}2`))
   *   .toArray() satisfies string[] // ['A', 'B', 'C']
   * // Steps illustration:
   * // A1  B1  C1
   * // A2          D1
   * //     B2          E1
   * //         C2
   * ```
   */
  dropLast(count: number): NextYielded<T, TAsync>;
}

export function* dropLastSync<T>(
  generator: YieldedIterator<T>,
  count: number,
): YieldedIterator<T> {
  const buffer: T[] = [];
  let skipped = 0;
  for (const next of generator) {
    buffer.push(next);
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield buffer.shift()!;
  }
}

export async function* dropLastAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  count: number,
): YieldedAsyncGenerator<T> {
  const buffer: T[] = [];
  let skipped = 0;
  for await (const next of generator) {
    buffer.push(next);
    if (skipped < count) {
      skipped++;
      continue;
    }
    yield buffer.shift()!;
  }
}
