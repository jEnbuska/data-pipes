import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedParallelGenerator,
} from "../../shared.types";
import { withIndex1 } from "../../utils/withIndex.ts";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedFilter<T, TFlow extends IYieldedFlow> {
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields only the items that pass the predicate to the next operation.
   *
   * **Overloads:**
   *
   * @example
   * ```ts
   * // Type-narrowing predicate
   * Yielded.from([1, 2, 3, "A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .toArray() satisfies number[] // [1, 2, 3]
   * ```
   * ```ts
   * // General predicate
   * Yielded.from([1, 2, 3])
   *   .filter(n => n % 2)
   *   .toArray() satisfies number[] // [1, 3]
   * ```
   */

  filter<TOut extends T>(
    predicate: (next: T, index: number) => next is TOut,
  ): INextYielded<TOut, TFlow>;
  filter(
    predicate: (next: T, index: number) => ICallbackReturn<unknown, TFlow>,
  ): INextYielded<T, TFlow>;
}

export function filterAsync<T, TOut extends T = T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T, index: number) => next is TOut,
): IYieldedAsyncGenerator<TOut>;
export function filterAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T, index: number) => unknown,
): IYieldedAsyncGenerator<T>;
export async function* filterAsync(
  generator: IYieldedAsyncGenerator,
  predicate: (next: unknown, index: number) => unknown,
): IYieldedAsyncGenerator {
  let index = 0;
  for await (const next of generator) {
    if (await predicate(next, index++)) yield next;
  }
}

export function filterParallel<T, TOut extends T = T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (next: T) => next is TOut,
): IYieldedParallelGenerator<TOut>;
export function filterParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (next: T) => unknown,
): IYieldedParallelGenerator<T>;
export function filterParallel(
  generator: IYieldedParallelGenerator,
  parallel: number,
  predicate: (next: unknown) => unknown,
): IYieldedParallelGenerator<unknown> {
  const callback = withIndex1(predicate);
  return ParallelGenerator.create<unknown>({
    generator,
    parallel,
    async onNext(next) {
      const match = await callback(next);
      if (!match) return;
      return [next];
    },
  });
}
