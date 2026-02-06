import type { IYieldedIterable } from "../../resolvers/resolver.types";
import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedIterator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../../shared.types";
import { withIndex1 } from "../../utils/withIndex.ts";
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
      readonly TOut[] | IYieldedIterable<TOut, TFlow> | TOut,
      TFlow
    >,
  ): INextYielded<TOut, TFlow>;
}

export function* flatMapSync<T, TOut>(
  generator: IYieldedIterator<T>,
  flatMapper: (
    next: T,
    index: number,
  ) => readonly TOut[] | IYieldedIterable<TOut, "sync"> | TOut,
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
  ) => MaybeAsync<readonly TOut[] | IYieldedIterable<TOut, "async"> | TOut>,
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
  ) => MaybeAsync<readonly TOut[] | IYieldedIterable<TOut, "parallel"> | TOut>,
): IYieldedParallelGenerator<TOut> {
  const callback = withIndex1(flatMapper);
  return ParallelGenerator.create<T, TOut>({
    generator,
    parallel,
    async onNext(next) {
      const res = await next.then(callback);
      if (Array.isArray(res)) return res as any; // TODO
      return [res] as any;
    },
  });
}
