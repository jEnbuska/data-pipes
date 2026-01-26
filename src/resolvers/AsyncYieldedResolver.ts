import { consumeAsync } from "../consumers/consume.ts";
import { countAsync } from "../consumers/count.ts";
import { everyAsync } from "../consumers/every.ts";
import { findAsync } from "../consumers/find.ts";
import { firstAsync } from "../consumers/first.ts";
import { forEachAsync } from "../consumers/forEach.ts";
import { groupByAsync } from "../consumers/groupBy.ts";
import { lastAsync } from "../consumers/last.ts";
import { maxByAsync } from "../consumers/maxBy.ts";
import { minByAsync } from "../consumers/minBy.ts";
import { reduceAsync } from "../consumers/reduce.ts";
import { someAsync } from "../consumers/some.ts";
import { sumByAsync } from "../consumers/sumBy.ts";
import { toArrayAsync } from "../consumers/toArray.ts";
import { toReversedAsync } from "../consumers/toReversed.ts";
import { toSetAsync } from "../consumers/toSet.ts";
import { toSortedAsync } from "../consumers/toSorted.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
} from "../shared.types.ts";
import type {
  IAsyncYieldedResolver,
  IYieldedResolver,
} from "./resolver.types.ts";
import { YieldedAsyncGenerator } from "./YieldedAsyncGenerator.ts";

export class AsyncYieldedResolver<T> implements IAsyncYieldedResolver<T> {
  protected readonly generator: Disposable & IYieldedAsyncGenerator<T>;

  protected constructor(
    parent:
      | undefined
      | ((IYieldedAsyncGenerator | IYieldedIterator) & Disposable),
    generator: IYieldedAsyncGenerator<T>,
  ) {
    this.generator = Object.assign(new YieldedAsyncGenerator(generator, 5), {
      [Symbol.dispose]() {
        if (generator === parent) return;
        void generator.return?.(undefined);
        void parent?.[Symbol.dispose]();
      },
    });
  }

  async *[Symbol.asyncIterator]() {
    using generator = this.generator;
    for await (const next of generator) {
      yield next;
    }
  }

  async #apply<TArgs extends any[], TReturn>(
    cb: (...args: [IYieldedAsyncGenerator<T>, ...TArgs]) => Promise<TReturn>,
    ...args: TArgs
  ): Promise<TReturn> {
    using generator = this.generator;
    return await cb(generator, ...args);
  }

  forEach(...args: Parameters<IAsyncYieldedResolver<T>["forEach"]>) {
    return this.#apply(forEachAsync, ...args);
  }

  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => IPromiseOrNot<TOut>,
    initialValue: IPromiseOrNot<TOut>,
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

  toSet() {
    return this.#apply(toSetAsync);
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

  toSorted(...args: Parameters<IYieldedResolver<T>["toSorted"]>) {
    return this.#apply(toSortedAsync, ...args);
  }

  toReversed() {
    return this.#apply(toReversedAsync);
  }

  minBy(...args: Parameters<IAsyncYieldedResolver<T>["minBy"]>) {
    return this.#apply(minByAsync, ...args);
  }

  maxBy(...args: Parameters<IAsyncYieldedResolver<T>["maxBy"]>) {
    return this.#apply(maxByAsync, ...args);
  }

  sumBy(...args: Parameters<IAsyncYieldedResolver<T>["sumBy"]>) {
    return this.#apply(sumByAsync, ...args);
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

  last() {
    return this.#apply(lastAsync);
  }
}
