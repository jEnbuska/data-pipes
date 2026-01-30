import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { isPlaceholder, memoize, PLACEHOLDER } from "../../utils.ts";
import { resolveParallel } from "../resolveParallel.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedMinBy<T, TAsync extends boolean> {
  /**
   * Returns the item produced by the generator for which the selector
   * returns the **lowest numeric value**.
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
    selector: (next: T) => ICallbackReturn<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}

export function minBySync<T>(
  generator: IYieldedIterator<T>,
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
  callback: (next: T) => IPromiseOrNot<number>,
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
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  callback: (next: T, index: number) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  let acc: { item: T | symbol; value: number | symbol } = {
    item: PLACEHOLDER,
    value: PLACEHOLDER,
  };
  let index = 0;
  const getAccValue = memoize(callback);
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

      if (numb < acc.value) {
        acc = { value: numb, item: value };
      }
    },
    onDone(resolve) {
      if (isPlaceholder(acc.item)) return resolve(undefined);
      resolve(acc.item);
    },
  });
}
