import { distinctByAsync } from "./generators/filters/distinctBy.ts";
import { distinctUntilChangedAsync } from "./generators/filters/distinctUntilChanged.ts";
import { dropAsync } from "./generators/filters/drop.ts";
import { dropLastAsync } from "./generators/filters/dropLast.ts";
import { dropWhileAsync } from "./generators/filters/dropWhile.ts";
import { filterAsync } from "./generators/filters/filter.ts";
import { takeAsync } from "./generators/filters/take.ts";
import { takeLastAsync } from "./generators/filters/takeLast.ts";
import { takeWhileAsync } from "./generators/filters/takeWhile.ts";
import { batchAsync } from "./generators/grouppers/batch.ts";
import { chunkByAsync } from "./generators/grouppers/chunkBy.ts";
import { liftAsync } from "./generators/misc/lift.ts";
import { mapAsync } from "./generators/misc/map.ts";
import { parallel } from "./generators/misc/parallel.ts";
import { tapAsync } from "./generators/misc/tap.ts";
import { reversedAsync } from "./generators/sorters/reversed.ts";
import { sortedAsync } from "./generators/sorters/sorted.ts";
import { flatAsync } from "./generators/spreaders/flat.ts";
import { flatMapAsync } from "./generators/spreaders/flatMap.ts";
import { AsyncYieldedResolver } from "./resolvers/AsyncYieldedResolver.ts";
import type {
  IYielded,
  YieldedAsyncGenerator,
  YieldedMiddlewares,
} from "./types.ts";

export class AsyncYielded<TInput>
  extends AsyncYieldedResolver<TInput>
  implements IYielded<TInput, true>
{
  static from<TInput>(
    asyncGeneratorFunction: () => AsyncGenerator<TInput, unknown, unknown>,
  ): AsyncYielded<TInput>;
  static from<TInput>(
    asyncGenerator: AsyncGenerator<TInput, unknown, unknown>,
  ): AsyncYielded<TInput>;
  static from<TInput>(
    promise: Promise<TInput[]> | Promise<TInput>,
  ): AsyncYielded<TInput>;
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

  batch(...args: Parameters<YieldedMiddlewares<TInput, true>["batch"]>) {
    return new AsyncYielded<TInput[]>(batchAsync(this.generator, ...args));
  }

  chunkBy(...args: Parameters<YieldedMiddlewares<TInput, true>["chunkBy"]>) {
    return new AsyncYielded(chunkByAsync(this.generator, ...args));
  }

  distinctBy(
    ...args: Parameters<YieldedMiddlewares<TInput, true>["distinctBy"]>
  ) {
    return new AsyncYielded(distinctByAsync(this.generator, ...args));
  }

  distinctUntilChanged(
    ...args: Parameters<
      YieldedMiddlewares<TInput, true>["distinctUntilChanged"]
    >
  ) {
    return new AsyncYielded(distinctUntilChangedAsync(this.generator, ...args));
  }

  filter(...args: Parameters<YieldedMiddlewares<TInput, true>["filter"]>) {
    return new AsyncYielded(filterAsync(this.generator, ...args));
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): AsyncYielded<FlatArray<TInput[], Depth>> {
    return new AsyncYielded(flatAsync(this.generator, depth));
  }

  flatMap<TOutput>(
    callback: (
      value: TInput,
    ) => Promise<TOutput[]> | Promise<TOutput> | TOutput[] | TOutput,
  ) {
    return new AsyncYielded(flatMapAsync(this.generator, callback));
  }

  lift<TOutput = never>(
    middleware: (
      generator: YieldedAsyncGenerator<TInput>,
    ) => AsyncGenerator<TOutput>,
  ) {
    return new AsyncYielded<TOutput>(liftAsync(this.generator, middleware));
  }

  map<TOutput>(mapper: (next: TInput) => Promise<TOutput> | TOutput) {
    return new AsyncYielded<TOutput>(mapAsync(this.generator, mapper));
  }

  drop(count: number) {
    if (count < 0) {
      throw new RangeError(`RangeError: ${count} must be positive`);
    }
    return new AsyncYielded(dropAsync(this.generator, count));
  }

  dropLast(...args: Parameters<YieldedMiddlewares<TInput, true>["dropLast"]>) {
    return new AsyncYielded(dropLastAsync(this.generator, ...args));
  }

  dropWhile(
    ...args: Parameters<YieldedMiddlewares<TInput, true>["dropWhile"]>
  ) {
    return new AsyncYielded(dropWhileAsync(this.generator, ...args));
  }

  take(...args: Parameters<YieldedMiddlewares<TInput, true>["take"]>) {
    return new AsyncYielded(takeAsync(this.generator, ...args));
  }

  takeLast(...args: Parameters<YieldedMiddlewares<TInput, true>["takeLast"]>) {
    return new AsyncYielded(takeLastAsync(this.generator, ...args));
  }

  takeWhile(
    ...args: Parameters<YieldedMiddlewares<TInput, true>["takeWhile"]>
  ) {
    return new AsyncYielded(takeWhileAsync(this.generator, ...args));
  }

  tap(...args: Parameters<YieldedMiddlewares<TInput, true>["tap"]>) {
    return new AsyncYielded(tapAsync(this.generator, ...args));
  }

  reversed() {
    return new AsyncYielded(reversedAsync(this.generator));
  }

  sorted(...args: Parameters<YieldedMiddlewares<TInput, true>["sorted"]>) {
    return new AsyncYielded(sortedAsync(this.generator, ...args));
  }

  parallel(...args: Parameters<IYielded<TInput, true>["parallel"]>) {
    return new AsyncYielded(parallel(this.generator, ...args));
  }
}
