import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

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
  tap(callback: (next: T) => unknown): INextYielded<T, TAsync>;
}

export function* tapSync<T>(
  generator: IYieldedIterator<T>,
  consumer: (next: T) => unknown,
): IYieldedIterator<T> {
  for (const next of generator) {
    consumer(next);
    yield next;
  }
}

export async function* tapAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  consumer: (next: T) => unknown,
): IYieldedAsyncGenerator<T> {
  for await (const next of generator) {
    consumer(next);
    yield next;
  }
}

export function tapParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  consumer: (next: T) => unknown,
): IYieldedParallelGeneratorOnNext<T> {
  return async () => {
    const next = await generator.next();
    if (next.done) return;
    void next.value.then(consumer);
    return next;
  };
}
