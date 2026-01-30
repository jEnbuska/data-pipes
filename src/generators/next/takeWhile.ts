import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { createParallel } from "../createParallel.ts";

export interface IYieldedTakeWhile<T, TAsync extends boolean> {
  /**
   * Yields items produced by the generator **while the predicate returns `true`**
   * to the next operation in the pipeline.
   *
   * Once the predicate returns `false` for the first time, the generator
   * **stops producing further items** and all upstream work halts. Any items
   * already yielded continue downstream.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4])
   *   .takeWhile(n => n < 3)
   *   .toArray() satisfies number[] // [1, 2]
   * ```
   * ```ts
   * Yielded.from([1, 2, 3, 4])
   *   .takeWhile(n => n < 0)
   *   .toArray() satisfies number[] // []
   * ```
   */
  takeWhile(
    fn: (next: T) => ICallbackReturn<boolean, TAsync>,
  ): INextYielded<T, TAsync>;
}

export function* takeWhileSync<T>(
  generator: IYieldedIterator<T>,
  predicate: (next: T) => boolean,
): IYieldedIterator<T> {
  for (const next of generator) {
    if (!predicate(next)) return;
    yield next;
  }
}

export async function* takeWhileAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T) => IPromiseOrNot<boolean>,
): IYieldedAsyncGenerator<T> {
  for await (const next of generator) {
    if (!(await predicate(next))) return;
    yield next;
  }
}

export function takeWhileParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (next: T) => IPromiseOrNot<boolean>,
): IYieldedParallelGenerator<T> {
  return createParallel<T>({
    generator,
    parallel,
    async onNext(next) {
      if (!(await next.then(predicate))) return { RETURN: null };
      return { YIELD: next };
    },
  });
}
