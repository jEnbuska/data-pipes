import { countAsync } from "../consumers/count.ts";
import { countByAsync } from "../consumers/countBy.ts";
import { everyAsync } from "../consumers/every.ts";
import { findAsync } from "../consumers/find.ts";
import { forEachAsync } from "../consumers/forEach.ts";
import { groupByAsync } from "../consumers/groupBy.ts";
import { maxByAsync } from "../consumers/maxBy.ts";
import { minByAsync } from "../consumers/minBy.ts";
import { reduceAsync } from "../consumers/reduce.ts";
import { someAsync } from "../consumers/some.ts";
import { toArrayAsync } from "../consumers/toArray.ts";
import type {
  YieldedAsyncGenerator,
  YieldedConsumers,
  YieldedSyncMiddlewares,
} from "../types.ts";

export function asyncConsumers<TOutput>(
  generator: YieldedAsyncGenerator<TOutput>,
): YieldedConsumers<true, TOutput> {
  return {
    async *[Symbol.asyncIterator]() {
      for await (const next of generator) {
        yield next;
      }
    },
    forEach(cb) {
      return forEachAsync(generator, cb);
    },
    count() {
      return countAsync(generator);
    },
    countBy(fn) {
      return countByAsync(generator, fn);
    },
    every(predicate) {
      return everyAsync(generator, predicate) satisfies Promise<boolean> as
        | Promise<false>
        | Promise<true>;
    },
    find(predicate: (next: TOutput, index: number) => unknown) {
      return findAsync(generator, predicate);
    },
    groupBy(...args: unknown[]) {
      // @ts-expect-error
      return groupByAsync(generator, ...args) as any;
    },
    maxBy(callback) {
      return maxByAsync(generator, callback) as any;
    },
    minBy(callback) {
      return minByAsync(generator, callback);
    },
    reduce(...args: Parameters<YieldedSyncMiddlewares<TOutput>>["reduce"]) {
      return reduceAsync(generator, ...args);
    },
    toArray() {
      return toArrayAsync(generator);
    },
    some(predicate) {
      return someAsync(generator, predicate);
    },
  };
}
