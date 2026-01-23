import { mapSync } from "generators/misc/map.ts";
import { _yielded } from "../_internal.ts";
import { forEachSync } from "../consumers/forEach.ts";
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
import { liftSync } from "../generators/misc/lift.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { toAwaited } from "../generators/misc/toAwaited.ts";
import { countBySync } from "../generators/reducers/countBy.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import type {
  type SyncYieldedIterator,
  YieldedSyncMiddleware,
} from "../types.ts";

export function yieldedSyncIterable<TInput, TReturn, TArgs extends any[]>(
  provider: YieldedSyncMiddleware<TInput, TReturn, unknown>,
): SyncYieldedIterator<TInput> {
  return {
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (_yielded.getDisposableGenerator as any)([signal]);
      for (const next of generator) {
        yield next;
      }
    },
    batch(predicate) {
      return yieldedSyncIterable(batchSync(predicate));
    },
    chunkBy(fn) {
      return yieldedSyncIterable(chunkBySync(fn));
    },
    forEach(...args: TArgs) {
      return forEachSync(...args);
    },
    countBy(fn) {
      return yieldedSyncIterable(countBySync(fn));
    },
    distinctBy(selector) {
      return yieldedSyncIterable(distinctBySync(selector));
    },
    distinctUntilChanged(isEqual) {
      return yieldedSyncIterable(distinctUntilChangedSync(isEqual));
    },
    every(predicate) {
      // TODO
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return yieldedSyncIterable(filterSync(predicate));
    },
    find(predicate: (next: TInput) => boolean) {
      // TODO
    },
    flat(depth) {
      return yieldedSyncIterable(flatSync(depth));
    },
    flatMap(callback) {
      return yieldedSyncIterable(flatMapSync(callback));
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      // TODO
    },
    lift(middleware) {
      return yieldedSyncIterable(liftSync(middleware));
    },
    map(mapper) {
      return yieldedSyncIterable(mapSync(mapper));
    },
    max(callback) {
      // TODO
    },
    min(callback) {
      // TODO
    },
    reduce(...args) {
      // TODO
    },
    toArray() {
      // TODO toArraySync();
    },
    drop(count) {
      return yieldedSyncIterable(dropSync(count));
    },
    dropLast(count) {
      return yieldedSyncIterable(dropLastSync(count));
    },
    dropWhile(predicate) {
      return yieldedSyncIterable(dropWhileSync(predicate));
    },
    some(predicate) {
      // TODO
    },
    take(count) {
      return yieldedSyncIterable(takeSync(count));
    },
    takeLast(count) {
      return yieldedSyncIterable(takeLastSync(count));
    },
    takeWhile(predicate) {
      return yieldedSyncIterable(takeWhileSync(predicate));
    },
    tap(callback) {
      return yieldedSyncIterable(tapSync(callback));
    },
    toAwaited() {
      return asyncIterableAYielded(toAwaited(provider));
    },
    toReverse() {
      // TODO
    },
    toSorted(compareFn) {
      // TODO
    },
  };
}
