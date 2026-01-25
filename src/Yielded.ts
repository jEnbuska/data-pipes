import { AsyncYielded } from "./AsyncYielded.ts";
import { distinctBySync } from "./generators/filters/distinctBy.ts";
import { distinctUntilChangedSync } from "./generators/filters/distinctUntilChanged.ts";
import { dropLastSync } from "./generators/filters/dropLast.ts";
import { dropWhileSync } from "./generators/filters/dropWhile.ts";
import { takeSync } from "./generators/filters/take.ts";
import { takeLastSync } from "./generators/filters/takeLast.ts";
import { takeWhileSync } from "./generators/filters/takeWhile.ts";
import { batchSync } from "./generators/grouppers/batch.ts";
import { chunkBySync } from "./generators/grouppers/chunkBy.ts";
import { awaited } from "./generators/misc/awaited.ts";
import { liftSync } from "./generators/misc/lift.ts";
import { mapSync } from "./generators/misc/map.ts";
import { tapSync } from "./generators/misc/tap.ts";
import { reversedSync } from "./generators/sorters/reversed.ts";
import { sortedSync } from "./generators/sorters/sorted.ts";
import { flatSync } from "./generators/spreaders/flat.ts";
import { flatMapSync } from "./generators/spreaders/flatMap.ts";
import { YieldedResolver } from "./resolvers/YieldedResolver.ts";
import type { IYielded, YieldedIterator, YieldedMiddlewares } from "./types.ts";

export class Yielded<TInput>
  extends YieldedResolver<TInput>
  implements IYielded<TInput>
{
  static from<TInput>(
    generatorFunction: () => Iterable<TInput, unknown, unknown>,
  ): Yielded<TInput>;
  static from<TInput>(
    iterable: Iterable<TInput, unknown, unknown>,
  ): Yielded<TInput>;
  static from<TInput>(data: TInput): Yielded<TInput>;
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

  batch(...args: Parameters<YieldedMiddlewares<TInput>["batch"]>) {
    return new Yielded<TInput[]>(batchSync(this.generator, ...args));
  }

  chunkBy(...args: Parameters<YieldedMiddlewares<TInput>["chunkBy"]>) {
    return new Yielded(chunkBySync(this.generator, ...args));
  }

  distinctBy(...args: Parameters<YieldedMiddlewares<TInput>["distinctBy"]>) {
    return new Yielded(distinctBySync(this.generator, ...args));
  }

  distinctUntilChanged(
    ...args: Parameters<YieldedMiddlewares<TInput>["distinctUntilChanged"]>
  ) {
    return new Yielded(distinctUntilChangedSync(this.generator, ...args));
  }

  filter(...args: Parameters<typeof this.generator.filter>) {
    return new Yielded(this.generator.filter(...args));
  }

  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Yielded<FlatArray<TInput[], Depth>> {
    return new Yielded(flatSync(this.generator, depth));
  }

  flatMap<TOutput>(callback: (value: TInput) => TOutput[] | TOutput) {
    return new Yielded(flatMapSync(this.generator, callback));
  }

  lift<TOutput = never>(
    middleware: (generator: YieldedIterator<TInput>) => Generator<TOutput>,
  ) {
    return new Yielded<TOutput>(liftSync(this.generator, middleware));
  }

  map<TOutput>(mapper: (next: TInput) => TOutput) {
    return new Yielded<TOutput>(mapSync(this.generator, mapper));
  }

  drop(...args: Parameters<YieldedMiddlewares<TInput>["drop"]>) {
    return new Yielded(this.generator.drop(...args));
  }

  dropLast(...args: Parameters<YieldedMiddlewares<TInput>["dropLast"]>) {
    return new Yielded(dropLastSync(this.generator, ...args));
  }

  dropWhile(...args: Parameters<YieldedMiddlewares<TInput>["dropWhile"]>) {
    return new Yielded(dropWhileSync(this.generator, ...args));
  }

  take(...args: Parameters<YieldedMiddlewares<TInput>["take"]>) {
    return new Yielded(takeSync(this.generator, ...args));
  }

  takeLast(...args: Parameters<YieldedMiddlewares<TInput>["takeLast"]>) {
    return new Yielded(takeLastSync(this.generator, ...args));
  }

  takeWhile(...args: Parameters<YieldedMiddlewares<TInput>["takeWhile"]>) {
    return new Yielded(takeWhileSync(this.generator, ...args));
  }

  tap(...args: Parameters<YieldedMiddlewares<TInput>["tap"]>) {
    return new Yielded(tapSync(this.generator, ...args));
  }

  awaited(): AsyncYielded<Awaited<TInput>> {
    return new AsyncYielded<Awaited<TInput>>(awaited(this.generator));
  }

  reversed() {
    return new Yielded(reversedSync(this.generator));
  }

  sorted(...args: Parameters<YieldedMiddlewares<TInput>["sorted"]>) {
    return new Yielded(sortedSync(this.generator, ...args));
  }
}
