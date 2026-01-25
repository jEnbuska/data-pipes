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
  IYielded,
  PromiseOrNot,
  YieldedAsyncGenerator,
  YieldedMiddlewares,
} from "./types.ts";

export class AsyncYielded<T>
  extends AsyncYieldedResolver<T>
  implements IYielded<T, true>
{
  private constructor(generator: YieldedAsyncGenerator<T>) {
    super(generator);
  }

  static from<T>(
    asyncGeneratorFunction: () => AsyncGenerator<T, unknown, unknown>,
  ): AsyncYielded<T>;
  static from<T>(
    asyncGenerator: AsyncGenerator<T, unknown, unknown>,
  ): AsyncYielded<T>;
  static from<T>(promise: Promise<T[]> | Promise<T>): AsyncYielded<T>;
  static from(source: any) {
    if (typeof source === "function") {
      source = source();
    }
    if (source[Symbol.asyncIterator]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new AsyncYielded<unknown>(source[Symbol.asyncIterator]());
    }
    if (source instanceof Promise) {
      return AsyncYielded.from(async function* () {
        const data = await source;
        if (data[Symbol.iterator]) yield* data;
        else yield data;
      });
    }
    return new AsyncYielded<any>(source as YieldedAsyncGenerator<any>);
  }

  batch(...args: Parameters<YieldedMiddlewares<T, true>["batch"]>) {
    return new AsyncYielded<T[]>(batchAsync(this.generator, ...args));
  }

  chunkBy(...args: Parameters<YieldedMiddlewares<T, true>["chunkBy"]>) {
    return new AsyncYielded(chunkByAsync(this.generator, ...args));
  }

  distinctBy(...args: Parameters<YieldedMiddlewares<T, true>["distinctBy"]>) {
    return new AsyncYielded(distinctByAsync(this.generator, ...args));
  }

  distinctUntilChanged(
    ...args: Parameters<YieldedMiddlewares<T, true>["distinctUntilChanged"]>
  ) {
    return new AsyncYielded(distinctUntilChangedAsync(this.generator, ...args));
  }

  filter(...args: Parameters<YieldedMiddlewares<T, true>["filter"]>) {
    return new AsyncYielded(filterAsync(this.generator, ...args));
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): AsyncYielded<FlatArray<T[], Depth>> {
    return new AsyncYielded(flatAsync(this.generator, depth));
  }

  flatMap<TOut>(
    callback: (
      value: T,
    ) => PromiseOrNot<
      TOut | readonly TOut[] | IteratorObject<TOut> | AsyncIteratorObject<TOut>
    >,
  ) {
    return new AsyncYielded(flatMapAsync(this.generator, callback));
  }

  lift<TOut = never>(
    middleware: (generator: YieldedAsyncGenerator<T>) => AsyncGenerator<TOut>,
  ) {
    return new AsyncYielded<TOut>(liftAsync(this.generator, middleware));
  }

  map<TOut>(mapper: (next: T) => PromiseOrNot<TOut>) {
    return new AsyncYielded<TOut>(mapAsync(this.generator, mapper));
  }

  drop(count: number) {
    if (count < 0) {
      throw new RangeError(`RangeError: ${count} must be positive`);
    }
    return new AsyncYielded(dropAsync(this.generator, count));
  }

  dropLast(...args: Parameters<YieldedMiddlewares<T, true>["dropLast"]>) {
    return new AsyncYielded(dropLastAsync(this.generator, ...args));
  }

  dropWhile(...args: Parameters<YieldedMiddlewares<T, true>["dropWhile"]>) {
    return new AsyncYielded(dropWhileAsync(this.generator, ...args));
  }

  take(...args: Parameters<YieldedMiddlewares<T, true>["take"]>) {
    return new AsyncYielded(takeAsync(this.generator, ...args));
  }

  takeLast(...args: Parameters<YieldedMiddlewares<T, true>["takeLast"]>) {
    return new AsyncYielded(takeLastAsync(this.generator, ...args));
  }

  takeWhile(...args: Parameters<YieldedMiddlewares<T, true>["takeWhile"]>) {
    return new AsyncYielded(takeWhileAsync(this.generator, ...args));
  }

  tap(...args: Parameters<YieldedMiddlewares<T, true>["tap"]>) {
    return new AsyncYielded(tapAsync(this.generator, ...args));
  }

  reversed() {
    return new AsyncYielded(reversedAsync(this.generator));
  }

  sorted(...args: Parameters<YieldedMiddlewares<T, true>["sorted"]>) {
    return new AsyncYielded(sortedAsync(this.generator, ...args));
  }

  parallel(...args: Parameters<IYielded<T, true>["parallel"]>) {
    return new AsyncYielded(parallel(this.generator, ...args));
  }
}
