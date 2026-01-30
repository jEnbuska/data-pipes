import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { withIndex1 } from "../../utils.ts";
import { createParallel } from "../createParallel.ts";

export interface IYieldedMap<T, TAsync extends boolean> {
  /**
   * Maps each item produced by the generator using the provided transform
   * function and yields the transformed item to the next operation.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .map(n => n * 2)
   *   .toArray() satisfies number[] // [2, 4, 6]
   * ```
   */
  map<TOut>(
    mapper: (next: T) => ICallbackReturn<TOut, TAsync>,
  ): INextYielded<TOut, TAsync>;
}

export async function* mapAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  mapper: (next: T, index: number) => IPromiseOrNot<TOut>,
): IYieldedAsyncGenerator<TOut> {
  let index = 0;
  for await (const next of generator) {
    yield mapper(next, index++);
  }
}

export function mapParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  mapper: (next: T, index: number) => IPromiseOrNot<TOut>,
): IYieldedParallelGenerator<TOut> {
  const callback = withIndex1(mapper);
  return createParallel<T, TOut>({
    generator,
    parallel,
    onNext(next) {
      return { YIELD: next.then(callback) };
    },
  });
}
