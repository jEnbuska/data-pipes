import { mapSync } from "generators/misc/map.ts";
import { _yielded } from "../_internal.ts";
import { everySync } from "../consumers/every.ts";
import { findSync } from "../consumers/find.ts";
import { forEachSync } from "../consumers/forEach.ts";
import { createInitialGroups, groupBySync } from "../consumers/groupBy.ts";
import { maxBySync } from "../consumers/maxBy.ts";
import { minBySync } from "../consumers/minBy.ts";
import { reduceSync } from "../consumers/reduce.ts";
import { someSync } from "../consumers/some.ts";
import { toArraySync, toArraySyncFromReturn } from "../consumers/toArray.ts";
import { toReverseSync } from "../consumers/toReverse.ts";
import { toSortedSync } from "../consumers/toSorted.ts";
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
import { toAwaited, toAwaitedParallel } from "../generators/misc/toAwaited.ts";
import { countBySync } from "../generators/reducers/countBy.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import type {
  type SyncYieldedIterator,
  YieldedSyncMiddleware,
} from "../types.ts";
import { asyncIterableAYielded } from "./yieldedAsyncIterable.ts";

export function syncYieldedIterator<TInput, TReturn, TArgs extends any[]>(
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
      return syncYieldedIterator(batchSync(predicate));
    },
    chunkBy(fn) {
      return syncYieldedIterator(chunkBySync(fn));
    },
    forEach(...args: TArgs) {
      return forEachSync(...args);
    },
    countBy(fn) {
      return syncYieldedIterator(countBySync(fn));
    },
    distinctBy(selector) {
      return syncYieldedIterator(distinctBySync(selector));
    },
    distinctUntilChanged(isEqual) {
      return syncYieldedIterator(distinctUntilChangedSync(isEqual));
    },
    every(predicate) {
      return syncSingleYielded(everySync(predicate), _yielded.getTrue);
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncYieldedIterator(filterSync(predicate));
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(findSync(predicate), _yielded.getUndefined);
    },
    flat(depth) {
      return syncYieldedIterator(flatSync(depth));
    },
    flatMap(callback) {
      return syncYieldedIterator(flatMapSync(callback));
    },
    fold(initial, reducer) {
      const initialOnce = _yielded.once(initial);
      return syncSingleYielded(foldSync(initialOnce, reducer), initialOnce);
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return syncSingleYielded(groupBySync(keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    lift(middleware) {
      return syncYieldedIterator(liftSync(middleware));
    },
    map(mapper) {
      return syncYieldedIterator(mapSync(mapper));
    },
    max(callback) {
      return syncSingleYielded(maxBySync(callback), _yielded.getUndefined);
    },
    min(callback) {
      return syncSingleYielded(minBySync(callback), _yielded.getUndefined);
    },
    reduce(reducer, initialValue) {
      return syncSingleYielded(
        reduceSync(reducer, initialValue),
        () => initialValue,
      );
    },
    resolve(signal?: AbortSignal) {
      return toArraySync(signal);
    },
    skip(count) {
      return syncYieldedIterator(dropSync(count));
    },
    skipLast(count) {
      return syncYieldedIterator(dropLastSync(count));
    },
    skipWhile(predicate) {
      return syncYieldedIterator(dropWhileSync(predicate));
    },
    some(predicate) {
      return syncSingleYielded(someSync(predicate), () => false);
    },
    take(count) {
      return syncYieldedIterator(takeSync(count));
    },
    takeLast(count) {
      const takeLastProvider = takeLastSync(count);
      return syncYieldedIterator(takeLastProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return syncYieldedIterator(takeWhileSync(predicate));
    },
    tap(callback) {
      return syncYieldedIterator(tapSync(callback));
    },
    toAwaited() {
      return asyncIterableAYielded(toAwaited(provider));
    },
    toAwaitedParallel(count: number) {
      return asyncIterableAYielded(toAwaitedParallel(count));
    },
    toReverse() {
      const reverseProvider = toReverseSync(provider);
      return syncYieldedIterator(reverseProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(reverseProvider, signal);
        },
      });
    },
    toSorted(compareFn) {
      const sortProvider = toSortedSync(compareFn);
      return syncYieldedIterator(sortProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(sortProvider, signal);
        },
      });
    },
  };
}
