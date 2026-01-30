import { AsyncYieldedResolver } from "../resolvers/AsyncYieldedResolver.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import type { IAsyncYielded } from "../yielded.types.ts";
import { batchAsync } from "./next/batch.ts";
import { chunkByAsync } from "./next/chunkBy.ts";
import { distinctByAsync } from "./next/distinctBy.ts";
import { distinctUntilChangedAsync } from "./next/distinctUntilChanged.ts";
import { dropAsync } from "./next/drop.ts";
import { dropLastAsync } from "./next/dropLast.ts";
import { dropWhileAsync } from "./next/dropWhile.ts";
import { filterAsync } from "./next/filter.ts";
import { flatAsync } from "./next/flat.ts";
import { flatMapAsync } from "./next/flatMap.ts";
import { liftAsync } from "./next/lift.ts";
import { mapAsync } from "./next/map.ts";
import { parallel } from "./next/parallel.ts";
import { reversedAsync } from "./next/reversed.ts";
import { sortedAsync } from "./next/sorted.ts";
import { takeAsync } from "./next/take.ts";
import { takeLastAsync } from "./next/takeLast.ts";
import { takeWhileAsync } from "./next/takeWhile.ts";
import { tapAsync } from "./next/tap.ts";
import { ParallelYielded } from "./ParallelYielded.ts";

export class AsyncYielded<T>
  extends AsyncYieldedResolver<T>
  implements IAsyncYielded<T>
{
  public constructor(
    parent:
      | undefined
      | (Disposable &
          (
            | IYieldedAsyncGenerator
            | IYieldedIterator
            | IYieldedParallelGenerator
          )),
    generator: IYieldedAsyncGenerator<T>,
  ) {
    super(parent, generator);
  }

  static from<T>(
    asyncGenerator: AsyncGenerator<T, unknown, unknown>,
  ): AsyncYielded<T>;
  static from<T>(promise: Promise<T[]> | Promise<T>): AsyncYielded<T>;
  static from(source: any) {
    if (typeof source === "function") {
      source = source();
    }
    if (source[Symbol.asyncIterator]) {
      return new AsyncYielded<unknown>(
        undefined, // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        source[Symbol.asyncIterator](),
      );
    }
    if (source instanceof Promise) {
      return AsyncYielded.from(
        (async function* () {
          yield* await source;
        })(),
      );
    }
    throw new TypeError(`Invalid Async generator source ${source}`);
  }

  #next<TNext, TArgs extends any[]>(
    next: (
      generator: IYieldedAsyncGenerator<T>,
      ...args: TArgs
    ) => IYieldedAsyncGenerator<TNext>,
    ...args: TArgs
  ) {
    return new AsyncYielded<TNext>(
      this.generator,
      next(this.generator, ...args),
    );
  }

  batch(...args: Parameters<IAsyncYielded<T>["batch"]>) {
    return this.#next(batchAsync, ...args);
  }

  chunkBy(...args: Parameters<IAsyncYielded<T>["chunkBy"]>) {
    return this.#next(chunkByAsync, ...args);
  }

  distinctBy(...args: Parameters<IAsyncYielded<T>["distinctBy"]>) {
    return this.#next(distinctByAsync, ...args);
  }

  distinctUntilChanged(
    ...args: Parameters<IAsyncYielded<T>["distinctUntilChanged"]>
  ) {
    return this.#next(distinctUntilChangedAsync, ...args);
  }

  filter<TOut extends T>(fn: (next: T) => next is TOut): AsyncYielded<TOut>;
  filter(fn: (next: T) => any): AsyncYielded<T>;
  filter(...args: unknown[]) {
    // @ts-expect-error
    return this.#next(filterAsync, ...args);
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): AsyncYielded<FlatArray<T[], Depth>> {
    return this.#next(flatAsync, depth);
  }

  flatMap<TOut>(
    callback: (
      value: T,
      index: number,
    ) => IPromiseOrNot<TOut | readonly TOut[] | IteratorObject<TOut>>,
  ) {
    return this.#next(flatMapAsync, callback);
  }

  lift<TOut = never>(
    middleware: (generator: IYieldedAsyncGenerator<T>) => AsyncGenerator<TOut>,
  ) {
    return this.#next(liftAsync, middleware);
  }

  map<TOut>(mapper: (next: T) => IPromiseOrNot<TOut>) {
    return this.#next(mapAsync, mapper);
  }

  drop(count: number) {
    if (count < 0) {
      throw new RangeError(`RangeError: ${count} must be positive`);
    }
    return this.#next(dropAsync, count);
  }

  dropLast(...args: Parameters<IAsyncYielded<T>["dropLast"]>) {
    return this.#next(dropLastAsync, ...args);
  }

  dropWhile(...args: Parameters<IAsyncYielded<T>["dropWhile"]>) {
    return this.#next(dropWhileAsync, ...args);
  }

  take(...args: Parameters<IAsyncYielded<T>["take"]>) {
    return this.#next(takeAsync, ...args);
  }

  takeLast(...args: Parameters<IAsyncYielded<T>["takeLast"]>) {
    return this.#next(takeLastAsync, ...args);
  }

  takeWhile(...args: Parameters<IAsyncYielded<T>["takeWhile"]>) {
    return this.#next(takeWhileAsync, ...args);
  }

  tap(...args: Parameters<IAsyncYielded<T>["tap"]>) {
    return this.#next(tapAsync, ...args);
  }

  reversed() {
    return this.#next(reversedAsync);
  }

  sorted(...args: Parameters<IAsyncYielded<T>["sorted"]>) {
    return this.#next(sortedAsync, ...args);
  }

  parallel(parallelCount: number): IAsyncYielded<T> {
    return new ParallelYielded<T>(
      this.generator,
      parallel(this.generator, parallelCount),
      parallelCount,
    );
  }
}
