import { ParallelYieldedResolver } from "../resolvers/ParallelYieldedResolver.ts";
import type { IYieldedIterableSource } from "../resolvers/resolver.types.ts";
import type {
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  MaybeAsync,
} from "../shared.types.ts";
import type { IAsyncYielded, IParallelYielded } from "../yielded.types.ts";
import { AsyncYielded } from "./AsyncYielded.ts";
import { parallelToAwaited } from "./next/awaited.ts";
import { batchParallel } from "./next/batch.ts";
import { chunkByParallel } from "./next/chunkBy.ts";
import { dropParallel } from "./next/drop.ts";
import { dropLastParallel } from "./next/dropLast.ts";
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
  implements IParallelYielded<T>
{
  public constructor(
    parent: Disposable &
      (
        | IYieldedParallelGenerator<any>
        | IYieldedIterator<any>
        | IYieldedAsyncGenerator<any>
      ),
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
  ): IParallelYielded<TNext> {
    return new ParallelYielded<TNext>(
      this.generator,
      next(this.generator, this._parallel, ...args),
      this._parallel,
    );
  }

  batch(...args: Parameters<IParallelYielded<T>["batch"]>) {
    return this.#next(batchParallel, ...args);
  }

  chunkBy(...args: Parameters<IParallelYielded<T>["chunkBy"]>) {
    return this.#next(chunkByParallel, ...args);
  }

  filter<TOut extends T>(fn: (next: T) => next is TOut): IParallelYielded<T>;

  filter(fn: (next: T) => any): IParallelYielded<T>;

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
    ) => MaybeAsync<
      readonly TOut[] | IYieldedIterableSource<TOut, "parallel"> | TOut
    >,
  ) {
    return this.#next(flatMapParallel, callback);
  }

  map<TOut>(mapper: (next: T, index: number) => MaybeAsync<TOut>) {
    return this.#next(mapParallel, mapper);
  }

  drop(count: number) {
    if (count < 0) {
      throw new RangeError(`RangeError: ${count} must be positive`);
    }
    return this.#next(dropParallel, count);
  }

  dropLast(...args: Parameters<IParallelYielded<T>["dropLast"]>) {
    return this.#next(dropLastParallel, ...args);
  }

  take(...args: Parameters<IParallelYielded<T>["take"]>) {
    return this.#next(takeParallel, ...args);
  }

  takeLast(...args: Parameters<IParallelYielded<T>["takeLast"]>) {
    return this.#next(takeLastParallel, ...args);
  }

  takeWhile(...args: Parameters<IParallelYielded<T>["takeWhile"]>) {
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

  lift<TOut>(middleware: any): IParallelYielded<TOut> {
    return new ParallelYielded<TOut>(
      this.generator,
      liftParallel(this.generator, middleware),
      this._parallel,
    );
  }

  awaited(): IAsyncYielded<Awaited<T>> {
    return new AsyncYielded<Awaited<T>>(
      this.generator,
      parallelToAwaited(this.generator, this._parallel),
    );
  }

  parallel(count: number): IParallelYielded<Awaited<T>> {
    return new ParallelYielded(
      this.generator,
      parallelUpdate(this.generator, this._parallel, count),
      count,
    );
  }
}
