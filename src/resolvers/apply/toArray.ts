import type { IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedParallelGenerator } from "../../generators/parallel/types.ts";
import { ParallelGeneratorResolver } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";

export interface IYieldedToArray<T, TFlow extends IYieldedFlow> {
  /**
   * Collects all items produced by the generator and returns them
   * as a new array.
   *
   * The generator is fully consumed before the array is returned.
   * */
  toArray(): IResolverReturn<T[], TFlow>;
}

export async function toArrayAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const next of generator) {
    arr.push(next);
  }
  return arr;
}

export function toArrayParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<T[]> {
  const arr: T[] = [];
  return ParallelGeneratorResolver.run({
    generator,
    parallel,
    onNext(value) {
      arr.push(value);
    },
    onDone(resolve) {
      resolve(arr);
    },
  });
}
