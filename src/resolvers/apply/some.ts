import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { resolveParallel } from "../resolveParallel.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedSome<T, TAsync extends boolean> {
  /**
   * Determines whether the provided predicate returns a truthy value
   * for **any** item produced by the generator.
   *
   * Iterates through the generator and invokes `predicate` for each item
   * until it returns a truthy value (or a resolved truthy value for async
   * generators). Iteration stops immediately once a match is found.
   *
   * Returns `false` if the generator produces no items or if the predicate
   * never evaluates to a truthy value.
   *
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .some(n => n > 2) satisfies boolean // true
   *  ```
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .some(n => n > 5) satisfies boolean // false
   *  ```
   * ```ts
   * Yielded.from([])
   *  .some(Boolean) satisfies boolean // false
   *  ```
   */
  some(
    predicate: (next: T, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;
}
export async function someAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    // Do not perform predicates, since we might want to stop at any point
    if (await predicate(next, index++)) return true;
  }
  return false;
}

export function someParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  return resolveParallel({
    generator,
    parallel,
    async onNext(value, resolve) {
      const match = await predicate(value, index++);
      if (match) resolve(true);
    },
    onDone(resolve) {
      resolve(false);
    },
  });
}
