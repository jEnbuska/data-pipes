import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
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
): IYieldedParallelGenerator<TOut> {
  let done = false;
  function mapNext(
    result: IteratorResult<Promise<T>, void>,
  ): IteratorResult<Promise<TOut>, void> {
    if (result.done) return { done: true, value: undefined };
    return {
      done: false,
      value: Promise.resolve(result.value).then(mapper),
    };
  }

  return {
    async [Symbol.asyncDispose]() {
      done = true;
    },
    async next(
      ..._: [] | [void]
    ): Promise<IteratorResult<Promise<TOut>, void>> {
      if (done) return { done: true, value: undefined };
      return generator.next().then(mapNext);
    },
    async return(): Promise<IteratorResult<Promise<TOut>, void>> {
      done = true;
      return { done: true, value: undefined };
    },

    async throw(): Promise<IteratorResult<Promise<TOut>, void>> {
      done = true;
      return { done: true, value: undefined };
    },

    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
