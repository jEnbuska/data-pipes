import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGeneratorResolver } from "../ParallelGeneratorResolver.ts";
import type { ReturnValue } from "../resolver.types.ts";

export interface IYieldedSumBy<T, TAsync extends boolean> {
  /**
   * Applies the provided selector to each item produced by the generator
   * and returns the sum of the resulting numeric values.
   *
   * Iterates through all items and accumulates the total by adding the
   * number returned by `fn` for each item. If the generator produces no
   * items, `0` is returned.
   * @example
   * Yielded.from([1,2,3,4,5])
   * .sumBy(n => n) satisfies number | undefined // 15
   *
   * @example
   * Yielded.from([] as number[])
   * .sumBy(n => n) satisfies number | undefined // 0
   */
  sumBy(fn: (next: T) => number): ReturnValue<number, TAsync>;
}

export function sumBySync<T>(
  generator: IYieldedIterator<T>,
  mapper: (next: T) => number,
): number {
  return generator.reduce((acc, next) => mapper(next) + acc, 0);
}

export async function sumByAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  mapper: (next: T) => IPromiseOrNot<number>,
): Promise<number> {
  let acc = 0;
  for await (const next of generator) {
    acc += await mapper(next);
  }
  return acc;
}

export function sumByParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
  mapper: (next: T) => IPromiseOrNot<number>,
): Promise<number> {
  let acc = 0;
  return ParallelGeneratorResolver.run({
    generator,
    parallel,
    async onNext({ value }) {
      acc += await mapper(value);
    },
    onDoneAndIdle(resolve) {
      resolve(acc);
    },
  });
}
