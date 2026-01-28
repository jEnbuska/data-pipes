import { consumeAsync } from "../consumers/consume.ts";
import { countParallel } from "../consumers/count.ts";
import { everyParallel } from "../consumers/every.ts";
import { findParallel } from "../consumers/find.ts";
import { firstParallel } from "../consumers/first.ts";
import { forEachParallel } from "../consumers/forEach.ts";
import { groupByParallel } from "../consumers/groupBy.ts";
import { lastParallel } from "../consumers/last.ts";
import { maxByParallel } from "../consumers/maxBy.ts";
import { minByParallel } from "../consumers/minBy.ts";
import { reduceParallel } from "../consumers/reduce.ts";
import { someParallel } from "../consumers/some.ts";
import { sumByParallel } from "../consumers/sumBy.ts";
import { toArrayParallel } from "../consumers/toArray.ts";
import { toReversedParallel } from "../consumers/toReversed.ts";
import { toSetParallel } from "../consumers/toSet.ts";
import { toSortedParallel } from "../consumers/toSorted.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import type {
  IAsyncYieldedResolver,
  IYieldedResolver,
} from "./resolver.types.ts";

export class ParallelYieldedResolver<T> implements IAsyncYieldedResolver<T> {
  protected readonly generator: Disposable & IYieldedParallelGenerator<T>;

  protected constructor(
    parent:
      | undefined
      | (Disposable &
          (
            | IYieldedParallelGenerator
            | IYieldedIterator
            | IYieldedAsyncGenerator
          )),
    generator: IYieldedParallelGenerator<T>,
  ) {
    this.generator = Object.assign(generator, {
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
    cb: (...args: [IYieldedParallelGenerator<T>, ...TArgs]) => Promise<TReturn>,
    ...args: TArgs
  ): Promise<TReturn> {
    using generator = this.generator;
    return await cb(generator, ...args);
  }

  forEach(...args: Parameters<IAsyncYieldedResolver<T>["forEach"]>) {
    return this.#apply(forEachParallel, ...args);
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
    return this.#apply(reduceParallel, ...args);
  }

  toArray() {
    return this.#apply(toArrayParallel);
  }

  toSet() {
    return this.#apply(toSetParallel);
  }

  every(...args: Parameters<IAsyncYieldedResolver<T>["every"]>) {
    return this.#apply(everyParallel, ...args);
  }

  find<TOut extends T>(
    predicate: (next: T) => next is TOut,
  ): Promise<TOut | undefined>;
  find(predicate: (next: T) => unknown): Promise<T | undefined>;
  find(...args: Parameters<IAsyncYieldedResolver<T>["find"]>) {
    // @ts-expect-error
    return this.#apply(findParallel, ...args);
  }

  some(...args: Parameters<IAsyncYieldedResolver<T>["some"]>) {
    return this.#apply(someParallel, ...args);
  }

  toSorted(...args: Parameters<IYieldedResolver<T>["toSorted"]>) {
    return this.#apply(toSortedParallel, ...args);
  }

  toReversed() {
    return this.#apply(toReversedParallel);
  }

  minBy(...args: Parameters<IAsyncYieldedResolver<T>["minBy"]>) {
    return this.#apply(minByParallel, ...args);
  }

  maxBy(...args: Parameters<IAsyncYieldedResolver<T>["maxBy"]>) {
    return this.#apply(maxByParallel, ...args);
  }

  sumBy(...args: Parameters<IAsyncYieldedResolver<T>["sumBy"]>) {
    return this.#apply(sumByParallel, ...args);
  }

  count(...args: Parameters<IAsyncYieldedResolver<T>["count"]>) {
    return this.#apply(countParallel, ...args);
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

  groupBy(...args: unknown[]) {
    // @ts-expect-error
    return this.#apply(groupByParallel, ...args);
  }

  consume() {
    return this.#apply(consumeAsync);
  }

  first() {
    return this.#apply(firstParallel);
  }

  last() {
    return this.#apply(lastParallel);
  }
}
