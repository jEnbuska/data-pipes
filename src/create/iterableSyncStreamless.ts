import type { SyncStreamlessProvider, IterableSyncStreamless } from "../types";
import { _internalStreamless } from "../utils";
import {
  flatSync,
  mapSync,
  tapSync,
  chunkBySync,
  batchSync,
  distinctBySync,
  distinctUntilChangedSync,
  everySync,
  filterSync,
  foldSync,
  groupBySync,
  maxSync,
  minSync,
  reduceSync,
  toReverseSync,
  skipSync,
  skipLastSync,
  skipWhileSync,
  someSync,
  toSortedSync,
  takeSync,
  takeLastSync,
  takeWhileSync,
  flatMapSync,
  findSync,
  countBySync,
  countSync,
  resolve,
  resolveParallel,
} from "../generators";
import { toArraySyncFromReturn, toArraySync } from "../consumers/toArray";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { consumeSync } from "../consumers";
import { iterableAsyncStreamless } from "./iterableAsyncStreamless";
import { singleSyncStreamless } from "./singleSyncStreamless";

export function iterableSyncStreamless<TInput>(
  source: SyncStreamlessProvider<TInput>,
  overrides: Partial<IterableSyncStreamless<TInput>> = {},
): IterableSyncStreamless<TInput> {
  return {
    ...overrides,
    resolve() {
      return iterableAsyncStreamless(resolve(source));
    },
    resolveParallel(count: number) {
      return iterableAsyncStreamless(resolveParallel(source, count));
    },
    *[Symbol.iterator]() {
      using generator = _internalStreamless.disposable(source);
      for (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncStreamless(
        findSync(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncStreamless(flatSync(source, depth));
    },
    flatMap(callback) {
      return iterableSyncStreamless(flatMapSync(source, callback));
    },
    map(mapper) {
      return iterableSyncStreamless(mapSync(source, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArraySync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "IterableSyncStreamless",
    tap(callback) {
      return iterableSyncStreamless(tapSync(source, callback));
    },
    lift(middleware) {
      return iterableSyncStreamless(middleware(source));
    },
    countBy(fn) {
      return singleSyncStreamless(
        countBySync(source, fn),
        _internalStreamless.getZero,
      );
    },
    count() {
      return singleSyncStreamless(
        countSync(source),
        _internalStreamless.getZero,
      );
    },
    chunkBy(fn) {
      return iterableSyncStreamless(chunkBySync(source, fn));
    },
    batch(predicate) {
      return iterableSyncStreamless(batchSync(source, predicate));
    },
    distinctBy(selector) {
      return iterableSyncStreamless(distinctBySync(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableSyncStreamless(distinctUntilChangedSync(source, isEqual));
    },
    every(predicate) {
      return singleSyncStreamless(
        everySync(source, predicate),
        _internalStreamless.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableSyncStreamless(
        filterSync<TInput, TOutput>(source, predicate),
      );
    },
    fold(initial, reducer) {
      const initialOnce = _internalStreamless.once(initial);
      return singleSyncStreamless(
        foldSync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleSyncStreamless(
        groupBySync(source, keySelector, groups),
        () => Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleSyncStreamless(
        maxSync(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    min(callback) {
      return singleSyncStreamless(
        minSync(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleSyncStreamless(
        reduceSync(source, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const toArraySource = toReverseSync(source);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    skip(count) {
      return iterableSyncStreamless(skipSync(source, count));
    },
    skipLast(count) {
      return iterableSyncStreamless(skipLastSync(source, count));
    },
    skipWhile(predicate) {
      return iterableSyncStreamless(skipWhileSync(source, predicate));
    },
    some(predicate) {
      return singleSyncStreamless(someSync(source, predicate), () => false);
    },
    toSorted(comparator) {
      const toArraySource = toSortedSync(source, comparator);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    take(count) {
      return iterableSyncStreamless(takeSync(source, count));
    },
    takeLast(count) {
      const toArraySource = takeLastSync(source, count);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableSyncStreamless(takeWhileSync(source, predicate));
    },
  };
}
