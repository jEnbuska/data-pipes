import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
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
   * ```ts
   * Yielded.from([] as number[])
   *   .batch(acc => acc.length < 3)
   *   .toArray() satisfies number[][] // []
   * ```
   */
  batch(
    predicate: (acc: T[]) => ICallbackReturn<boolean, TAsync>,
  ): INextYielded<T[], TAsync>;
}

export function* batchSync<T>(
  generator: IYieldedIterator<T>,
  predicate: (acc: T[]) => boolean,
): IYieldedIterator<T[]> {
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
  generator: IYieldedAsyncGenerator<T>,
  predicate: (batch: T[]) => IPromiseOrNot<boolean>,
): IYieldedAsyncGenerator<T[]> {
  let acc: T[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (await predicate(acc)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export function batchParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  predicate: (batch: T[]) => IPromiseOrNot<boolean>,
): IYieldedParallelGeneratorOnNext<T[]> {
  const acc: T[] = [];
  return async (wrap) => {
    let next = await generator.next();
    while (!next.done) {
      const value = await next.value;
      acc.push(value);
      if (!(await predicate(acc))) break;
      next = await generator.next();
    }
    if (!acc.length) return;
    return wrap(Promise.resolve(acc));
  };
}
