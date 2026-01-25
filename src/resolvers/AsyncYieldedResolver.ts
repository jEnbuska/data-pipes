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
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedIterator,
} from "../types.ts";
import type { IAsyncYieldedResolver } from "./types.ts";

export class AsyncYieldedResolver<T> implements IAsyncYieldedResolver<T> {
  protected readonly generator: Disposable & YieldedAsyncGenerator<T>;

  protected constructor(
    parent: undefined | YieldedAsyncGenerator | YieldedIterator,
    generator: YieldedAsyncGenerator<T>,
  ) {
    this.generator = Object.assign(generator, {
      [Symbol.dispose]() {
        void parent?.return?.(undefined);
      },
    });
  }

  async *[Symbol.asyncIterator]() {
    using generator = this.generator;
    for await (const next of generator) {
      yield next;
    }
  }

  [Symbol.dispose]() {
    return this.generator[Symbol.dispose]();
  }

  async #apply<TArgs extends any[], TReturn>(
    cb: (...args: [YieldedAsyncGenerator<T>, ...TArgs]) => Promise<TReturn>,
    ...args: TArgs
  ): Promise<TReturn> {
    using generator = this.generator;
    return await cb(generator, ...args);
  }

  forEach(...args: Parameters<IAsyncYieldedResolver<T>["forEach"]>) {
    return this.#apply(forEachAsync, ...args);
  }

  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => PromiseOrNot<TOut>,
    initialValue: PromiseOrNot<TOut>,
  ): Promise<TOut>;
  reduce(
    reducer: (acc: T, next: T, index: number) => T,
  ): Promise<T | undefined>;
  reduce(...args: unknown[]) {
    // @ts-expect-error
    return this.#apply(reduceAsync, ...args);
  }

  toArray() {
    return this.#apply(toArrayAsync);
  }

  every(...args: Parameters<IAsyncYieldedResolver<T>["every"]>) {
    return this.#apply(everyAsync, ...args);
  }

  find<TOut extends T>(
    predicate: (next: T) => next is TOut,
  ): Promise<TOut | undefined>;
  find(predicate: (next: T) => unknown): Promise<T | undefined>;
  find(...args: unknown[]) {
    // @ts-expect-error
    return this.#apply(findAsync, ...args);
  }

  some(...args: Parameters<IAsyncYieldedResolver<T>["some"]>) {
    return this.#apply(someAsync, ...args);
  }

  minBy(...args: Parameters<IAsyncYieldedResolver<T>["minBy"]>) {
    return this.#apply(minByAsync, ...args);
  }

  maxBy(...args: Parameters<IAsyncYieldedResolver<T>["maxBy"]>) {
    return this.#apply(maxByAsync, ...args);
  }

  countBy(...args: Parameters<IAsyncYieldedResolver<T>["countBy"]>) {
    return this.#apply(countByAsync, ...args);
  }

  count(...args: Parameters<IAsyncYieldedResolver<T>["count"]>) {
    return this.#apply(countAsync, ...args);
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
    return this.#apply(groupByAsync, ...args);
  }

  consume() {
    return this.#apply(consumeAsync);
  }

  first() {
    return this.#apply(firstAsync);
  }
}
