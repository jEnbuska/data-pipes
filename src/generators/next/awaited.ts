import { resolveParallel } from "../../resolvers/resolveParallel";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types";
import type { IAsyncYielded } from "../../yielded.types";

export interface IYieldedAwaited<T> {
  /**
   * Converts a sequence of possibly asynchronous items into a fully asynchronous
   * generator. All items yielded by the upstream generator are awaited before
   * being passed to the next operation.
   *
   * This ensures that downstream operations always receive resolved values in the same order,
   * allowing you to safely work with Promises in a chain of generator operations.
   *
   * @example
   * ```ts
   * Yielded.from([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .awaited()
   *  .map(n => n * 2)
   *  .toArray() satisfies Promise<number[]> // Promise<[2,4,6]>
   * ```
   *  ```ts
   *  // Order may change if Promises are resolved at different times and parallel
   * Yielded.from([100, 200, 50, 10])
   * .map(n => sleep(n))
   * .awaited()
   * .parallel(4)
   * .toArray() satisfies Promise<number[]> // [10, 50, 100, 200]
   * ```
   */
  awaited(): IAsyncYielded<Awaited<T>>;
}

export async function* syncToAwaited<T>(
  generator: IYieldedIterator<T>,
): IYieldedAsyncGenerator<Awaited<T>> {
  for (const next of generator) {
    yield next;
  }
}

export async function* parallelToAwaited<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): IYieldedAsyncGenerator<Awaited<T>> {
  let done = false;
  const buffer: T[] = [];
  let resolvable = Promise.withResolvers<void>();
  using _ = resolveParallel<T, void>({
    generator,
    parallel,
    onNext(value) {
      console.log("PUSH", value);
      buffer.push(value);
      resolvable.resolve();
    },
    onDone(resolve) {
      done = true;
      resolvable.resolve();
      resolve();
    },
  });

  for await (const next of generator) {
    yield next;
  }

  while (!done || buffer.length) {
    while (buffer.length) {
      yield buffer.shift()!;
    }
    await resolvable.promise;
    resolvable = Promise.withResolvers<void>();
  }
}
