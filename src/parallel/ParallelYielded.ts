import { AsyncYielded } from "../async/AsyncYielded.ts";
import type { IAsyncYielded } from "../async/types.ts";
import type { IMaybeAsync, IYieldedIterableSource } from "../general/types.ts";
import { parallelToAwaited } from "../generators/apply/awaited.ts";
import { batchParallel } from "../generators/apply/batch.ts";
import { chunkByParallel } from "../generators/apply/chunkBy.ts";
import { dropParallel } from "../generators/apply/drop.ts";
import { dropLastParallel } from "../generators/apply/dropLast.ts";
import { filterParallel } from "../generators/apply/filter.ts";
import { flatParallel } from "../generators/apply/flat.ts";
import { flatMapParallel } from "../generators/apply/flatMap.ts";
import { liftParallel } from "../generators/apply/lift.ts";
import { mapParallel } from "../generators/apply/map.ts";
import { mapPairwiseParallel } from "../generators/apply/mapPairwise.ts";
import { parallelUpdate } from "../generators/apply/parallel.ts";
import { reversedParallel } from "../generators/apply/reversed.ts";
import { sortedParallel } from "../generators/apply/sorted.ts";
import { takeParallel } from "../generators/apply/take.ts";
import { takeLastParallel } from "../generators/apply/takeLast.ts";
import { takeWhileParallel } from "../generators/apply/takeWhile.ts";
import { tapParallel } from "../generators/apply/tap.ts";
import type { IYieldedAsyncGenerator } from "../generators/async/types.ts";
import type { IYieldedParallelGenerator } from "../generators/parallel/types.ts";
import type { IYieldedSyncGenerator } from "../generators/sync/types.ts";
import { ParallelYieldedResolver } from "../resolvers/parallel/ParallelYieldedResolver.ts";
import type { IParallelYielded } from "./types.ts";

export class ParallelYielded<T>
  extends ParallelYieldedResolver<T>
  implements IParallelYielded<T>
{
  public constructor(
    parent: Disposable &
      (
        | IYieldedParallelGenerator<any>
        | IYieldedSyncGenerator<any>
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
    ) => IMaybeAsync<
      readonly TOut[] | IYieldedIterableSource<TOut, "parallel"> | TOut
    >,
  ) {
    return this.#next(flatMapParallel, callback);
  }

  map<TOut>(mapper: (next: T, index: number) => IMaybeAsync<TOut>) {
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

  mapPairwise<TOut>(mapper: (previous: T, next: T) => IMaybeAsync<TOut>) {
    return this.#next(mapPairwiseParallel, mapper);
  }
}
