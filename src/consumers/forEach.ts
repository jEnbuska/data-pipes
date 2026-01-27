import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

export interface IYieldedForEach<T, TAsync extends boolean> {
  /**
   * Invokes the provided callback for each item produced by the generator.
   *
   * Iterates through all items, calling `cb` with the current item and its
   * index. The return value of the callback is ignored.
   *
   * The generator is fully consumed during this operation.
   *
   * @example
   * ```ts
   * Yielded.from([1,2,3])
   *   .forEach((n, i) => {
   *     console.log(i, n);
   *   })
   * // Logs:
   * // 0 1
   * // 1 2
   * // 2 3
   * ```
   */
  forEach(cb: (next: T, index: number) => unknown): ReturnValue<void, TAsync>;
}

export async function forEachAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  callback: (next: T, index: number) => unknown,
): Promise<void> {
  let index = 0;
  for await (const next of generator) callback(next, index++);
}

export async function forEachParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  callback: (next: T, index: number) => unknown,
): Promise<void> {
  let index = 0;
  const { promise, resolve } = Promise.withResolvers<void>();
  function call(value: T) {
    callback(value, index++);
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return resolve();
    void next.value.then(call);
    void generator.next().then(onNext);
  });
  return promise;
}
