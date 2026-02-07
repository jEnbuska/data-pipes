import type { IMaybeAsync, IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedSyncGenerator } from "../../generators/sync/types.ts";
import type { ICallbackReturn } from "../../generators/types.ts";
import { type ParallelGeneratorCallbackArgs } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";
import { memoize } from "./utils/memoize.ts";
import { getPlaceholder, isPlaceholder } from "./utils/placeholder.ts";

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
    selector: (next: T) => ICallbackReturn<number, TFlow>,
  ): IResolverReturn<T | undefined, TFlow>;
}

export function minBySync<T>(
  generator: IYieldedSyncGenerator<T>,
  callback: (next: T) => number,
): T | undefined {
  const next = generator.next();
  if (next.done) return;
  let current = next.value;
  let currentMin = callback(current);
  for (const next of generator) {
    const value = callback(next);
    if (value < currentMin) {
      current = next;
      currentMin = value;
    }
  }
  return current;
}

export async function minByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  callback: (next: T) => IMaybeAsync<number>,
): Promise<T | undefined> {
  const next = await generator.next();
  if (next.done) return;
  let acc = next.value;
  let min = await callback(acc);
  for await (const next of generator) {
    const numb = await callback(next);
    if (numb < min) {
      acc = next;
      min = numb;
    }
  }
  return acc;
}

export function minByParallel<T>(
  callback: (next: T, index: number) => IMaybeAsync<number>,
): ParallelGeneratorCallbackArgs<T, T | undefined> {
  let acc: { item: T | symbol; value: number | symbol } = {
    item: getPlaceholder(),
    value: getPlaceholder(),
  };
  let index = 0;
  const getAccValue = memoize(callback);
  return {
    async onNext(value) {
      if (isPlaceholder(acc.item)) {
        acc.item = value;
        return;
      }
      if (isPlaceholder(acc.value)) {
        acc.value = await getAccValue(acc.item, 0);
        index++;
      }
      const numb = await callback(value, index++);
      if (numb < acc.value) {
        acc = { value: numb, item: value };
      }
    },
    onDone(resolve) {
      if (isPlaceholder(acc.item)) return resolve(undefined);
      resolve(acc.item);
    },
  };
}
