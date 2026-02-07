import type { IYieldedFlow } from "../../general/types.ts";
import type { IYieldedAsyncGenerator } from "../../generators/async/types.ts";
import type { IYieldedParallelGenerator } from "../../generators/parallel/types.ts";
import { ParallelGeneratorResolver } from "../parallel/ParallelGeneratorResolver.ts";
import type { IResolverReturn } from "../types.ts";

export interface IYieldedToSet<T, TFlow extends IYieldedFlow> {
  toSet(): IResolverReturn<Set<T>, TFlow>;
}

export async function toSetAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
): Promise<Set<T>> {
  const set = new Set<T>();
  for await (const next of generator) set.add(next);
  return set;
}

export function toSetParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<Set<T>> {
  const set = new Set<T>();

  return ParallelGeneratorResolver.run<T, Set<T>>({
    generator,
    parallel,
    onNext(value) {
      set.add(value);
    },
    onDone(resolve) {
      resolve(set);
    },
  });
}
