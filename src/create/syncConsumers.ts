import { countSync } from "../consumers/count.ts";
import { countBySync } from "../consumers/countBy.ts";
import { groupBySync } from "../consumers/groupBy.ts";
import { maxBySync } from "../consumers/maxBy.ts";
import { minBySync } from "../consumers/minBy.ts";
import type { YieldedConsumers, YieldedSyncGenerator } from "../types.ts";

export function syncConsumers<TOutput>(
  generator: YieldedSyncGenerator<TOutput>,
): YieldedConsumers<false, TOutput> {
  return {
    [Symbol.iterator]: () => generator[Symbol.iterator](),
    forEach(cb) {
      return generator.forEach(cb);
    },
    count() {
      return countSync(generator);
    },
    countBy(fn) {
      return countBySync(generator, fn);
    },
    every(predicate) {
      return generator.every(predicate) satisfies boolean as false | true;
    },
    find(predicate: (next: TOutput, index: number) => unknown) {
      return generator.find(predicate);
    },
    groupBy(...args: unknown[]) {
      // @ts-expect-error
      return groupBySync(generator, ...args) as any;
    },
    maxBy(callback) {
      return maxBySync(generator, callback) as any;
    },
    minBy(callback) {
      return minBySync(generator, callback);
    },
    reduce(...args: Parameters<YieldedConsumers<false, TOutput>["reduce"]>) {
      return generator.reduce(...args);
    },
    toArray() {
      return generator.toArray();
    },
    some(predicate) {
      return generator.some(predicate);
    },
  };
}
