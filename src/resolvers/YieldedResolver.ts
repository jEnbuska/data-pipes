import { consumeSync } from "../consumers/consume.ts";
import { countSync } from "../consumers/count.ts";
import { countBySync } from "../consumers/countBy.ts";
import { firstSync } from "../consumers/first.ts";
import { groupBySync } from "../consumers/groupBy.ts";
import { maxBySync } from "../consumers/maxBy.ts";
import { minBySync } from "../consumers/minBy.ts";
import type { YieldedIterator } from "../shared.types.ts";
import type { IYieldedResolver } from "./types.ts";

export class YieldedResolver<T> implements IYieldedResolver<T> {
  protected readonly generator: Disposable & YieldedIterator<T>;
  protected constructor(
    parent: undefined | YieldedIterator,
    generator: YieldedIterator<T>,
  ) {
    this.generator = Object.assign(generator, {
      [Symbol.dispose]() {
        void parent?.return?.(undefined);
      },
    });
  }

  *[Symbol.iterator]() {
    using generator = this.generator;
    for (const next of generator) {
      yield next;
    }
  }

  [Symbol.dispose]() {
    return this.generator[Symbol.dispose]();
  }

  #apply<TArgs extends any[], TReturn>(
    cb: (...args: [YieldedIterator<T>, ...TArgs]) => TReturn,
    ...args: TArgs
  ): TReturn {
    using generator = this.generator;
    return cb(generator, ...args);
  }

  forEach(...args: Parameters<IYieldedResolver<T>["forEach"]>) {
    return this.generator.forEach(...args);
  }

  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => TOut,
    initialValue: TOut,
  ): TOut;
  reduce(reducer: (acc: T, next: T, index: number) => T): T | undefined;
  reduce(...args: Parameters<IYieldedResolver<T>["reduce"]>) {
    using generator = this.generator;
    return generator.reduce(...args);
  }

  toArray() {
    using generator = this.generator;
    return generator.toArray();
  }

  find<TOut extends T>(predicate: (next: T) => next is TOut): TOut | undefined;
  find(predicate: (next: T) => unknown): T | undefined;
  find(...args: Parameters<IYieldedResolver<T>["find"]>) {
    using generator = this.generator;
    return generator.find(...args);
  }

  some(...args: Parameters<IYieldedResolver<T>["some"]>) {
    using generator = this.generator;
    return generator.some(...args);
  }

  every(...args: Parameters<IYieldedResolver<T>["every"]>) {
    using generator = this.generator;
    return generator.every(...args);
  }

  minBy(...args: Parameters<IYieldedResolver<T>["minBy"]>) {
    return this.#apply(minBySync, ...args);
  }

  maxBy(...args: Parameters<IYieldedResolver<T>["maxBy"]>) {
    return this.#apply(maxBySync, ...args);
  }

  countBy(...args: Parameters<IYieldedResolver<T>["countBy"]>) {
    return this.#apply(countBySync, ...args);
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
}
