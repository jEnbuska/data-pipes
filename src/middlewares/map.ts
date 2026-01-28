import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

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
  mapper: (next: T) => IPromiseOrNot<TOut>,
): IYieldedAsyncGenerator<TOut> {
  for await (const next of generator) {
    yield mapper(next);
  }
}

export function mapParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  mapper: (next: T) => IPromiseOrNot<TOut>,
): IYieldedParallelGeneratorOnNext<TOut> {
  return async (wrap) => {
    const next = await generator.next();
    if (next.done) return;
    return wrap(next.value.then(mapper));
  };
}
