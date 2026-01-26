import { consumeSync } from "../consumers/consume.ts";
import { countSync } from "../consumers/count.ts";
import { firstSync } from "../consumers/first.ts";
import { groupBySync } from "../consumers/groupBy.ts";
import { lastSync } from "../consumers/last.ts";
import { maxBySync } from "../consumers/maxBy.ts";
import { minBySync } from "../consumers/minBy.ts";
import { sumBySync } from "../consumers/sumBy.ts";
import { toReversedSync } from "../consumers/toReversed.ts";
import { toSortedSync } from "../consumers/toSorted.ts";
import type { YieldedIterator } from "../shared.types.ts";
import type { IYieldedResolver } from "./resolver.types.ts";

export class YieldedResolver<T> implements IYieldedResolver<T> {
  protected readonly generator: Disposable & YieldedIterator<T>;
  protected constructor(
    parent: undefined | (YieldedIterator & Disposable),
    generator: YieldedIterator<T>,
  ) {
    this.generator = Object.assign(generator, {
      [Symbol.dispose]() {
        void generator.return?.(undefined);
        void parent?.[Symbol.dispose]();
      },
    });
  }

  *[Symbol.iterator]() {
    using generator = this.generator;
    for (const next of generator) {
      yield next;
    }
  }

  #apply<TArgs extends any[], TReturn>(
    cb: (...args: [YieldedIterator<T>, ...TArgs]) => TReturn,
    ...args: TArgs
  ): TReturn {
    using generator = this.generator;
    return cb(generator, ...args);
  }

  forEach(
    ...args: Parameters<IYieldedResolver<T>["forEach"]>
  ): ReturnType<IYieldedResolver<T>["forEach"]> {
    return this.generator.forEach(...args);
  }

  /**
   * @example
   * ```ts
   * @example
   * Yielded.from([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 15
   *   ```
   * ```ts
   * Yielded.from([] as number[])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 0
   *   ```
   * */
  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => TOut,
    initialValue: TOut,
  ): TOut;
  /**
   * @example
   * ```ts
   * Yielded.from([1,2,4,3])
   *   .reduce((acc, next) => acc < next ? next : acc) satisfies undefined | number // 4
   *   ```
   */
  reduce(reducer: (acc: T, next: T, index: number) => T): T | undefined;
  reduce(...args: Parameters<IYieldedResolver<T>["reduce"]>) {
    using generator = this.generator;
    return generator.reduce(...args);
  }

  /**
   * @example
   * ```ts
   * Yielded.from([1,2,3,4,5])
   *  .toArray() satisfies number[] // [1,2,3,4,5]
   *  ```
   */
  toArray() {
    using generator = this.generator;
    return generator.toArray();
  }

  /**
   * @example
   * ```ts
   * Yielded.from([1,2,3])
   *   .find((n): n is 1 => n === 1) satisfies 1 | undefined // 1;
   *   ``` */
  find<TOut extends T>(predicate: (next: T) => next is TOut): TOut | undefined;
  /**
   * @example
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .find(n => n > 2) satisfies number | undefined // 3
   *  ```
   * */
  find(predicate: (next: T) => unknown): T | undefined;
  find(...args: Parameters<IYieldedResolver<T>["find"]>) {
    using generator = this.generator;
    return generator.find(...args);
  }

  some(...args: Parameters<IYieldedResolver<T>["some"]>) {
    using generator = this.generator;
    return generator.some(...args);
  }

  /**
   * @example
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .every(n => n > 1) satisfies boolean // false
   *  ```
   * ```ts
   * Yielded.from([1,2,3,4])
   *  .every(n => n < 5) satisfies boolean // true
   *  ```
   * ```ts
   * Yielded.from([])
   *  .every(Boolean) satisfies boolean // true
   *  ```
   * */
  every(...args: Parameters<IYieldedResolver<T>["every"]>) {
    using generator = this.generator;
    return generator.every(...args);
  }

  /**
   * @example
   * ```ts
   * Yielded.from([3,2,1,4,5])
   *  .toSorted((a, b) => a - b) satisfies number[] // [1,2,3,4,5]
   *  ```
   * */
  toSorted(...args: Parameters<IYieldedResolver<T>["toSorted"]>) {
    return this.#apply(toSortedSync, ...args);
  }

  /**
   * @example
   * ```ts
   * Yielded.from([1,2,3,4,5])
   *  .toReversed((a, b) => a - b) satisfies number[] // [5,4,3,2,1]
   *  ```
   * */
  toReversed() {
    return this.#apply(toReversedSync);
  }

  minBy(...args: Parameters<IYieldedResolver<T>["minBy"]>) {
    return this.#apply(minBySync, ...args);
  }

  maxBy(...args: Parameters<IYieldedResolver<T>["maxBy"]>) {
    return this.#apply(maxBySync, ...args);
  }

  sumBy(...args: Parameters<IYieldedResolver<T>["sumBy"]>) {
    return this.#apply(sumBySync, ...args);
  }

  count(...args: Parameters<IYieldedResolver<T>["count"]>) {
    return this.#apply(countSync, ...args);
  }

  groupBy<TKey extends PropertyKey, const TGroups extends PropertyKey>(
    keySelector: (next: T) => TKey,
    groups: TGroups[],
  ): Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>;
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: T) => TKey,
    groups?: undefined,
  ): Partial<Record<TKey, T[]>>;
  groupBy(...args: unknown[]): any {
    // @ts-expect-error
    return this.#apply(groupBySync, ...args);
  }

  consume() {
    return this.#apply(consumeSync);
  }

  first() {
    return this.#apply(firstSync);
  }

  last() {
    return this.#apply(lastSync);
  }
}
