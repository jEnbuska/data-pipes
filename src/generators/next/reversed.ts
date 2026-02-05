import type {
  INextYielded,
  IYieldedAsyncGenerator,
  IYieldedFlow,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGenerator } from "../ParallelGenerator.ts";

export interface IYieldedReverse<T, TFlow extends IYieldedFlow> {
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
  reversed(): INextYielded<T, TFlow>;
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
  parallel: number,
): IYieldedParallelGenerator<T> {
  const acc: Array<Promise<T>> = [];
  return ParallelGenerator.create<T>({
    generator,
    parallel,
    onNext(next) {
      acc.unshift(next);
      return [];
    },
    onDone() {
      return acc;
    },
  });
}
