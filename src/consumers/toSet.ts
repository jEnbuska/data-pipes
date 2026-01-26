import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type { IYieldedAsyncGenerator } from "../shared.types.ts";

export interface IYieldedToSet<T, TAsync extends boolean> {
  toSet(): ReturnValue<Set<T>, TAsync>;
}

export async function toSetAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<Set<T>> {
  const set = new Set<T>();
  for await (const next of generator) set.add(next);
  return set;
}
