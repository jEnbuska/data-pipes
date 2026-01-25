import { distinctByAsync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedAsync } from "../generators/filters/distinctUntilChanged.ts";
import { dropAsync } from "../generators/filters/drop.ts";
import { dropLastAsync } from "../generators/filters/dropLast.ts";
import { dropWhileAsync } from "../generators/filters/dropWhile.ts";
import { filterAsync } from "../generators/filters/filter.ts";
import { takeAsync } from "../generators/filters/take.ts";
import { takeLastAsync } from "../generators/filters/takeLast.ts";
import { takeWhileAsync } from "../generators/filters/takeWhile.ts";
import { batchAsync } from "../generators/grouppers/batch.ts";
import { chunkByAsync } from "../generators/grouppers/chunkBy.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { parallel } from "../generators/misc/parallel.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { reversedAsync } from "../generators/sorters/reversed.ts";
import { sortedAsync } from "../generators/sorters/sorted.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import type {
  YieldedAsyncGenerator,
  YieldedAsyncMiddlewares,
} from "../types.ts";
import { asyncYielded } from "./asyncYielded.ts";

export function asyncMiddlewares<TInput>(
  generator: YieldedAsyncGenerator<TInput>,
): YieldedAsyncMiddlewares<TInput> {
  return {
    parallel(count: number) {
      return asyncYielded(parallel(generator, count));
    },
    batch(predicate) {
      return asyncYielded(batchAsync(generator, predicate));
    },
    chunkBy(fn) {
      return asyncYielded(chunkByAsync(generator, fn));
    },
    distinctBy(selector) {
      return asyncYielded(distinctByAsync(generator, selector));
    },
    distinctUntilChanged(isEqual) {
      return asyncYielded(distinctUntilChangedAsync(generator, isEqual));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return asyncYielded(filterAsync<TInput>(generator, predicate));
    },
    flat(depth) {
      return asyncYielded(flatAsync(generator, depth));
    },
    flatMap(callback) {
      return asyncYielded(flatMapAsync(generator, callback));
    },
    lift(middleware) {
      return asyncYielded(liftAsync(generator, middleware));
    },
    map(mapper) {
      return asyncYielded(mapAsync(generator, mapper));
    },
    drop(count) {
      return asyncYielded(dropAsync(generator, count));
    },
    dropLast(count) {
      return asyncYielded(dropLastAsync(generator, count));
    },
    dropWhile(predicate) {
      return asyncYielded(dropWhileAsync(generator, predicate));
    },
    take(count) {
      return asyncYielded(takeAsync(generator, count));
    },
    takeLast(count) {
      return asyncYielded(takeLastAsync(generator, count));
    },
    takeWhile(predicate) {
      return asyncYielded(takeWhileAsync(generator, predicate));
    },
    tap(callback) {
      return asyncYielded(tapAsync(generator, callback));
    },
    reversed() {
      return asyncYielded(reversedAsync(generator));
    },
    sorted(comparator) {
      return asyncYielded(sortedAsync(generator, comparator));
    },
  };
}
