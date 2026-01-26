import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type { IYieldedAsyncGenerator } from "../shared.types.ts";

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
  const acc: T[] = [];
  for await (const next of generator) acc.push(next);
  return acc;
}
