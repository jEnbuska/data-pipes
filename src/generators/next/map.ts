import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../../shared.types";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedMap<T, TFlow extends IYieldedFlow> {
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
    mapper: (next: T, index: number) => ICallbackReturn<TOut, TFlow>,
  ): INextYielded<TOut, TFlow>;
}

export async function* mapAsync<T, TOut>(
  generator: IYieldedAsyncGenerator<T>,
  mapper: (next: T, index: number) => MaybeAsync<TOut>,
): IYieldedAsyncGenerator<TOut> {
  let index = 0;
  for await (const next of generator) {
    yield mapper(next, index++);
  }
}

export function mapParallel<T, TOut>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  mapper: (next: T, index: number) => MaybeAsync<TOut>,
): IYieldedParallelGenerator<TOut> {
  let index = 0;
  return ParallelGenerator.create<T, TOut>({
    generator,
    parallel,
    async onNext(next) {
      return [await mapper(next, index++)];
    },
  });
}
