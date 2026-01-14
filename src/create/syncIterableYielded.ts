import { mapSync } from "generators/misc/map.ts";
import { _yielded } from "../_internal.ts";
import { consumeSync } from "../consumers/consume.ts";
import { toArraySync, toArraySyncFromReturn } from "../consumers/toArray.ts";
import { distinctBySync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedSync } from "../generators/filters/distinctUntilChanged.ts";
import { filterSync } from "../generators/filters/filter.ts";
import { skipSync } from "../generators/filters/skip.ts";
import { skipLastSync } from "../generators/filters/skipLast.ts";
import { skipWhileSync } from "../generators/filters/skipWhile.ts";
import { takeSync } from "../generators/filters/take.ts";
import { takeLastSync } from "../generators/filters/takeLast.ts";
import { takeWhileSync } from "../generators/filters/takeWhile.ts";
import { everySync } from "../generators/finders/every.ts";
import { findSync } from "../generators/finders/find.ts";
import { someSync } from "../generators/finders/some.ts";
import { batchSync } from "../generators/grouppers/batch.ts";
import { chunkBySync } from "../generators/grouppers/chunkBy.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { toAwaited, toAwaitedParallel } from "../generators/misc/toAwaited.ts";
import { countSync } from "../generators/reducers/count.ts";
import { countBySync } from "../generators/reducers/countBy.ts";
import { foldSync } from "../generators/reducers/fold.ts";
import {
  createInitialGroups,
  groupBySync,
} from "../generators/reducers/groupBy.ts";
import { maxSync } from "../generators/reducers/max.ts";
import { minSync } from "../generators/reducers/min.ts";
import { reduceSync } from "../generators/reducers/reduce.ts";
import { toReverseSync } from "../generators/sorters/toReverse.ts";
import { toSortedSync } from "../generators/sorters/toSorted.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import {
  type SyncIterableYielded,
  type YieldedSyncProvider,
} from "../types.ts";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { syncSingleYielded } from "./syncSingleYielded.ts";

const stringTag = "SyncIterableYielded";
export function syncIterableYielded<TInput>(
  provider: YieldedSyncProvider<TInput>,
  overrides: Partial<SyncIterableYielded<TInput>> = {},
): SyncIterableYielded<TInput> {
  return {
    ...overrides,
    [Symbol.toStringTag]: stringTag,
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (_yielded.getDisposableGenerator as any)(provider, [
        signal,
      ]);
      for (const next of generator) {
        yield next;
      }
    },
    batch(predicate) {
      return syncIterableYielded(batchSync(provider, predicate));
    },
    chunkBy(fn) {
      return syncIterableYielded(chunkBySync(provider, fn));
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    count() {
      return syncSingleYielded(countSync(provider), _yielded.getZero);
    },
    countBy(fn) {
      return syncSingleYielded(countBySync(provider, fn), _yielded.getZero);
    },
    distinctBy(selector) {
      return syncIterableYielded(distinctBySync(provider, selector));
    },
    distinctUntilChanged(isEqual) {
      return syncIterableYielded(distinctUntilChangedSync(provider, isEqual));
    },
    every(predicate) {
      return syncSingleYielded(
        everySync(provider, predicate),
        _yielded.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncIterableYielded(filterSync(provider, predicate));
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(
        findSync(provider, predicate),
        _yielded.getUndefined,
      );
    },
    flat(depth) {
      return syncIterableYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return syncIterableYielded(flatMapSync(provider, callback));
    },
    fold(initial, reducer) {
      const initialOnce = _yielded.once(initial);
      return syncSingleYielded(
        foldSync(provider, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return syncSingleYielded(groupBySync(provider, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    lift(middleware) {
      return syncIterableYielded(liftSync(provider, middleware));
    },
    map(mapper) {
      return syncIterableYielded(mapSync(provider, mapper));
    },
    max(callback) {
      return syncSingleYielded(
        maxSync(provider, callback),
        _yielded.getUndefined,
      );
    },
    min(callback) {
      return syncSingleYielded(
        minSync(provider, callback),
        _yielded.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return syncSingleYielded(
        reduceSync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    resolve(signal?: AbortSignal) {
      return toArraySync(provider, signal);
    },
    skip(count) {
      return syncIterableYielded(skipSync(provider, count));
    },
    skipLast(count) {
      return syncIterableYielded(skipLastSync(provider, count));
    },
    skipWhile(predicate) {
      return syncIterableYielded(skipWhileSync(provider, predicate));
    },
    some(predicate) {
      return syncSingleYielded(someSync(provider, predicate), () => false);
    },
    take(count) {
      return syncIterableYielded(takeSync(provider, count));
    },
    takeLast(count) {
      const takeLastProvider = takeLastSync(provider, count);
      return syncIterableYielded(takeLastProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return syncIterableYielded(takeWhileSync(provider, predicate));
    },
    tap(callback) {
      return syncIterableYielded(tapSync(provider, callback));
    },
    toAwaited() {
      return asyncIterableAYielded(toAwaited(provider));
    },
    toAwaitedParallel(count: number) {
      return asyncIterableAYielded(toAwaitedParallel(provider, count));
    },
    toReverse() {
      const reverseProvider = toReverseSync(provider);
      return syncIterableYielded(reverseProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(reverseProvider, signal);
        },
      });
    },
    toSorted(compareFn) {
      const sortProvider = toSortedSync(provider, compareFn);
      return syncIterableYielded(sortProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(sortProvider, signal);
        },
      });
    },
  };
}
