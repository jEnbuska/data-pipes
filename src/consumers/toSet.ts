import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { createExtendPromise } from "./parallel.utils.ts";

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
  const add = set.add.bind(set);
  const { addPromise, awaitAll } = createExtendPromise();
  async function onDone() {
    await awaitAll();
    resolve(set);
  }

  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void addPromise(next.value.then(add));
    void generator.next().then(onNext);
  });
  return promise;
}
