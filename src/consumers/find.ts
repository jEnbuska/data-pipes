import type { ReturnValue } from "../resolvers/resolver.types.ts";
import type {
  ICallbackReturn,
  IYieldedAsyncGenerator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { withIndex1 } from "../utils.ts";

export interface IYieldedFind<T, TAsync extends boolean> {
  /**
   * Returns the first item in the generator that satisfies the provided predicate.
   *
   * Iterates through the generator until `predicate` returns a truthy value
   * (or a resolved truthy value for async generators). If a matching item is
   * found, it is returned; otherwise, `undefined` is returned.
   *
   * There are two overloads:
   * 1. **Type-guard predicate** – narrows the returned type to `TOut` or `undefined`.
   * 2. **Regular predicate** – returns the original type `T` or `undefined`.
   * @example```ts
   * // Regular
   * Yielded.from([1,2,3,4]).find(n => n > 2) satisfies number | undefined // 3
   * ```
   * ```ts
   * // Type-guard
   * Yielded.from([1,2,3]).find((n): n is 1 => n === 1) satisfies 1 | undefined // 1;
   * ```
   */
  find<TOut extends T>(
    predicate: (next: T) => next is TOut,
  ): ReturnValue<TOut | undefined, TAsync>;
  find(
    predicate: (next: T) => ICallbackReturn<unknown, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
}

export function findAsync<T, TOut extends T = T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => value is TOut,
): Promise<TOut | undefined>;
export function findAsync<T>(
  generator: IYieldedAsyncGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<T | undefined>;
export async function findAsync(
  generator: IYieldedAsyncGenerator,
  predicate: (value: unknown, index: number) => unknown,
): Promise<unknown | undefined> {
  const index = 0;
  for await (const next of generator) {
    // Do not perform predicates, since we might want to stop at any point
    if (await predicate(next, index)) return next;
  }
}

export function findParallel<T, TOut extends T = T>(
  generator: IYieldedParallelGenerator<T>,
  predicate: (value: T, index: number) => value is TOut,
): Promise<TOut | undefined>;
export function findParallel<T>(
  generator: IYieldedParallelGenerator<T>,
  predicate: (value: T, index: number) => unknown,
): Promise<T | undefined>;
export async function findParallel(
  generator: IYieldedParallelGenerator,
  predicate: (value: unknown, index: number) => unknown,
): Promise<unknown | undefined> {
  const { promise, resolve } = Promise.withResolvers<unknown>();
  let found = false;
  const callback = withIndex1(predicate);
  async function applyPredicate(value: unknown) {
    if (found) return;
    const result = await callback(value);
    if (!result) return;
    void generator.return();
    resolve(value);
    found = true;
  }
  void generator.next().then(function onNext(next) {
    if (found) return;
    if (next.done) return resolve(false);
    void next.value.then(applyPredicate);
    void generator.next().then(onNext);
  });
  return await promise;
}
