import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { createExtendPromise } from "./parallel.utils.ts";

export interface IYieldedToReversed<T, TAsync extends boolean> {
  /**
   * Returns the items produced by the generator in reverse order
   * as a new array.
   *
   * Items are inserted into the result incrementally as they are
   * produced by the generator, so the reversal happens **one item
   * at a time** rather than by collecting all items first and
   * reversing afterwards.
   *
   * The generator is fully consumed before the final array is returned.
   * @example
   * ```ts
   * Yielded.from([1,2,3])
   *   .toReversed() satisfies number[] // [3,2,1]
   * ```
   **/
  toReversed(): ReturnValue<T[], TAsync>;
}

export function toReversedSync<T>(generator: IYieldedIterator<T>): T[] {
  const arr: T[] = [];
  for (const next of generator) {
    arr.unshift(next);
  }
  return arr;
}

export async function toReversedAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const next of generator) {
    arr.unshift(next);
  }
  return arr;
}

export async function toReversedParallel<T>(
  generator: IYieldedParallelGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  const { promise, resolve } = Promise.withResolvers<T[]>();
  const { addPromise, awaitAll } = createExtendPromise();
  async function onDone() {
    await awaitAll();
    resolve(arr);
  }
  const unshift = arr.unshift.bind(arr);
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void addPromise(next.value.then(unshift));
    void generator.next().then(onNext);
  });
  return promise;
}
