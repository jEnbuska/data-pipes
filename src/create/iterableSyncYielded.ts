import { type SyncYieldedProvider, type IterableSyncYielded } from "../types";
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
import { iterableAsyncYielded } from "./iterableAsyncYielded";
import { singleSyncYielded } from "./singleSyncYielded";
import { getDisposableGenerator } from "../";
import { liftSync } from "../generators/misc/lift";
import { _internalY } from "../utils";

export function iterableSyncYielded<TInput>(
  source: SyncYieldedProvider<TInput>,
  overrides: Partial<IterableSyncYielded<TInput>> = {},
): IterableSyncYielded<TInput> {
  return {
    ...overrides,
    resolve() {
      return iterableAsyncYielded(resolve(source));
    },
    resolveParallel(count: number) {
      return iterableAsyncYielded(resolveParallel(source, count));
    },
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (getDisposableGenerator as any)(source, [signal]);
      for (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncYielded(
        findSync(source, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncYielded(flatSync(source, depth));
    },
    flatMap(callback) {
      return iterableSyncYielded(flatMapSync(source, callback));
    },
    map(mapper) {
      return iterableSyncYielded(mapSync(source, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArraySync(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(source, signal);
    },
    [Symbol.toStringTag]: "IterableSyncYielded",
    tap(callback) {
      return iterableSyncYielded(tapSync(source, callback));
    },
    lift(middleware) {
      return iterableSyncYielded(liftSync(source, middleware));
    },
    countBy(fn) {
      return singleSyncYielded(countBySync(source, fn), _internalY.getZero);
    },
    count() {
      return singleSyncYielded(countSync(source), _internalY.getZero);
    },
    chunkBy(fn) {
      return iterableSyncYielded(chunkBySync(source, fn));
    },
    batch(predicate) {
      return iterableSyncYielded(batchSync(source, predicate));
    },
    distinctBy(selector) {
      return iterableSyncYielded(distinctBySync(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableSyncYielded(distinctUntilChangedSync(source, isEqual));
    },
    every(predicate) {
      return singleSyncYielded(
        everySync(source, predicate),
        _internalY.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableSyncYielded(filterSync(source, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalY.once(initial);
      return singleSyncYielded(
        foldSync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleSyncYielded(groupBySync(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleSyncYielded(
        maxSync(source, callback),
        _internalY.getUndefined,
      );
    },
    min(callback) {
      return singleSyncYielded(
        minSync(source, callback),
        _internalY.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleSyncYielded(
        reduceSync(source, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const toArraySource = toReverseSync(source);
      return iterableSyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(toArraySource, signal);
        },
      });
    },
    skip(count) {
      return iterableSyncYielded(skipSync(source, count));
    },
    skipLast(count) {
      return iterableSyncYielded(skipLastSync(source, count));
    },
    skipWhile(predicate) {
      return iterableSyncYielded(skipWhileSync(source, predicate));
    },
    some(predicate) {
      return singleSyncYielded(someSync(source, predicate), () => false);
    },
    toSorted(comparator) {
      const toArraySource = toSortedSync(source, comparator);
      return iterableSyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(toArraySource, signal);
        },
      });
    },
    take(count) {
      return iterableSyncYielded(takeSync(source, count));
    },
    takeLast(count) {
      const toArraySource = takeLastSync(source, count);
      return iterableSyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableSyncYielded(takeWhileSync(source, predicate));
    },
  };
}
