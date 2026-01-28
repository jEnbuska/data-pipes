import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

export interface IYieldedCount<TAsync extends boolean> {
  /**
   * Counts the number of items produced by the generator.
   *
   * Iterates through all items in the generator and returns the total count
   * as a number.
   *
   * @example
   * ```ts
   * Yielded.from([10, 20, 100]).count() satisfies number // 3
   * ```
   * ```ts
   * Yielded.from([]).count() satisfies number // 0
   * ```
   */
  count(): ReturnValue<number, TAsync>;
}

function counter(_acc: unknown, _next: unknown, index: number) {
  return index + 1;
}
export function countSync(generator: IYieldedIterator<any>): number {
  return generator.reduce(counter, 0);
}

export async function countAsync(
  generator: IYieldedAsyncGenerator,
): Promise<number> {
  let acc = 0;
  for await (const _ of generator) {
    acc++;
  }
  return acc;
}

export async function countParallel(generator: IYieldedParallelGenerator) {
  const { promise, resolve } = Promise.withResolvers<number>();
  let count = 0;

  void generator.next().then(function onNext(next) {
    if (!next.done) return resolve(count);
    count++;
    void generator.next().then(onNext);
  });
  return await promise;
}
