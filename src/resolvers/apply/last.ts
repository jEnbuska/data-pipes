import type { IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedSyncGenerator } from "../../generators/sync/types.ts";
import { type ParallelGeneratorCallbackArgs } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";

export interface IYieldedLast<T, TFlow extends IYieldedFlow> {
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
  last(): IResolverReturn<T | undefined, TFlow>;
}

export function lastSync<T>(generator: IYieldedSyncGenerator<T>) {
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

export function lastParallel<T>(): ParallelGeneratorCallbackArgs<
  T,
  T | undefined
> {
  let last: T | undefined;
  return {
    onNext(value) {
      last = value;
    },
    onDone(resolve) {
      resolve(last);
    },
  };
}
