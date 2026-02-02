import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../../shared.types.ts";
import { throttle } from "../../utils/throttle.ts";
import { createParallel } from "../createParallel.ts";

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
    predicate: (acc: T[], index: number) => ICallbackReturn<boolean, TAsync>,
  ): INextYielded<T[], TAsync>;
}

export function* batchSync<T>(
  generator: IYieldedIterator<T>,
  predicate: (acc: T[], index: number) => boolean,
): IYieldedIterator<T[]> {
  let index = 0;
  let acc: T[] = [];
  for (const next of generator) {
    acc.push(next);
    if (predicate(acc, index++)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export async function* batchAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (batch: T[], index: number) => MaybeAsync<boolean>,
): IYieldedAsyncGenerator<T[]> {
  let index = 0;
  let acc: T[] = [];
  for await (const next of generator) {
    acc.push(next);
    if (await predicate(acc, index++)) continue;
    yield acc;
    acc = [];
  }
  if (acc.length) yield acc;
}

export function batchParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (batch: T[], index: number) => MaybeAsync<boolean>,
): IYieldedParallelGenerator<T[]> {
  let index = 0;
  const lockedPredicate = throttle(1, async (next: Promise<T>) => {
    const value = await next;
    acc.push(value);
    return predicate(acc, index++);
  });
  let acc: T[] = [];
  return createParallel<T, T[]>({
    generator,
    parallel,
    async onNext(next) {
      const match = await lockedPredicate(next);
      if (match) return [];
      const payload = acc;
      acc = [];
      return [payload];
    },
    onDone() {
      if (acc.length) return [acc];
    },
  });
}
