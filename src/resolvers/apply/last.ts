import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGeneratorResolver } from "../ParallelGeneratorResolver.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedLast<T, TAsync extends boolean> {
  /**
   * Returns the last item produced by the generator.
   *
   * Iterates through all items in the generator and returns the final item.
   * The generator is fully consumed during this operation. If the generator
   * produces no items, `undefined` is returned.
   *
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .last() satisfies number | undefined // 3
   * ```
   * ```ts
   * Yielded.from([] as number[])
   *   .last() satisfies number | undefined // undefined
   * ```
   */
  last(): ReturnValue<T | undefined, TAsync>;
}

export function lastSync<T>(generator: IYieldedIterator<T>) {
  let last: undefined | T;
  for (const next of generator) last = next;
  return last;
}

export async function lastAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T | undefined> {
  let last: undefined | T;
  for await (const next of generator) last = next;
  return last;
}

export function lastParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<T | undefined> {
  let last: T | undefined;
  return ParallelGeneratorResolver.run({
    parallel,
    generator,
    onNext({ value }) {
      last = value;
    },
    onDoneAndIdle(resolve) {
      resolve(last);
    },
  });
}
