import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
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
    ) => ICallbackReturn<TOut, TAsync>,
    initialValue: TAsync extends true ? Promise<TOut> | TOut : TOut,
  ): ReturnValue<TOut, TAsync>;
  reduce(
    reducer: (acc: T, next: T, index: number) => ICallbackReturn<T, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}

export async function reduceAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  reducer: (acc: T, next: T, index: number) => IPromiseOrNot<T>,
): Promise<T>;
export async function reduceAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  reducer: (acc: TOut, next: T, index: number) => IPromiseOrNot<TOut>,
  initialValue: IPromiseOrNot<TOut>,
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

export async function reduceParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  reducer: (acc: T, next: T, index: number) => IPromiseOrNot<T>,
): Promise<T>;
export async function reduceParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  reducer: (acc: TOut, next: T, index: number) => IPromiseOrNot<TOut>,
  initialValue: IPromiseOrNot<TOut>,
): Promise<TOut>;
export async function reduceParallel(
  generator: IYieldedParallelGenerator,
  reducer: (acc: unknown, next: unknown, index: number) => unknown,
  ...rest: [unknown] | []
): Promise<unknown> {
  const { promise, resolve } = Promise.withResolvers<unknown>();

  let acc = Promise.resolve<unknown>(undefined);
  let hasAcc = Boolean(rest.length);
  if (hasAcc) acc = Promise.resolve(rest[0]);

  let index = 0;
  let pending = Promise.resolve<unknown>(undefined);
  async function reduceNext(this: Promise<unknown>) {
    if (hasAcc) return reducer(await acc, await this, index++);
    acc = Promise.resolve(this);
    hasAcc = true;
  }
  async function onDone() {
    await pending;
    resolve(acc);
  }

  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    pending = pending.then(reduceNext.bind(next.value));
    void generator.next().then(onNext);
  });
  return promise;
}
