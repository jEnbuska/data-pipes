import { distinctBySync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedSync } from "../generators/filters/distinctUntilChanged.ts";
import { dropSync } from "../generators/filters/drop.ts";
import { dropLastSync } from "../generators/filters/dropLast.ts";
import { dropWhileSync } from "../generators/filters/dropWhile.ts";
import { filterSync } from "../generators/filters/filter.ts";
import { takeSync } from "../generators/filters/take.ts";
import { takeLastSync } from "../generators/filters/takeLast.ts";
import { takeWhileSync } from "../generators/filters/takeWhile.ts";
import { batchSync } from "../generators/grouppers/batch.ts";
import { chunkBySync } from "../generators/grouppers/chunkBy.ts";
import { awaited } from "../generators/misc/awaited.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { mapSync } from "../generators/misc/map.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { reversedSync } from "../generators/sorters/reversed.ts";
import { sortedSync } from "../generators/sorters/sorted.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import type { YieldedSyncGenerator, YieldedSyncMiddlewares } from "../types.ts";
import { asyncYielded } from "./asyncYielded.ts";
import { syncYielded } from "./syncYielded.ts";

export function syncMiddlewares<TInput>(
  generator: YieldedSyncGenerator<TInput>,
): YieldedSyncMiddlewares<TInput> {
  return {
    batch(predicate) {
      return syncYielded(batchSync(generator, predicate));
    },
    chunkBy(fn) {
      return syncYielded(chunkBySync(generator, fn));
    },
    distinctBy(selector) {
      return syncYielded(distinctBySync(generator, selector));
    },
    distinctUntilChanged(isEqual) {
      return syncYielded(distinctUntilChangedSync(generator, isEqual));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncYielded(filterSync<TInput>(generator, predicate));
    },
    flat(depth) {
      return syncYielded(flatSync(generator, depth));
    },
    flatMap(callback) {
      return syncYielded(flatMapSync(generator, callback));
    },
    lift(middleware) {
      return syncYielded(liftSync(generator, middleware));
    },
    map(mapper) {
      return syncYielded(mapSync(generator, mapper));
    },
    drop(count) {
      return syncYielded(dropSync(generator, count));
    },
    dropLast(count) {
      return syncYielded(dropLastSync(generator, count));
    },
    dropWhile(predicate) {
      return syncYielded(dropWhileSync(generator, predicate));
    },
    take(count) {
      return syncYielded(takeSync(generator, count));
    },
    takeLast(count) {
      return syncYielded(takeLastSync(generator, count));
    },
    takeWhile(predicate) {
      return syncYielded(takeWhileSync(generator, predicate));
    },
    tap(callback) {
      return syncYielded(tapSync(generator, callback));
    },
    awaited() {
      return asyncYielded(awaited(generator));
    },
    reversed() {
      return syncYielded(reversedSync(generator));
    },
    sorted(compareFn) {
      return syncYielded(sortedSync(generator, compareFn));
    },
  };
}
