import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGeneratorResolver } from "../ParallelGeneratorResolver.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedToArray<T, TAsync extends boolean> {
  /**
   * Collects all items produced by the generator and returns them
   * as a new array.
   *
   * The generator is fully consumed before the array is returned.
   * */
  toArray(): ReturnValue<T[], TAsync>;
}

export async function toArrayAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<T[]> {
  const arr: T[] = [];
  for await (const next of generator) arr.push(next);
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
    onNext({ value }) {
      arr.push(value);
    },
    onDoneAndIdle(resolve) {
      resolve(arr);
    },
  });
}
