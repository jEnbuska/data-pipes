import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";

export interface IYieldedReverse<T, TAsync extends boolean> {
  /**
   * Yields the items produced by the generator in reverse order.
   *
   * The operator **buffers all items internally**. **No items are yielded
   * downstream until the upstream generator is fully consumed**.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .reversed()
   *   .toArray() satisfies number[] // [3, 2, 1]
   * ```
   * ```ts
   * Yielded.from(['a', 'b', 'c'])
   *   .reversed()
   *   .toArray() satisfies string[] // ['c', 'b', 'a']
   * ```
   */
  reversed(): INextYielded<T, TAsync>;
}

export function* reversedSync<T>(
  generator: IYieldedIterator<T>,
): IYieldedIterator<T> {
  const acc: T[] = [];
  for (const next of generator) {
    acc.unshift(next);
  }
  yield* acc;
}

export async function* reversedAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): IYieldedAsyncGenerator<T> {
  const acc: T[] = [];
  for await (const next of generator) {
    acc.unshift(next);
  }
  yield* acc;
}

export function reversedParallel<T>(
  generator: IYieldedParallelGenerator<T>,
): IYieldedParallelGeneratorOnNext<T> {
  const buffer: Array<Promise<T>> = [];
  return async (wrap) => {
    let next = await generator.next();
    while (!next.done) {
      buffer.push(next.value);
      next = await generator.next();
    }
    if (buffer.length) {
      return wrap(buffer.pop()!);
    }
  };
}
