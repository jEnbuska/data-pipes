import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";
import { withIndex1 } from "../utils.ts";

export interface IYieldedFlatMap<T, TAsync extends boolean> {
  /**
   * Maps each item produced by the generator using the provided mapper function
   * and flattens the result one level before yielding items to the next operation.
   *
   * The mapper may return:
   * - a single item (`TOut`)
   * - an array of items (`readonly TOut[]`)
   * - any iterable of items (`Iterable<TOut>)`)
   *
   * This allows combining the accepted outputs of both `Array.flatMap` and
   * `Iterable.flatMap` into a single operator.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .flatMap(n => [n, n * 2])
   *   .toArray() satisfies number[] // [1, 2, 2, 4, 3, 6]
   * ```
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .flatMap(n => n % 2 ? new Set([n, n*10]) : n)
   *   .toArray() satisfies number[] // [1, 10, 2, 3, 30]
   * ```
   */
  flatMap<TOut>(
    mapper: (
      next: T,
      index: number,
    ) => ICallbackReturn<
      readonly TOut[] | Iterator<TOut> | Iterable<TOut> | TOut,
      TAsync
    >,
  ): INextYielded<TOut, TAsync>;
}

export function* flatMapSync<T, TOut>(
  generator: IYieldedIterator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => readonly TOut[] | Iterator<TOut> | Iterable<TOut> | TOut,
): IYieldedIterator<TOut> {
  const callback = withIndex1(flatMapper);
  for (const next of generator) {
    const out: any = callback(next);
    if (out?.[Symbol.iterator]) {
      yield* out as TOut[];
    } else {
      yield out as TOut;
    }
  }
}

export async function* flatMapAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => IPromiseOrNot<readonly TOut[] | Iterator<TOut> | Iterable<TOut> | TOut>,
): IYieldedAsyncGenerator<TOut> {
  const callback = withIndex1(flatMapper);
  for await (const next of generator) {
    const out: any = await callback(next);
    if (out?.[Symbol.iterator]) {
      yield* out as TOut[];
    } else {
      yield out as TOut;
    }
  }
}

export function flatMapParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => IPromiseOrNot<readonly TOut[] | Iterator<TOut> | Iterable<TOut> | TOut>,
): IYieldedParallelGeneratorOnNext<TOut> {
  const callback = withIndex1(flatMapper);
  const buffer: TOut[] = [];

  return async (wrap) => {
    if (buffer.length) return wrap(Promise.resolve(buffer.shift()!));
    let next = await generator.next();
    if (next.done) return;

    while (!next.done) {
      const value: any = await callback(await next.value);
      if (!value?.[Symbol.iterator]) {
        return wrap(Promise.resolve(value as TOut));
      }
      void buffer.concat([...value]);
      if (buffer.length) return wrap(Promise.resolve(buffer.shift()!));
      next = await generator.next();
    }
    return wrap(Promise.resolve(buffer.shift()!));
  };
}
