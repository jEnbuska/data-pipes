import {
  type YieldedSyncProvider,
  type SyncIterableYielded,
} from "../types.ts";
import { toArraySyncFromReturn, toArraySync } from "../consumers/toArray.ts";
import {
  createInitialGroups,
  groupBySync,
} from "../generators/reducers/groupBy.ts";
import { consumeSync } from "../consumers/consume.ts";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { syncSingleYielded } from "./syncSingleYielded.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { _internalY } from "../utils.ts";
import { toAwaited, toAwaitedParallel } from "../generators/misc/toAwaited.ts";
import { findSync } from "../generators/finders/find.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import { mapSync } from "generators/misc/map.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { countBySync } from "../generators/reducers/countBy.ts";
import { countSync } from "../generators/reducers/count.ts";
import { chunkBySync } from "../generators/grouppers/chunkBy.ts";
import { batchSync } from "../generators/grouppers/batch.ts";
import { distinctBySync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedSync } from "../generators/filters/distinctUntilChanged.ts";
import { everySync } from "../generators/finders/every.ts";
import { filterSync } from "../generators/filters/filter.ts";
import { foldSync } from "../generators/reducers/fold.ts";
import { maxSync } from "../generators/reducers/max.ts";
import { minSync } from "../generators/reducers/min.ts";
import { reduceSync } from "../generators/reducers/reduce.ts";
import { toReverseSync } from "../generators/sorters/toReverse.ts";
import { skipSync } from "../generators/filters/skip.ts";
import { skipLastSync } from "../generators/filters/skipLast.ts";
import { skipWhileSync } from "../generators/filters/skipWhile.ts";
import { someSync } from "../generators/finders/some.ts";
import { toSortedSync } from "../generators/sorters/toSorted.ts";
import { takeSync } from "../generators/filters/take.ts";
import { takeLastSync } from "../generators/filters/takeLast.ts";
import { takeWhileSync } from "../generators/filters/takeWhile.ts";

const stringTag = "SyncIterableYielded";
export function syncIterableYielded<TInput>(
  provider: YieldedSyncProvider<TInput>,
  overrides: Partial<SyncIterableYielded<TInput>> = {},
): SyncIterableYielded<TInput> {
  return {
    ...overrides,
    toAwaited() {
      return asyncIterableAYielded(toAwaited(provider));
    },
    toAwaitedParallel(count: number) {
      return asyncIterableAYielded(toAwaitedParallel(provider, count));
    },
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (_internalY.getDisposableGenerator as any)(provider, [
        signal,
      ]);
      for (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return syncSingleYielded(
        findSync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return syncIterableYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return syncIterableYielded(flatMapSync(provider, callback));
    },
    map(mapper) {
      return syncIterableYielded(mapSync(provider, mapper));
    },
    resolve(signal?: AbortSignal) {
      return toArraySync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    [Symbol.toStringTag]: stringTag,
    tap(callback) {
      return syncIterableYielded(tapSync(provider, callback));
    },
    lift(middleware) {
      return syncIterableYielded(liftSync(provider, middleware));
    },
    countBy(fn) {
      return syncSingleYielded(countBySync(provider, fn), _internalY.getZero);
    },
    count() {
      return syncSingleYielded(countSync(provider), _internalY.getZero);
    },
    chunkBy(fn) {
      return syncIterableYielded(chunkBySync(provider, fn));
    },
    batch(predicate) {
      return syncIterableYielded(batchSync(provider, predicate));
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
        _internalY.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncIterableYielded(filterSync(provider, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalY.once(initial);
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
    max(callback) {
      return syncSingleYielded(
        maxSync(provider, callback),
        _internalY.getUndefined,
      );
    },
    min(callback) {
      return syncSingleYielded(
        minSync(provider, callback),
        _internalY.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return syncSingleYielded(
        reduceSync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const reverseProvider = toReverseSync(provider);
      return syncIterableYielded(reverseProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(reverseProvider, signal);
        },
      });
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
    toSorted(compareFn) {
      const sortProvider = toSortedSync(provider, compareFn);
      return syncIterableYielded(sortProvider, {
        resolve(signal?: AbortSignal) {
          return toArraySyncFromReturn(sortProvider, signal);
        },
      });
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
  };
}
