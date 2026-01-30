import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import { consumeParallel } from "./apply/consume.ts";
import { countParallel } from "./apply/count.ts";
import { everyParallel } from "./apply/every.ts";
import { findParallel } from "./apply/find.ts";
import { firstParallel } from "./apply/first.ts";
import { forEachParallel } from "./apply/forEach.ts";
import { groupByParallel } from "./apply/groupBy.ts";
import { lastParallel } from "./apply/last.ts";
import { maxByParallel } from "./apply/maxBy.ts";
import { minByParallel } from "./apply/minBy.ts";
import { reduceParallel } from "./apply/reduce.ts";
import { someParallel } from "./apply/some.ts";
import { sumByParallel } from "./apply/sumBy.ts";
import { toArrayParallel } from "./apply/toArray.ts";
import { toReversedParallel } from "./apply/toReversed.ts";
import { toSetParallel } from "./apply/toSet.ts";
import { toSortedParallel } from "./apply/toSorted.ts";
import type {
  IAsyncYieldedResolver,
  IYieldedResolver,
} from "./resolver.types.ts";

export class ParallelYieldedResolver<T> implements IAsyncYieldedResolver<T> {
  protected readonly generator: Disposable & IYieldedParallelGenerator<T>;
  protected parallelCount: number;

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
    parallelCount: number,
  ) {
    this.parallelCount = parallelCount;
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

  async #apply<TReturn, TArgs extends any[]>(
    cb: (
      generator: IYieldedParallelGenerator<T>,
      parallel: number,
      ...args: TArgs
    ) => Promise<TReturn>,
    ...args: TArgs
  ): Promise<TReturn> {
    using generator = this.generator;
    return await cb(generator, this.parallelCount, ...args);
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
    return this.#apply(consumeParallel);
  }

  first() {
    return this.#apply(firstParallel<T>);
  }

  last() {
    return this.#apply(lastParallel<T>);
  }
}
