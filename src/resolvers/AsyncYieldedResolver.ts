import { consumeAsync } from "../consumers/consume.ts";
import { countAsync } from "../consumers/count.ts";
import { countByAsync } from "../consumers/countBy.ts";
import { everyAsync } from "../consumers/every.ts";
import { findAsync } from "../consumers/find.ts";
import { firstAsync } from "../consumers/first.ts";
import { forEachAsync } from "../consumers/forEach.ts";
import { groupByAsync } from "../consumers/groupBy.ts";
import { maxByAsync } from "../consumers/maxBy.ts";
import { minByAsync } from "../consumers/minBy.ts";
import { reduceAsync } from "../consumers/reduce.ts";
import { someAsync } from "../consumers/some.ts";
import { toArrayAsync } from "../consumers/toArray.ts";
import type {
  IYieldedResolver,
  PromiseOrNot,
  YieldedAsyncGenerator,
} from "../types.ts";

export class AsyncYieldedResolver<T> implements IYieldedResolver<T, true> {
  protected readonly generator: YieldedAsyncGenerator<T>;

  protected constructor(generator: YieldedAsyncGenerator<T>) {
    this.generator = generator;
  }

  [Symbol.asyncIterator]() {
    return this.generator[Symbol.asyncIterator]();
  }

  forEach(...args: Parameters<IYieldedResolver<T, true>["forEach"]>) {
    return forEachAsync(this.generator, ...args);
  }

  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => PromiseOrNot<TOut>,
    initialValue: PromiseOrNot<TOut>,
  ): Promise<TOut>;
  reduce(
    reducer: (acc: T, next: T, index: number) => T,
  ): Promise<T | undefined>;
  reduce(...args: Parameters<IYieldedResolver<T, true>["reduce"]>) {
    return reduceAsync(this.generator, ...args);
  }

  toArray() {
    return toArrayAsync(this.generator);
  }

  every(...args: Parameters<IYieldedResolver<T, true>["every"]>) {
    return everyAsync(this.generator, ...args);
  }

  find(...args: Parameters<IYieldedResolver<T, true>["find"]>) {
    return findAsync(this.generator, ...args);
  }

  some(...args: Parameters<IYieldedResolver<T, true>["some"]>) {
    return someAsync(this.generator, ...args);
  }

  minBy(...args: Parameters<IYieldedResolver<T, true>["minBy"]>) {
    return minByAsync(this.generator, ...args);
  }

  maxBy(...args: Parameters<IYieldedResolver<T, true>["maxBy"]>) {
    return maxByAsync(this.generator, ...args);
  }

  countBy(...args: Parameters<IYieldedResolver<T, true>["countBy"]>) {
    return countByAsync(this.generator, ...args);
  }

  count(...args: Parameters<IYieldedResolver<T, true>["count"]>) {
    return countAsync(this.generator, ...args);
  }

  groupBy<TKey extends PropertyKey, const TGroups extends PropertyKey>(
    keySelector: (next: T) => Promise<TKey> | TKey,
    groups: TGroups[],
  ): Promise<
    Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>
  >;
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: T) => Promise<TKey> | TKey,
    groups?: undefined,
  ): Promise<Partial<Record<TKey, T[]>>>;
  groupBy(...args: unknown[]): any {
    // @ts-expect-error
    return groupByAsync(this.generator, ...args);
  }

  consume() {
    return consumeAsync(this.generator);
  }

  first() {
    return firstAsync(this.generator);
  }
}
