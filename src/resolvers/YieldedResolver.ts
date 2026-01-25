import { consumeSync } from "../consumers/consume.ts";
import { countSync } from "../consumers/count.ts";
import { countBySync } from "../consumers/countBy.ts";
import { firstSync } from "../consumers/first.ts";
import { groupBySync } from "../consumers/groupBy.ts";
import { maxBySync } from "../consumers/maxBy.ts";
import { minBySync } from "../consumers/minBy.ts";
import type { IYieldedResolver, YieldedIterator } from "../types.ts";

export class YieldedResolver<T> implements IYieldedResolver<T> {
  protected readonly generator: YieldedIterator<T>;

  protected constructor(generator: YieldedIterator<T>) {
    this.generator = generator;
  }

  [Symbol.iterator]() {
    return this.generator[Symbol.iterator]();
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
    return this.generator.reduce(...args);
  }

  toArray() {
    return this.generator.toArray();
  }

  every(...args: Parameters<IYieldedResolver<T>["every"]>) {
    return this.generator.every(...args);
  }

  find(...args: Parameters<IYieldedResolver<T>["find"]>) {
    return this.generator.find(...args);
  }

  some(...args: Parameters<IYieldedResolver<T>["some"]>) {
    return this.generator.some(...args);
  }

  minBy(...args: Parameters<IYieldedResolver<T>["minBy"]>) {
    return minBySync(this.generator, ...args);
  }

  maxBy(...args: Parameters<IYieldedResolver<T>["maxBy"]>) {
    return maxBySync(this.generator, ...args);
  }

  countBy(...args: Parameters<IYieldedResolver<T>["countBy"]>) {
    return countBySync(this.generator, ...args);
  }

  count(...args: Parameters<IYieldedResolver<T>["count"]>) {
    return countSync(this.generator, ...args);
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
    return groupBySync(this.generator, ...args);
  }

  consume() {
    return consumeSync(this.generator);
  }

  first() {
    return firstSync(this.generator);
  }
}
