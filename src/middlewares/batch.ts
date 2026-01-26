import type {
  CallbackReturn,
  NextYielded,
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

export interface IYieldedBatch<T, TAsync extends boolean> {
  /**
   * Groups items produced by the generator into batches according to the
   * provided predicate, then feeds each batch as an array to the next
   * operation in the pipeline.
   *
   * The predicate receives the current batch (accumulator) and should return
   * `true` to continue adding items to the current batch, or `false` to
   * close the current batch and start a new one.
   *
   * Supports both synchronous and asynchronous generators. When `TAsync`
   * is `true`, the predicate may return a `Promise<boolean>`, and the
   * batching will correctly handle async evaluations.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4, 5])
   *   .batch(acc => acc.length < 3)
   *   .toArray() satisfies number[][] // [[1, 2, 3], [4, 5]]
   * ```
   *
   * @example
   * ```ts
   * Yielded.from([] as number[])
   *   .batch(acc => acc.length < 3)
   *   .toArray() satisfies number[][] // []
   * ```
   */
  batch(
    predicate: (acc: T[]) => CallbackReturn<boolean, TAsync>,
  ): NextYielded<T[], TAsync>;
}

export function* batchSync<T>(
  generator: YieldedIterator<T>,
  predicate: (acc: T[]) => boolean,
): YieldedIterator<T[]> {
  let acc: T[] = [];
  for (const next of generator) {
    acc.push(next);
    if (predicate(acc)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export async function* batchAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  predicate: (batch: T[]) => PromiseOrNot<boolean>,
): YieldedAsyncGenerator<T[]> {
  let acc: T[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (await predicate(acc)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}
