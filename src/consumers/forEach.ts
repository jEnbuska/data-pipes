import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { withIndex1 } from "../utils.ts";

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
  forEachCallback: (next: T, index: number) => unknown,
): Promise<void> {
  const callback = withIndex1(forEachCallback);
  for await (const next of generator) callback(next);
}

export async function forEachParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  forEachCallback: (next: T, index: number) => unknown,
): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  using handler = new ParallelHandler<unknown>();
  const callback = withIndex1(forEachCallback);
  async function onDone() {
    await handler.waitUntilAllResolved();
    resolve();
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void handler.register(next.value.then(callback));
    void generator.next().then(onNext);
  });
  return await promise;
}
