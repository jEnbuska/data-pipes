import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

export interface IYieldedFirst<T, TAsync extends boolean> {
  /**
   * Returns the first item produced by the generator.
   *
   * Iteration stops as soon as the first item is produced, so the generator
   * is **not fully consumed**.
   * If the generator produces no items, `undefined` is returned. */
  first(): ReturnValue<T | undefined, TAsync>;
}

export function firstSync<T>(generator: IYieldedIterator<T>) {
  const next = generator.next();
  if (next.done) return undefined;
  return next.value;
}

export async function firstAsync<T>(generator: IYieldedAsyncGenerator<T>) {
  const next = await generator.next();
  if (next.done) return undefined;
  return next.value;
}

export async function firstParallel<T>(
  generator: IYieldedParallelGenerator<T>,
) {
  const next = await generator.next();
  if (next.done) return undefined;
  return next.value;
}
