import type { IMaybeAsync, IYieldedFlow } from "../../general/types.ts";
import { throttle } from "../../general/utils/parallel.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedParallelGenerator } from "../../generators/parallel/types.ts";
import type { ICallbackReturn } from "../../generators/types.ts";
import { ParallelGeneratorResolver } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";

export interface IYieldedReduce<T, TFlow extends IYieldedFlow> {
  /**
   * Reduces the items produced by the generator into a single value.
   *
   * Iterates through all items in the generator, passing each item and
   * the accumulated result to the provided `reducer` function. The value
   * returned by the reducer becomes the accumulator for the next iteration.
   *
   * There are two modes:
   *
   * 1. **With `initialValue`**
   *    The accumulator is initialized to the provided `initialValue`. This
   *    overload always returns a resolved value of type `TOut`.
   *
   * 2. **Without `initialValue`**
   *    The first item of the generator is used as the initial accumulator.
   *    If the generator is empty, the result is `undefined`.
   *
   * @example
   * ```ts
   * // With `initialValue`
   * Yielded.from([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 15
   *   ```
   * ```ts
   * // Without `initialValue`
   * Yielded.from([1,2,4,3])
   *   .reduce((acc, next) => acc < next ? next : acc) satisfies undefined | number // 4
   *   ```
   * ```ts
   * // With `initialValue`
   * Yielded.from([] as number[])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 0
   * ```
   */
  reduce<TOut>(
    reducer: (
      acc: TOut,
      next: T,
      index: number,
    ) => ICallbackReturn<TOut, TFlow>,
    initialValue: TFlow extends "sync" ? TOut : Promise<TOut> | TOut,
  ): IResolverReturn<TOut, TFlow>;
  reduce(
    reducer: (acc: T, next: T, index: number) => ICallbackReturn<T, TFlow>,
  ): IResolverReturn<T | undefined, TFlow>;
}

export async function reduceAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  reducer: (acc: T, next: T, index: number) => IMaybeAsync<T>,
): Promise<T>;
export async function reduceAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  reducer: (acc: TOut, next: T, index: number) => IMaybeAsync<TOut>,
  initialValue: IMaybeAsync<TOut>,
): Promise<TOut>;
export async function reduceAsync(
  generator: IYieldedAsyncGenerator,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [unknown] | []
): Promise<unknown> {
  let acc: Promise<unknown>;
  if (rest.length) {
    acc = Promise.resolve(rest[0]);
  } else {
    const first = await generator.next();
    if (first.done) return undefined;
    acc = Promise.resolve(first.value);
  }
  let index = 0;
  for await (const next of generator) {
    acc = acc.then((acc) => reducer(acc, next, index++));
  }
  return acc;
}

export function reduceParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  reducer: (acc: T, next: T, index: number) => IMaybeAsync<T>,
): Promise<T>;
export function reduceParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  reducer: (acc: TOut, next: T, index: number) => IMaybeAsync<TOut>,
  initialValue: IMaybeAsync<TOut>,
): Promise<TOut>;
export function reduceParallel(
  generator: IYieldedParallelGenerator,
  parallel: number,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [unknown] | []
): Promise<unknown> {
  let acc: undefined | Promise<unknown> | unknown;
  let hasAcc = !!rest.length;
  if (hasAcc) acc = Promise.resolve(rest[0]);
  let index = 0;
  return ParallelGeneratorResolver.run({
    generator,
    parallel,
    onNext: throttle(1, async function onNext(value) {
      if (!hasAcc) {
        acc = value;
        hasAcc = true;
        return;
      }
      acc = await reducer(await acc, value, index++);
    }),
    async onDone(resolve) {
      resolve(acc);
    },
  });
}
