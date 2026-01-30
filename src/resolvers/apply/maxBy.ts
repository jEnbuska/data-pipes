import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import {
  isPlaceholder,
  memoize,
  PLACEHOLDER,
  withIndex1,
} from "../../utils.ts";
import { resolveParallel } from "../resolveParallel.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedMaxBy<T, TAsync extends boolean> {
  /**
   * Returns the item produced by the generator for which the selector
   * returns the **highest numeric value**.
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
    selector: (next: T) => ICallbackReturn<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}

export function maxBySync<T>(
  generator: IYieldedIterator<T>,
  getValue: (next: T, index: number) => number,
): T | undefined {
  const next = generator.next();
  const callback = withIndex1(getValue);
  if (next.done) return;
  let current = next.value;
  let currentMax = callback(current);
  for (const next of generator) {
    const value = callback(next);
    if (value > currentMax) {
      current = next;
      currentMax = value;
    }
  }
  return current;
}

export async function maxByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  getValue: (next: T, index: number) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  const next = await generator.next();
  if (next.done) return;
  const callback = withIndex1(getValue);
  let acc = next.value;
  let max = await callback(acc);
  for await (const next of generator) {
    const numb = await callback(next);
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
  callback: (next: T, index: number) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  let acc: { item: T | symbol; value: number | symbol } = {
    item: PLACEHOLDER,
    value: PLACEHOLDER,
  };
  const getAccValue = memoize(callback);
  let index = 0;
  return resolveParallel({
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
