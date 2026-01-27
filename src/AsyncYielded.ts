import { batchAsync } from "./middlewares/batch.ts";
import { chunkByAsync } from "./middlewares/chunkBy.ts";
import { distinctByAsync } from "./middlewares/distinctBy.ts";
import { distinctUntilChangedAsync } from "./middlewares/distinctUntilChanged.ts";
import { dropAsync } from "./middlewares/drop.ts";
import { dropLastAsync } from "./middlewares/dropLast.ts";
import { dropWhileAsync } from "./middlewares/dropWhile.ts";
import { filterAsync } from "./middlewares/filter.ts";
import { flatAsync } from "./middlewares/flat.ts";
import { flatMapAsync } from "./middlewares/flatMap.ts";
import { liftAsync } from "./middlewares/lift.ts";
import { mapAsync } from "./middlewares/map.ts";
import { parallel } from "./middlewares/parallel.ts";
import { reversedAsync } from "./middlewares/reversed.ts";
import { sortedAsync } from "./middlewares/sorted.ts";
import { takeAsync } from "./middlewares/take.ts";
import { takeLastAsync } from "./middlewares/takeLast.ts";
import { takeWhileAsync } from "./middlewares/takeWhile.ts";
import { tapAsync } from "./middlewares/tap.ts";
import { AsyncYieldedResolver } from "./resolvers/AsyncYieldedResolver.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
} from "./shared.types.ts";
import type { IAsyncYielded } from "./yielded.types.ts";

export class AsyncYielded<T>
  extends AsyncYieldedResolver<T>
  implements IAsyncYielded<T>
{
  public constructor(
    parent:
      | undefined
      | (Disposable & (IYieldedAsyncGenerator | IYieldedIterator)),
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

  parallel(...args: Parameters<IAsyncYielded<T>["parallel"]>) {
    return this.#next(parallel, ...args) as any;
  }
}
