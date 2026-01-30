import type {
  ICallbackReturn,
  INextYielded,
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { createParallel } from "../createParallel.ts";

export interface IYieldedDropWhile<T, TAsync extends boolean> {
  /**
   * Drops items produced by the generator **as long as the predicate returns `true`**,
   * then yields the remaining items to the next operation in the pipeline.
   *
   * Once the predicate returns `false` for the first time, all subsequent
   * items are yielded without further predicate checks.
   *
   * Supports both synchronous and asynchronous generators. When `TAsync`
   * is `true`, the predicate may return a `Promise<boolean>`, and items
   * will be correctly handled asynchronously.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3, 4])
   *   .dropWhile(n => n < 3)
   *   .toArray() satisfies number[] // [3, 4]
   * ```
   * ```ts
   * Yielded.from([1, 2, 3, 4])
   *   .dropWhile(n => n < 0)
   *   .toArray() satisfies number[] // [1, 2, 3, 4]
   * ```
   */
  dropWhile(
    fn: (next: T) => ICallbackReturn<boolean, TAsync>,
  ): INextYielded<T, TAsync>;
}

export function* dropWhileSync<T>(
  generator: IYieldedIterator<T>,
  predicate: (next: T) => boolean,
): IYieldedIterator<T> {
  for (const next of generator) {
    if (predicate(next)) continue;
    yield next;
    break;
  }
  for (const next of generator) {
    yield next;
  }
}

export async function* dropWhileAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (next: T) => IPromiseOrNot<boolean>,
): IYieldedAsyncGenerator<T> {
  for await (const next of generator) {
    if (await predicate(next)) continue;
    yield next;
    break;
  }
  for await (const next of generator) {
    yield next;
  }
}

export function dropWhileParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  predicate: (next: T) => IPromiseOrNot<boolean>,
): IYieldedParallelGenerator<T> {
  let drop = true;
  return createParallel<T>({
    generator,
    parallel,
    async onNext(next) {
      if (!drop) {
        return { YIELD: next };
      }
      if (await predicate(await next)) {
        drop = false;
        return { YIELD: next };
      }
      return { CONTINUE: null };
    },
  });
}
