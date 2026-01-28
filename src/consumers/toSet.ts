import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

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

export async function toSetParallel<T>(
  generator: IYieldedParallelGenerator<T>,
): Promise<Set<T>> {
  const set = new Set<T>();
  const { promise, resolve } = Promise.withResolvers<Set<T>>();
  const setAdd = set.add.bind(set);
  using handler = new ParallelHandler<unknown>();
  async function onDone() {
    await handler.waitUntilAllResolved();
    resolve(set);
  }

  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void handler.register(next.value.then(setAdd));
    void generator.next().then(onNext);
  });
  return await promise;
}
