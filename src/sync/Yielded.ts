import { AsyncYielded } from "../async/AsyncYielded.ts";
import type { IAsyncYielded } from "../async/types.ts";
import type { IYieldedIterableSource } from "../general/types.ts";
import { syncToAwaited } from "../generators/apply/awaited.ts";
import { batchSync } from "../generators/apply/batch.ts";
import { chunkBySync } from "../generators/apply/chunkBy.ts";
import { dropLastSync } from "../generators/apply/dropLast.ts";
import { flatSync } from "../generators/apply/flat.ts";
import { flatMapSync } from "../generators/apply/flatMap.ts";
import { liftSync } from "../generators/apply/lift.ts";
import { mapPairwiseSync } from "../generators/apply/mapPairwise.ts";
import { parallel } from "../generators/apply/parallel.ts";
import { reversedSync } from "../generators/apply/reversed.ts";
import { sortedSync } from "../generators/apply/sorted.ts";
import { takeSync } from "../generators/apply/take.ts";
import { takeLastSync } from "../generators/apply/takeLast.ts";
import { takeWhileSync } from "../generators/apply/takeWhile.ts";
import { tapSync } from "../generators/apply/tap.ts";
import type { IYieldedSyncGenerator } from "../generators/sync/types.ts";
import type { IYieldedGenerator } from "../generators/types.ts";
import { ParallelYielded } from "../parallel/ParallelYielded.ts";
import type { IParallelYielded } from "../parallel/types.ts";
import { YieldedResolver } from "../resolvers/sync/YieldedResolver.ts";
import type { IYielded } from "./types.ts";

export class Yielded<T> extends YieldedResolver<T> implements IYielded<T> {
  private constructor(
    parent: undefined | (IYieldedSyncGenerator & Disposable),
    generator: IYieldedSyncGenerator<T>,
  ) {
    super(parent, generator);
  }

  /** Creates Yielded from a callback that returns an Iterable
   * @example (with generator function)
   * Yielded.from(function *(){
   *   yield 1;
   *   yield 2;
   *   yield 3;
   * })
   * */
  static from<T>(
    generatorFunction: () => Iterable<T, unknown, unknown>,
  ): IYielded<T>;

  static from<T>(
    asyncGeneratorFunction: () => AsyncGenerator<T, unknown, unknown>,
  ): IAsyncYielded<T>;

  static from<T>(
    asyncFunction: Promise<T[]> | Promise<T> | (() => Promise<T[] | T>),
  ): IAsyncYielded<T>;

  /** Creates Yielded from an Iterable
   * @example from array
   * Yielded.from([1,2,3])
   *
   * @example from generator
   * Yielded.from(generatorFunction())
   * */
  static from<T>(iterable: Iterable<T, unknown, unknown>): IYielded<T>;

  /** Creates Yielded from something else than and Iterable or callback returning Iterable
   * @example from something else
   * Yielded.from(data)
   * */
  static from<T>(data: T): IYielded<T>;

  static from(source: any) {
    if (typeof source === "function") {
      source = source();
    }
    if (source?.[Symbol.iterator]) {
      return new Yielded<any>(
        undefined,
        source[Symbol.iterator]() as IYieldedSyncGenerator<any>,
      ) as IYielded<any>;
    }
    if (source?.[Symbol.asyncIterator]) {
      return AsyncYielded.from(
        source as AsyncGenerator<any, unknown, unknown>,
      ) as IAsyncYielded<any>;
    }
    if (source && source instanceof Promise) {
      return AsyncYielded.from(source) as IAsyncYielded<any>;
    }
    return new Yielded<any>(
      undefined,
      Iterator.from([source]),
    ) as IYielded<any>;
  }

  #next<TNext, TArgs extends any[]>(
    next: (
      generator: IYieldedSyncGenerator<T>,
      ...args: TArgs
    ) => IYieldedSyncGenerator<TNext>,
    ...args: TArgs
  ): IYielded<TNext> {
    return new Yielded<TNext>(this.generator, next(this.generator, ...args));
  }

  filter<TOut extends T>(
    predicate: (next: T, index: number) => next is TOut,
  ): IYielded<TOut>;

  filter(predicate: (next: T, index: number) => unknown): IYielded<T>;

  filter(predicate: (next: T, index: number) => unknown) {
    return new Yielded(this.generator, this.generator.filter(predicate));
  }

  map<TOut>(mapper: (next: T, index: number) => TOut): IYielded<TOut> {
    return new Yielded(this.generator, this.generator.map(mapper));
  }

  drop(...args: Parameters<IYielded<T>["drop"]>): IYielded<T> {
    return new Yielded(this.generator, this.generator.drop(...args));
  }

  batch(...args: Parameters<IYielded<T>["batch"]>) {
    return this.#next(batchSync, ...args);
  }

  chunkBy(...args: Parameters<IYielded<T>["chunkBy"]>) {
    return this.#next(chunkBySync, ...args);
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): IYielded<FlatArray<T[], Depth>> {
    return this.#next(flatSync, depth);
  }

  flatMap<TOut>(
    flatMapper: (
      next: T,
      index: number,
    ) => readonly TOut[] | IYieldedIterableSource<TOut, "sync"> | TOut,
  ) {
    return this.#next(flatMapSync, flatMapper);
  }

  lift<TOut = never>(
    middleware: (
      generator: IYieldedGenerator<T, "sync">,
    ) => IYieldedGenerator<TOut, "sync">,
  ): IYielded<TOut> {
    return this.#next(liftSync, middleware);
  }

  dropLast(...args: Parameters<IYielded<T>["dropLast"]>) {
    return this.#next(dropLastSync, ...args);
  }

  take(...args: Parameters<IYielded<T>["take"]>) {
    return this.#next(takeSync, ...args);
  }

  takeLast(...args: Parameters<IYielded<T>["takeLast"]>) {
    return this.#next(takeLastSync, ...args);
  }

  takeWhile(...args: Parameters<IYielded<T>["takeWhile"]>) {
    return this.#next(takeWhileSync, ...args);
  }

  tap(...args: Parameters<IYielded<T>["tap"]>) {
    return this.#next(tapSync, ...args);
  }

  awaited(): IAsyncYielded<Awaited<T>> {
    return new AsyncYielded<Awaited<T>>(
      this.generator,
      syncToAwaited(this.generator),
    );
  }

  reversed() {
    return this.#next(reversedSync);
  }

  sorted(...args: Parameters<IYielded<T>["sorted"]>) {
    return this.#next(sortedSync, ...args);
  }

  parallel(count: number): IParallelYielded<Awaited<T>> {
    return new ParallelYielded<Awaited<T>>(
      this.generator,
      parallel(this.generator, count),
      count,
    );
  }

  mapPairwise<TOut>(mapper: (previous: T, next: T) => TOut) {
    return this.#next(mapPairwiseSync, mapper);
  }
}
