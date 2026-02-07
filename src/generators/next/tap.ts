import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedTap<T, TFlow extends IYieldedFlow> {
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
  tap(callback: (next: T, index: number) => unknown): INextYielded<T, TFlow>;
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
  let index = 0;
  return ParallelGenerator.create({
    generator,
    parallel,
    onNext(value) {
      void consumer(value, index++);
      return [value];
    },
  });
}
