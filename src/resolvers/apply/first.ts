import type { IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedSyncGenerator } from "../../generators/sync/types.ts";
import { type ParallelGeneratorCallbackArgs } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";

export interface IYieldedFirst<T, TFlow extends IYieldedFlow> {
  /**
   * Returns the first item produced by the generator.
   *
   * Iteration stops as soon as the first item is produced, so the generator
   * is **not fully consumed**.
   * If the generator produces no items, `undefined` is returned. */
  first(): IResolverReturn<T | undefined, TFlow>;
}

export function firstSync<T>(generator: IYieldedSyncGenerator<T>) {
  const next = generator.next();
  if (next.done) return undefined;
  return next.value;
}

export async function firstAsync<T>(generator: IYieldedAsyncGenerator<T>) {
  const next = await generator.next();
  if (next.done) return undefined;
  return next.value;
}

export function firstParallel<T>(): ParallelGeneratorCallbackArgs<
  T,
  T | undefined
> {
  return {
    onNext(value, resolve) {
      resolve(value);
    },
    onDone(resolve) {
      resolve(undefined);
    },
  };
}
