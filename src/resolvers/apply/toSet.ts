import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGeneratorResolver } from "../ParallelGeneratorResolver.ts";
import type { ReturnValue } from "../resolver.types.ts";

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

export function toSetParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<Set<T>> {
  const set = new Set<T>();
  const add = set.add.bind(set);

  return ParallelGeneratorResolver.run<T, Set<T>>({
    generator,
    parallel,
    onNext({ value }) {
      add(value);
    },
    onDoneAndIdle(resolve) {
      resolve(set);
    },
  });
}
