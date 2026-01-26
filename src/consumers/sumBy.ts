import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
} from "../shared.types.ts";

export interface IYieldedSumBy<T, TAsync extends boolean> {
  /**
   * Applies the provided selector to each item produced by the generator
   * and returns the sum of the resulting numeric values.
   *
   * Iterates through all items and accumulates the total by adding the
   * number returned by `fn` for each item. If the generator produces no
   * items, `0` is returned.
   * @example
   * Yielded.from([1,2,3,4,5])
   * .sumBy(n => n) satisfies number | undefined // 15
   *
   * @example
   * Yielded.from([] as number[])
   * .sumBy(n => n) satisfies number | undefined // 0
   */
  sumBy(fn: (next: T) => number): ReturnValue<number, TAsync>;
}

export function sumBySync<T>(
  generator: IYieldedIterator<T>,
  mapper: (next: T) => number,
): number {
  return generator.reduce((acc, next) => mapper(next) + acc, 0);
}

export async function sumByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  mapper: (next: T) => IPromiseOrNot<number>,
): Promise<number> {
  let acc = 0;
  function increment(value: number) {
    acc += value;
  }
  const pending = new Set<Promise<unknown>>();
  for await (const next of generator) {
    // If mapper takes some time, but it does not matter at what order the return value gets incremented
    const promise = Promise.resolve(mapper(next)).then(increment);
    pending.add(promise);
    void promise.then(() => pending.delete(promise));
  }
  await Promise.all(pending.values());
  return acc;
}
