import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type { IYieldedAsyncGenerator } from "../shared.types.ts";

export interface IYieldedEvery<T, TAsync extends boolean> {
  /**
   * Determines whether the provided predicate returns a truthy value
   * for **all** items produced by the generator.
   *
   * Iterates through the generator and invokes `predicate` for each item
   * until it returns a falsy value (or a resolved falsy value for async
   * generators). Iteration stops immediately once a failure is encountered.
   *
   * Returns `true` if the generator produces no items (vacuous truth),
   * or if the predicate evaluates to a truthy value for every item.
   *
   * @example
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .every(n => n > 1) satisfies boolean // false
   * ```
   * ```ts
   * Yielded.from([])
   *  .every(Boolean) satisfies boolean // true
   *  ```
   *  ```ts
   * Yielded.from([1,2,3,4])
   *  .every(n => n > 0) satisfies boolean // true
   * ```
   */
  every(
    predicate: (next: T, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;
}

export async function everyAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    // Do not perform predicates, since we might want to stop at any point
    if (!(await predicate(next, index++))) return false;
  }
  return true;
}
