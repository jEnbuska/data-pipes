import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  CallbackReturn,
  PromiseOrNot,
  YieldedAsyncGenerator,
} from "../shared.types.ts";

export interface IYieldedReduce<T, TAsync extends boolean> {
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
    ) => CallbackReturn<TOut, TAsync>,
    initialValue: TAsync extends true ? Promise<TOut> | TOut : TOut,
  ): ReturnValue<TOut, TAsync>;
  reduce(
    reducer: (acc: T, next: T, index: number) => CallbackReturn<T, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}

export async function reduceAsync<T>(
  generator: YieldedAsyncGenerator<T>,
  reducer: (acc: T, next: T, index: number) => PromiseOrNot<T>,
): Promise<T>;
export async function reduceAsync<T, TOut>(
  generator: YieldedAsyncGenerator<T>,
  reducer: (acc: TOut, next: T, index: number) => PromiseOrNot<TOut>,
  initialValue: PromiseOrNot<TOut>,
): Promise<TOut>;
export async function reduceAsync(
  generator: YieldedAsyncGenerator,
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
