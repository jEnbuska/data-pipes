import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  CallbackReturn,
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../shared.types.ts";

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
    selector: (next: T) => CallbackReturn<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}
export function minBySync<T>(
  generator: YieldedIterator<T>,
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
  generator: YieldedAsyncGenerator<T>,
  callback: (next: T) => PromiseOrNot<number>,
): Promise<T | undefined> {
  const next = await generator.next();
  if (next.done) return;
  let acc = next.value;
  let min = callback(acc);
  const pending = new Set<Promise<unknown> | unknown>([min]);
  for await (const next of generator) {
    // If callback might, possibly take some time to be resolved.
    // We can anyway find the min in any order possible
    const promise = Promise.resolve(callback(next)).then(async (numb) => {
      if (numb < (await min)) {
        acc = next;
        min = numb;
      }
    });
    pending.add(promise);
    void promise.then(() => {
      pending.delete(promise);
    });
  }
  await Promise.all(pending.values());
  return acc;
}
