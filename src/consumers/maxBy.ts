import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { createExtendPromise } from "./parallel.utils.ts";

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
  callback: (next: T) => number,
): T | undefined {
  const next = generator.next();
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
  callback: (next: T) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  const next = await generator.next();
  if (next.done) return;
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

export async function maxByParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  callback: (next: T, index: number) => IPromiseOrNot<number>,
): Promise<T | undefined> {
  const { promise, resolve } = Promise.withResolvers<T | undefined>();
  let acc: { item: T; value: number } | undefined;
  const { awaitAll, addPromise } = createExtendPromise();
  async function onDone() {
    await awaitAll();
    resolve(acc?.item);
  }
  let index = 0;
  async function handleNext(next: T) {
    const value = await callback(next, index++);
    if (!acc || value > acc.value) {
      acc = { value, item: next };
    }
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void addPromise(next.value.then(handleNext));
    void generator.next().then(onNext);
  });
  return promise;
}
