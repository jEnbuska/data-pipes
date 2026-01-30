import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../../shared.types.ts";
import { ParallelGeneratorResolver } from "../ParallelGeneratorResolver.ts";
import type { ReturnValue } from "../resolver.types.ts";

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

export function firstParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  parallel: number,
): Promise<T | undefined> {
  return ParallelGeneratorResolver.run({
    parallel,
    generator,
    onNext({ value, resolve }) {
      resolve(value);
    },
    onDoneAndIdle(resolve) {
      resolve(undefined);
    },
  });
}
