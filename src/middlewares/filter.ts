import type {
  ICallbackReturn,
  INextYielded,
  IYieldedAsyncGenerator,
} from "../shared.types.ts";

interface IYieldedFilter<T, TAsync extends boolean> {
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
    predicate: (next: T) => next is TOut,
  ): INextYielded<TOut, TAsync>;
  filter(
    predicate: (next: T) => ICallbackReturn<unknown, TAsync>,
  ): INextYielded<T, TAsync>;
}

export default IYieldedFilter;

export function filterAsync<T, TOut extends T = T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T) => next is TOut,
): IYieldedAsyncGenerator<TOut>;
export function filterAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T) => unknown,
): IYieldedAsyncGenerator<T>;
export async function* filterAsync(
  generator: IYieldedAsyncGenerator,
  predicate: (next: unknown) => unknown,
): IYieldedAsyncGenerator {
  for await (const next of generator) {
    if (await predicate(next)) yield next;
  }
}
