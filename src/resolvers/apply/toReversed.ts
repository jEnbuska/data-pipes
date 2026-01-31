import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { resolveParallel } from "../resolveParallel.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedToReversed<T, TAsync extends boolean> {
  /**
   * Returns the items produced by the generator in reverse order
   * as a new array.
   *
   * Items are inserted into the result incrementally as they are
   * produced by the generator, so the reversal happens **one item
   * at a time** rather than by collecting all items first and
   * reversing afterward.
   *
   * The generator is fully consumed before the final array is returned.
   * @example
   * ```ts
   * Yielded.from([1,2,3])
   *   .toReversed() satisfies number[] // [3,2,1]
   * ```
   **/
  toReversed(): ReturnValue<T[], TAsync>;
}

export function toReversedSync<T>(generator: IYieldedIterator<T>): T[] {
  const arr: T[] = [];
  for (const next of generator) {
    arr.unshift(next);
  }
  return arr;
}

export async function toReversedAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const next of generator) {
    arr.unshift(next);
  }
  return arr;
}

export function toReversedParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<T[]> {
  const arr: T[] = [];
  return resolveParallel({
    parallel,
    generator,
    onNext(value) {
      arr.unshift(value);
    },
    onDone(resolve) {
      resolve(arr);
    },
  });
}
