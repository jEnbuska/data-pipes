import type { IYieldedIterableSource } from "../../resolvers/resolver.types";
import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedIterator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../../shared.types";
import {
  asyncIterableProviderToAsyncIterable,
  isAsyncIterableProvider,
  isIterableProvider,
  iterableProviderToIterable,
} from "../../utils/iteration.ts";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedFlatMap<T, TFlow extends IYieldedFlow> {
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
      readonly TOut[] | IYieldedIterableSource<TOut, TFlow> | TOut,
      TFlow
    >,
  ): INextYielded<TOut, TFlow>;
}

export function* flatMapSync<T, TOut>(
  generator: IYieldedIterator<T>,
  callback: (
    next: T,
    index: number,
  ) => readonly TOut[] | IYieldedIterableSource<TOut, "sync"> | TOut,
): IYieldedIterator<TOut> {
  let index = 0;
  for (const next of generator) {
    const out = callback(next, index++);
    if (isIterableProvider<TOut>(out)) {
      yield* iterableProviderToIterable<TOut>(out);
    } else {
      yield out;
    }
  }
}

export async function* flatMapAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  callback: (
    next: T,
    index: number,
  ) => MaybeAsync<
    readonly TOut[] | IYieldedIterableSource<TOut, "async"> | TOut
  >,
): IYieldedAsyncGenerator<TOut> {
  let index = 0;
  for await (const next of generator) {
    const out = await callback(next, index++);
    if (isAsyncIterableProvider<TOut>(out)) {
      const iterable = asyncIterableProviderToAsyncIterable<TOut>(out);
      for await (const item of iterable) {
        yield item;
      }
    } else {
      yield out;
    }
  }
}

export function flatMapParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  callback: (
    next: T,
    index: number,
  ) => MaybeAsync<
    readonly TOut[] | IYieldedIterableSource<TOut, "parallel"> | TOut
  >,
): IYieldedParallelGenerator<TOut> {
  let index = 0;
  return ParallelGenerator.create<T, TOut>({
    generator,
    parallel,
    async onNext(next) {
      const res = await callback(next, index++);
      if (isAsyncIterableProvider<TOut>(res)) return res;
      return [res];
    },
  });
}
