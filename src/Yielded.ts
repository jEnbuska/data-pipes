import { AsyncYielded } from "./AsyncYielded.ts";
import { awaited } from "./middlewares/awaited.ts";
import { batchSync } from "./middlewares/batch.ts";
import { chunkBySync } from "./middlewares/chunkBy.ts";
import { distinctBySync } from "./middlewares/distinctBy.ts";
import { distinctUntilChangedSync } from "./middlewares/distinctUntilChanged.ts";
import { dropLastSync } from "./middlewares/dropLast.ts";
import { dropWhileSync } from "./middlewares/dropWhile.ts";
import { flatSync } from "./middlewares/flat.ts";
import { flatMapSync } from "./middlewares/flatMap.ts";
import { liftSync } from "./middlewares/lift.ts";
import { mapSync } from "./middlewares/map.ts";
import { reversedSync } from "./middlewares/reversed.ts";
import { sortedSync } from "./middlewares/sorted.ts";
import { takeSync } from "./middlewares/take.ts";
import { takeLastSync } from "./middlewares/takeLast.ts";
import { takeWhileSync } from "./middlewares/takeWhile.ts";
import { tapSync } from "./middlewares/tap.ts";
import { YieldedResolver } from "./resolvers/YieldedResolver.ts";
import type { IYielded, YieldedIterator, YieldedMiddlewares } from "./types.ts";

export class Yielded<T> extends YieldedResolver<T> implements IYielded<T> {
  private constructor(generator: YieldedIterator<T>) {
    super(generator);
  }

  static from<T>(
    generatorFunction: () => Iterable<T, unknown, unknown>,
  ): Yielded<T>;
  static from<T>(iterable: Iterable<T, unknown, unknown>): Yielded<T>;
  static from<T>(data: T): Yielded<T>;
  static from(source: any) {
    if (typeof source === "function") {
      source = source();
    }
    if (source[Symbol.iterator]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return new Yielded<any>(source[Symbol.iterator]());
    }
    return new Yielded<any>(Iterator.from([source]));
  }

  batch(...args: Parameters<YieldedMiddlewares<T>["batch"]>) {
    return new Yielded<T[]>(batchSync(this.generator, ...args));
  }

  chunkBy(...args: Parameters<YieldedMiddlewares<T>["chunkBy"]>) {
    return new Yielded(chunkBySync(this.generator, ...args));
  }

  distinctBy(...args: Parameters<YieldedMiddlewares<T>["distinctBy"]>) {
    return new Yielded(distinctBySync(this.generator, ...args));
  }

  distinctUntilChanged(
    ...args: Parameters<YieldedMiddlewares<T>["distinctUntilChanged"]>
  ) {
    return new Yielded(distinctUntilChangedSync(this.generator, ...args));
  }

  filter(...args: Parameters<typeof this.generator.filter>) {
    return new Yielded(this.generator.filter(...args));
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Yielded<FlatArray<T[], Depth>> {
    return new Yielded(flatSync(this.generator, depth));
  }

  flatMap<TOut>(
    callback: (value: T) => TOut | readonly TOut[] | IteratorObject<TOut>,
  ) {
    return new Yielded(flatMapSync(this.generator, callback));
  }

  lift<TOut = never>(
    middleware: (generator: YieldedIterator<T>) => Generator<TOut>,
  ) {
    return new Yielded<TOut>(liftSync(this.generator, middleware));
  }

  map<TOut>(mapper: (next: T) => TOut) {
    return new Yielded<TOut>(mapSync(this.generator, mapper));
  }

  drop(...args: Parameters<YieldedMiddlewares<T>["drop"]>) {
    return new Yielded(this.generator.drop(...args));
  }

  dropLast(...args: Parameters<YieldedMiddlewares<T>["dropLast"]>) {
    return new Yielded(dropLastSync(this.generator, ...args));
  }

  dropWhile(...args: Parameters<YieldedMiddlewares<T>["dropWhile"]>) {
    return new Yielded(dropWhileSync(this.generator, ...args));
  }

  take(...args: Parameters<YieldedMiddlewares<T>["take"]>) {
    return new Yielded(takeSync(this.generator, ...args));
  }

  takeLast(...args: Parameters<YieldedMiddlewares<T>["takeLast"]>) {
    return new Yielded(takeLastSync(this.generator, ...args));
  }

  takeWhile(...args: Parameters<YieldedMiddlewares<T>["takeWhile"]>) {
    return new Yielded(takeWhileSync(this.generator, ...args));
  }

  tap(...args: Parameters<YieldedMiddlewares<T>["tap"]>) {
    return new Yielded(tapSync(this.generator, ...args));
  }

  awaited(): AsyncYielded<Awaited<T>> {
    return AsyncYielded.from(awaited(this.generator));
  }

  reversed() {
    return new Yielded(reversedSync(this.generator));
  }

  sorted(...args: Parameters<YieldedMiddlewares<T>["sorted"]>) {
    return new Yielded(sortedSync(this.generator, ...args));
  }
}
