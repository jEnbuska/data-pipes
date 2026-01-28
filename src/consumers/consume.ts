import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";

export interface IYieldedConsume<TAsync extends boolean> {
  /**
   *  Fully consumes the generator without producing a result.
   *
   *  Iterates through all items, effectively discarding them. Useful when
   *  you want to trigger all side effects of the generator or ensure that
   *  all asynchronous operations are completed.
   * @example
   * ```ts
   * Yielded.from([1, 2, 3])
   *   .tap(n => console.log(n)) // logs 1, 2, 3
   *   .consume() satisfies void;
   *  */
  consume(): ReturnValue<void, TAsync>;
}

export function consumeSync(generator: IYieldedIterator) {
  for (const _ of generator) {
    /* Do nothing */
  }
}

export async function consumeAsync(generator: IYieldedAsyncGenerator) {
  for await (const _ of generator) {
    /* Do nothing */
  }
}

export async function consumeParallel(generator: IYieldedParallelGenerator) {
  using handler = new ParallelHandler<unknown>();
  const { promise, resolve } = Promise.withResolvers<void>();
  async function onDone() {
    await handler.waitUntilAllResolved();
    resolve();
  }
  void generator.next().then(function onNext(next) {
    if (next.done) return onDone();
    void handler.register(next.value);
    void generator.next().then(onNext);
  });
  return await promise;
}
