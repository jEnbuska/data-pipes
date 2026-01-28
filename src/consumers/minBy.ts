import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { isPlaceholder, PLACEHOLDER, withIndex1 } from "../utils.ts";

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

export async function minByParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  getValue: (next: T, index: number) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  const { promise, resolve } = Promise.withResolvers<T | undefined>();
  let acc: { item: T | symbol; value: number | symbol } = {
    item: PLACEHOLDER,
    value: PLACEHOLDER,
  };
  using handler = new ParallelHandler();
  async function onDone() {
    await handler.waitUntilAllResolved();
    if (acc.item === PLACEHOLDER) return resolve(undefined);
    resolve(acc.item as T);
  }
  const callback = withIndex1(getValue);
  async function handleNext(next: T) {
    if (isPlaceholder(acc.item)) {
      acc.item = next;
      return;
    }
    if (isPlaceholder(acc.value)) {
      acc.value = await callback(acc.item);
    }
    const value = await callback(next);

    if (value < acc.value) {
      acc = { value, item: next };
    }
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void handler.register(next.value.then(handleNext));
    void generator.next().then(onNext);
  });
  return await promise;
}
