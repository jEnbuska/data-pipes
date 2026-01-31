import { ParallelYieldedResolver } from "../resolvers/ParallelYieldedResolver.ts";
import type { IYieldedIterable } from "../resolvers/resolver.types.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
} from "../shared.types.ts";
import type { IAsyncYielded } from "../yielded.types.ts";
import { AsyncYielded } from "./AsyncYielded.ts";
import { parallelToAwaited } from "./next/awaited.ts";
import { batchParallel } from "./next/batch.ts";
import { chunkByParallel } from "./next/chunkBy.ts";
import { distinctByParallel } from "./next/distinctBy.ts";
import { distinctUntilChangedParallel } from "./next/distinctUntilChanged.ts";
import { dropParallel } from "./next/drop.ts";
import { dropLastParallel } from "./next/dropLast.ts";
import { dropWhileParallel } from "./next/dropWhile.ts";
import { filterParallel } from "./next/filter.ts";
import { flatParallel } from "./next/flat.ts";
import { flatMapParallel } from "./next/flatMap.ts";
import { liftParallel } from "./next/lift.ts";
import { mapParallel } from "./next/map.ts";
import { parallelUpdate } from "./next/parallel.ts";
import { reversedParallel } from "./next/reversed.ts";
import { sortedParallel } from "./next/sorted.ts";
import { takeParallel } from "./next/take.ts";
import { takeLastParallel } from "./next/takeLast.ts";
import { takeWhileParallel } from "./next/takeWhile.ts";
import { tapParallel } from "./next/tap.ts";

export class ParallelYielded<T>
  extends ParallelYieldedResolver<T>
  implements IAsyncYielded<T>
{
  public constructor(
    parent: Disposable &
      (IYieldedParallelGenerator | IYieldedIterator | IYieldedAsyncGenerator),
    generator: IYieldedParallelGenerator<T>,
    parallel: number,
  ) {
    super(parent, generator, parallel);
  }

  #next<TNext, TArgs extends any[]>(
    next: (
      generator: IYieldedParallelGenerator<T>,
      parallel: number,
      ...args: TArgs
    ) => IYieldedParallelGenerator<TNext>,
    ...args: TArgs
  ): IAsyncYielded<TNext> {
    return new ParallelYielded<TNext>(
      this.generator,
      next(this.generator, this._parallel, ...args),
      this._parallel,
    );
  }

  batch(...args: Parameters<IAsyncYielded<T>["batch"]>) {
    return this.#next(batchParallel, ...args);
  }

  chunkBy(...args: Parameters<IAsyncYielded<T>["chunkBy"]>) {
    return this.#next(chunkByParallel, ...args);
  }

  distinctBy(...args: Parameters<IAsyncYielded<T>["distinctBy"]>) {
    return this.#next(distinctByParallel, ...args);
  }

  distinctUntilChanged(
    ...args: Parameters<IAsyncYielded<T>["distinctUntilChanged"]>
  ) {
    return this.#next(distinctUntilChangedParallel, ...args);
  }

  filter<TOut extends T>(fn: (next: T) => next is TOut): IAsyncYielded<T>;
  filter(fn: (next: T) => any): IAsyncYielded<T>;
  filter(...args: unknown[]) {
    // @ts-expect-error
    return this.#next(filterParallel, ...args);
  }

  flat<Depth extends number = 1>(depth?: Depth) {
    return this.#next(flatParallel, depth);
  }

  flatMap<TOut>(
    callback: (
      value: T,
      index: number,
    ) => IPromiseOrNot<readonly TOut[] | IYieldedIterable<TOut, true> | TOut>,
  ) {
    return this.#next(flatMapParallel, callback);
  }

  map<TOut>(mapper: (next: T) => IPromiseOrNot<TOut>) {
    return this.#next(mapParallel, mapper);
  }

  drop(count: number) {
    if (count < 0) {
      throw new RangeError(`RangeError: ${count} must be positive`);
    }
    return this.#next(dropParallel, count);
  }

  dropLast(...args: Parameters<IAsyncYielded<T>["dropLast"]>) {
    return this.#next(dropLastParallel, ...args);
  }

  dropWhile(...args: Parameters<IAsyncYielded<T>["dropWhile"]>) {
    return this.#next(dropWhileParallel, ...args);
  }

  take(...args: Parameters<IAsyncYielded<T>["take"]>) {
    return this.#next(takeParallel, ...args);
  }

  takeLast(...args: Parameters<IAsyncYielded<T>["takeLast"]>) {
    return this.#next(takeLastParallel, ...args);
  }

  takeWhile(...args: Parameters<IAsyncYielded<T>["takeWhile"]>) {
    return this.#next(takeWhileParallel, ...args);
  }

  tap(...args: Parameters<IAsyncYielded<T>["tap"]>) {
    return this.#next(tapParallel, ...args);
  }

  reversed() {
    return this.#next(reversedParallel);
  }

  sorted(...args: Parameters<IAsyncYielded<T>["sorted"]>) {
    return this.#next(sortedParallel, ...args);
  }

  lift<TOut>(middleware: any): IAsyncYielded<TOut> {
    return new ParallelYielded<TOut>(
      this.generator,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      liftParallel(this.generator, this._parallel, middleware),
      this._parallel,
    ) as any;
  }

  parallel(count: number): IAsyncYielded<T> {
    if (count === 1) {
      return new AsyncYielded(
        this.generator,
        parallelToAwaited(this.generator, this._parallel),
      );
    }
    return new ParallelYielded<T>(
      this.generator,
      parallelUpdate(this.generator, this._parallel),
      count,
    );
  }
}
