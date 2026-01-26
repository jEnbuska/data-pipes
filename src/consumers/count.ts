import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
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
export function countSync<T>(generator: IYieldedIterator<T>): number {
  return generator.reduce(counter, 0);
}

export async function countAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<number> {
  let acc = 0;
  for await (const _ of generator) {
    acc++;
  }
  return acc;
}
