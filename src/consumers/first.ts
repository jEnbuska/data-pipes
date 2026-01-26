import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  YieldedAsyncGenerator,
  YieldedIterator,
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

export function firstSync<T>(generator: YieldedIterator<T>) {
  const next = generator.next();
  if (next.done) return undefined;
  return next.value;
}

export async function firstAsync<T>(generator: YieldedAsyncGenerator<T>) {
  const next = await generator.next();
  if (next.done) return undefined;
  return next.value;
}
