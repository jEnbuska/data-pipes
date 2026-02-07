import type { IMaybeAsync, IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedParallelGenerator } from "../../generators/parallel/types.ts";
import type { IYieldedSyncGenerator } from "../../generators/sync/types.ts";
import type { ICallbackReturn } from "../../generators/types.ts";
import { ParallelGeneratorResolver } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";
import { memoize } from "./utils/memoize.ts";
import { getPlaceholder, isPlaceholder } from "./utils/placeholder.ts";

export interface IYieldedMaxBy<T, TFlow extends IYieldedFlow> {
  /**
   * Returns the item produced by the generator for which the selector
   * returns the **the highest numeric value**.
   *
   * Iterates through all items, applying the `selector` to each one and
   * keeping the item with the maximum returned number. If the generator
   * produces no items, `undefined` is returned.
   *
   * @example
   * ```ts
   * Yielded.from([2,1,3,4])
   *  .maxBy(n => n) satisfies number | undefined // 4
   * ```
   * ```ts
   * Yielded.from([] as number[])
   *  .maxBy(n => n) satisfies number | undefined // undefined
   *  ```
   *  ```ts
   * Yielded.from(people)
   *  .maxBy(p => p.age) satisfies Person | undefined // Returns the oldest person
   *  ```
   */
  maxBy(
    selector: (next: T) => ICallbackReturn<number, TFlow>,
  ): IResolverReturn<T | undefined, TFlow>;
}

export function maxBySync<T>(
  generator: IYieldedSyncGenerator<T>,
  callback: (next: T, index: number) => number,
): T | undefined {
  const next = generator.next();
  let index = 0;
  if (next.done) return;
  let current = next.value;
  let currentMax = callback(current, index++);
  for (const next of generator) {
    const value = callback(next, index++);
    if (value > currentMax) {
      current = next;
      currentMax = value;
    }
  }
  return current;
}

export async function maxByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  callback: (next: T, index: number) => IMaybeAsync<number>,
): Promise<T | undefined> {
  const next = await generator.next();
  if (next.done) return;
  let index = 0;
  let acc = next.value;
  let max = await callback(acc, index++);
  for await (const next of generator) {
    const numb = await callback(next, index++);
    if (numb > max) {
      acc = next;
      max = numb;
    }
  }
  return acc;
}

export function maxByParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  callback: (next: T, index: number) => IMaybeAsync<number>,
): Promise<T | undefined> {
  let acc: { item: T | symbol; value: number | symbol } = {
    item: getPlaceholder(),
    value: getPlaceholder(),
  };
  const getAccValue = memoize(callback);
  let index = 0;
  return ParallelGeneratorResolver.run({
    generator,
    parallel,
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
      if (numb > acc.value) {
        acc = { value: numb, item: value };
      }
    },
    onDone(resolve) {
      if (isPlaceholder(acc.item)) return resolve(undefined);
      resolve(acc.item);
    },
  });
}
