import type { IYieldedIterable } from "../../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { withIndex1 } from "../../utils.ts";
import { createParallel } from "../createParallel.ts";

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
      readonly TOut[] | IYieldedIterable<TOut, TAsync> | TOut,
      TAsync
    >,
  ): INextYielded<TOut, TAsync>;
}

export function* flatMapSync<T, TOut>(
  generator: IYieldedIterator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => readonly TOut[] | IYieldedIterable<TOut, false> | TOut,
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
  ) => IPromiseOrNot<readonly TOut[] | IYieldedIterable<TOut, true> | TOut>,
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
  parallel: number,
  flatMapper: (
    next: T,
    index: number,
  ) => IPromiseOrNot<readonly TOut[] | IYieldedIterable<TOut, true> | TOut>,
): IYieldedParallelGenerator<TOut> {
  const callback = withIndex1(flatMapper);
  return createParallel<T, TOut>({
    generator,
    parallel,
    async onNext(next) {
      return { YIELD_FLAT: await next.then(callback) };
    },
  });
}
