import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { createExtendPromise } from "./parallel.utils.ts";

export interface IYieldedToArray<T, TAsync extends boolean> {
  /**
   * Collects all items produced by the generator and returns them
   * as a new array.
   *
   * The generator is fully consumed before the array is returned.
   * */
  toArray(): ReturnValue<T[], TAsync>;
}

export async function toArrayAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const next of generator) arr.push(next);
  return arr;
}

export async function toArrayParallel<T>(
  generator: IYieldedParallelGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  const { promise, resolve } = Promise.withResolvers<T[]>();
  const push = arr.push.bind(arr);
  const { addPromise, awaitAll } = createExtendPromise();
  async function onDone() {
    await awaitAll();
    resolve(arr);
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void addPromise(next.value.then(push));
    void generator.next().then(onNext);
  });
  return promise;
}
