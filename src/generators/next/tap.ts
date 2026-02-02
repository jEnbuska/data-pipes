import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types";
import { withIndex1 } from "../../utils/withIndex";
import { createParallel } from "../createParallel";

export interface IYieldedTap<T, TAsync extends boolean> {
  /**
   * Calls the provided consumer function for each item produced by the generator
   * without modifying the items, then yields the original items to the next operation.
   *
   * Any value returned by the callback, including a Promise, **does not halt
   * downstream operations**; items continue to be passed immediately.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .tap(n => console.log(n)) // logs 1, 2, 3
   *   .toArray() satisfies number[] // [1, 2, 3]
   * ```
   * ```ts
   * const storer: number[] = [];
   * Yielded.from([1, 2, 3])
   *   .tap(n => storer.push(n * 2))
   *   .consume() satisfies void
   * console.log(storer) // [2, 4, 6]
   * ```
   */
  tap(callback: (next: T, index: number) => unknown): INextYielded<T, TAsync>;
}

export function* tapSync<T>(
  generator: IYieldedIterator<T>,
  consumer: (next: T, index: number) => unknown,
): IYieldedIterator<T> {
  let index = 0;
  for (const next of generator) {
    consumer(next, index++);
    yield next;
  }
}

export async function* tapAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  consumer: (next: T, index: number) => unknown,
): IYieldedAsyncGenerator<T> {
  let index = 0;
  for await (const next of generator) {
    consumer(next, index++);
    yield next;
  }
}

export function tapParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  consumer: (next: T, index: number) => unknown,
): IYieldedParallelGenerator<T> {
  const callback = withIndex1(consumer);
  return createParallel({
    generator,
    parallel,
    onNext(value) {
      void value.then(callback);
      return [value];
    },
  });
}
