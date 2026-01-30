import { AsyncYielded } from "./generators/AsyncYielded.ts";
import { awaited } from "./generators/next/awaited.ts";
import { batchSync } from "./generators/next/batch.ts";
import { chunkBySync } from "./generators/next/chunkBy.ts";
import { distinctBySync } from "./generators/next/distinctBy.ts";
import { distinctUntilChangedSync } from "./generators/next/distinctUntilChanged.ts";
import { dropLastSync } from "./generators/next/dropLast.ts";
import { dropWhileSync } from "./generators/next/dropWhile.ts";
import { flatSync } from "./generators/next/flat.ts";
import { flatMapSync } from "./generators/next/flatMap.ts";
import { liftSync } from "./generators/next/lift.ts";
import { reversedSync } from "./generators/next/reversed.ts";
import { sortedSync } from "./generators/next/sorted.ts";
import { takeSync } from "./generators/next/take.ts";
import { takeLastSync } from "./generators/next/takeLast.ts";
import { takeWhileSync } from "./generators/next/takeWhile.ts";
import { tapSync } from "./generators/next/tap.ts";
import { YieldedResolver } from "./resolvers/YieldedResolver.ts";
import type { IYieldedGenerator, IYieldedIterator } from "./shared.types.ts";
import type { IAsyncYielded, IYielded } from "./yielded.types.ts";

export class Yielded<T> extends YieldedResolver<T> implements IYielded<T> {
  private constructor(
    parent: undefined | (IYieldedIterator & Disposable),
    generator: IYieldedIterator<T>,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new Yielded<any>(
        undefined,
        source[Symbol.iterator]() as IYieldedIterator<any>,
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
      generator: IYieldedIterator<T>,
      ...args: TArgs
    ) => IYieldedIterator<TNext>,
    ...args: TArgs
  ): IYielded<TNext> {
    return new Yielded<TNext>(this.generator, next(this.generator, ...args));
  }

  filter<TOut extends T>(predicate: (next: T) => next is TOut): IYielded<TOut>;
  filter(predicate: (next: T) => unknown): IYielded<T>;
  filter(predicate: (next: T) => unknown) {
    return new Yielded(this.generator, this.generator.filter(predicate));
  }

  map<TOut>(mapper: (next: T) => TOut): IYielded<TOut> {
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

  distinctBy(...args: Parameters<IYielded<T>["distinctBy"]>) {
    return this.#next(distinctBySync, ...args);
  }

  distinctUntilChanged(
    ...args: Parameters<IYielded<T>["distinctUntilChanged"]>
  ) {
    return this.#next(distinctUntilChangedSync, ...args);
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
    ) => readonly TOut[] | Iterable<TOut> | TOut,
  ) {
    return this.#next(flatMapSync, flatMapper);
  }

  lift<TOut = never>(
    middleware: (
      generator: IYieldedGenerator<T, false>,
    ) => IYieldedGenerator<TOut, false>,
  ): IYielded<TOut> {
    return this.#next(liftSync, middleware);
  }

  dropLast(...args: Parameters<IYielded<T>["dropLast"]>) {
    return this.#next(dropLastSync, ...args);
  }

  dropWhile(...args: Parameters<IYielded<T>["dropWhile"]>) {
    return this.#next(dropWhileSync, ...args);
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
    return new AsyncYielded(this.generator, awaited(this.generator));
  }

  reversed() {
    return this.#next(reversedSync);
  }

  sorted(...args: Parameters<IYielded<T>["sorted"]>) {
    return this.#next(sortedSync, ...args);
  }
}
