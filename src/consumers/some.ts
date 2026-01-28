import { ParallelHandler } from "../resolvers/ParallelHandler.ts";
import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { withIndex1 } from "../utils.ts";

export interface IYieldedSome<T, TAsync extends boolean> {
  /**
   * Determines whether the provided predicate returns a truthy value
   * for **any** item produced by the generator.
   *
   * Iterates through the generator and invokes `predicate` for each item
   * until it returns a truthy value (or a resolved truthy value for async
   * generators). Iteration stops immediately once a match is found.
   *
   * Returns `false` if the generator produces no items or if the predicate
   * never evaluates to a truthy value.
   *
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .some(n => n > 2) satisfies boolean // true
   *  ```
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .some(n => n > 5) satisfies boolean // false
   *  ```
   * ```ts
   * Yielded.from([])
   *  .some(Boolean) satisfies boolean // false
   *  ```
   */
  some(
    predicate: (next: T, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;
}
export async function someAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  let index = 0;
  for await (const next of generator) {
    // Do not perform predicates, since we might want to stop at any point
    if (await predicate(next, index++)) return true;
  }
  return false;
}

export async function someParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<boolean> {
  const { promise, resolve } = Promise.withResolvers<boolean>();
  let some = false;
  const callback = withIndex1(predicate);
  async function applyPredicate(value: T) {
    if (some) return;
    const result = await callback(value);
    if (result) return;
    some = true;
    void generator.return();
    return onDone();
  }
  using handler = new ParallelHandler<unknown>();
  async function onDone() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!some && !handler.isEmpty()) {
      await handler.raceRegistered();
    }
    resolve(some);
  }
  void generator.next().then(function onNext(next) {
    if (next.done || some) return onDone();
    void handler.register(next.value.then(applyPredicate));
    void generator.next().then(onNext);
  });
  return await promise;
}
