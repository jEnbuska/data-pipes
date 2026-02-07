import type { IMaybeAsync, IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedSyncGenerator } from "../../generators/sync/types.ts";
import type { ICallbackReturn } from "../../generators/types.ts";
import { type ParallelGeneratorCallbackArgs } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";
import { maxByAsync, maxByParallel, maxBySync } from "./maxBy.ts";

export interface IYieldedMinBy<T, TFlow extends IYieldedFlow> {
  /**
   * Returns the item produced by the generator for which the selector
   * returns the **the lowest numeric value**.
   *
   * Iterates through all items, applying the `selector` to each one and
   * keeping the item with the minimum returned number. If the generator
   * produces no items, `undefined` is returned.
   *
   * @example
   * ```ts
   * Yielded.from([2,1,3,4])
   *  .minBy(n => n) satisfies number | undefined // 1
   * ```
   * ```ts
   * Yielded.from([] as number[])
   *  .minBy(n => n) satisfies number | undefined // undefined
   *  ```
   *  ```ts
   * Yielded.from(people)
   *  .minBy(p => p.age) satisfies Person | undefined // Returns the youngest person
   *  ```
   */
  minBy(
    selector: (next: T, index: number) => ICallbackReturn<number, TFlow>,
  ): IResolverReturn<T | undefined, TFlow>;
}

export function minBySync<T>(
  generator: IYieldedSyncGenerator<T>,
  callback: (next: T, index: number) => number,
): T | undefined {
  return maxBySync(generator, (...args) => -callback(...args));
}

export async function minByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  callback: (next: T, index: number) => IMaybeAsync<number>,
): Promise<T | undefined> {
  return maxByAsync(generator, async (...args) => {
    const numb = await callback(...args);
    return -numb;
  });
}

export function minByParallel<T>(
  callback: (next: T, index: number) => IMaybeAsync<number>,
): ParallelGeneratorCallbackArgs<T, T | undefined> {
  return maxByParallel<T>(async (...args) => {
    const numb = await callback(...args);
    return -numb;
  });
}
