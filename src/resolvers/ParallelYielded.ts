import { awaitedParallel } from "../middlewares/awaited.ts";
import { batchParallel } from "../middlewares/batch.ts";
import { chunkByParallel } from "../middlewares/chunkBy.ts";
import { distinctByParallel } from "../middlewares/distinctBy.ts";
import { distinctUntilChangedParallel } from "../middlewares/distinctUntilChanged.ts";
import { dropParallel } from "../middlewares/drop.ts";
import { dropLastParallel } from "../middlewares/dropLast.ts";
import { dropWhileParallel } from "../middlewares/dropWhile.ts";
import { filterParallel } from "../middlewares/filter.ts";
import { flatParallel } from "../middlewares/flat.ts";
import { flatMapParallel } from "../middlewares/flatMap.ts";
import { liftParallel } from "../middlewares/lift.ts";
import { mapParallel } from "../middlewares/map.ts";
import { parallelParallel } from "../middlewares/parallelAsync.ts";
import { reversedParallel } from "../middlewares/reversed.ts";
import { sortedParallel } from "../middlewares/sorted.ts";
import { takeParallel } from "../middlewares/take.ts";
import { takeLastParallel } from "../middlewares/takeLast.ts";
import { takeWhileParallel } from "../middlewares/takeWhile.ts";
import { tapParallel } from "../middlewares/tap.ts";
import type {
  IPromiseOrNot,
  IYieldedAsyncGenerator,
  IYieldedIterator,
  IYieldedParallelGenerator,
  IYieldedParallelGeneratorOnNext,
} from "../shared.types.ts";
import type { IAsyncYielded } from "../yielded.types.ts";
import { AsyncYielded } from "./AsyncYielded.ts";
import { ParallelYieldedResolver } from "./ParallelYieldedResolver.ts";
import { YieldedParallelGenerator } from "./YieldedParallelGenerator.ts";

export class ParallelYielded<T>
  extends ParallelYieldedResolver<T>
  implements IAsyncYielded<T>
{
  public constructor(
    parent: Disposable &
      (IYieldedParallelGenerator | IYieldedIterator | IYieldedAsyncGenerator),
    generator: IYieldedParallelGenerator<T>,
  ) {
    super(parent, generator);
  }

  #next<TNext, TArgs extends any[]>(
    next: (
      generator: IYieldedParallelGenerator<T>,
      ...args: TArgs
    ) => IYieldedParallelGeneratorOnNext<TNext>,
    ...args: TArgs
  ): IAsyncYielded<TNext> {
    return new ParallelYielded<TNext>(
      this.generator,
      new YieldedParallelGenerator(next(this.generator, ...args)),
    ) as any;
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
    ) => IPromiseOrNot<TOut | readonly TOut[] | IteratorObject<TOut>>,
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

  lift<TOut>(
    middleware: (generator: IYieldedAsyncGenerator<T>) => AsyncGenerator<TOut>,
  ): IAsyncYielded<TOut> {
    return new ParallelYielded<TOut>(
      this.generator,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      liftParallel(this.generator, middleware as unknown as any),
    ) as any;
  }

  parallel(
    ...args: Parameters<IAsyncYielded<T>["parallel"]>
  ): IAsyncYielded<T> {
    return new ParallelYielded<T>(
      this.generator,
      parallelParallel(this.generator, ...args),
    ) as any;
  }

  awaited(): IAsyncYielded<T> {
    return new AsyncYielded(this.generator, awaitedParallel(this.generator));
  }
}
