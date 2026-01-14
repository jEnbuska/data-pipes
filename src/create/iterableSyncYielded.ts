import { type YieldedSyncProvider, type IterableSyncYielded } from "../types";
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
  provider: YieldedSyncProvider<TInput>,
  overrides: Partial<IterableSyncYielded<TInput>> = {},
): IterableSyncYielded<TInput> {
  return {
    ...overrides,
    resolve() {
      return iterableAsyncYielded(resolve(provider));
    },
    resolveParallel(count: number) {
      return iterableAsyncYielded(resolveParallel(provider, count));
    },
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (getDisposableGenerator as any)(provider, [signal]);
      for (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncYielded(
        findSync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncYielded(flatSync(provider, depth));
    },
    flatMap(callback) {
      return iterableSyncYielded(flatMapSync(provider, callback));
    },
    map(mapper) {
      return iterableSyncYielded(mapSync(provider, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArraySync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    [Symbol.toStringTag]: "IterableSyncYielded",
    tap(callback) {
      return iterableSyncYielded(tapSync(provider, callback));
    },
    lift(middleware) {
      return iterableSyncYielded(liftSync(provider, middleware));
    },
    countBy(fn) {
      return singleSyncYielded(countBySync(provider, fn), _internalY.getZero);
    },
    count() {
      return singleSyncYielded(countSync(provider), _internalY.getZero);
    },
    chunkBy(fn) {
      return iterableSyncYielded(chunkBySync(provider, fn));
    },
    batch(predicate) {
      return iterableSyncYielded(batchSync(provider, predicate));
    },
    distinctBy(selector) {
      return iterableSyncYielded(distinctBySync(provider, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableSyncYielded(distinctUntilChangedSync(provider, isEqual));
    },
    every(predicate) {
      return singleSyncYielded(
        everySync(provider, predicate),
        _internalY.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableSyncYielded(filterSync(provider, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalY.once(initial);
      return singleSyncYielded(
        foldSync(provider, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleSyncYielded(groupBySync(provider, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleSyncYielded(
        maxSync(provider, callback),
        _internalY.getUndefined,
      );
    },
    min(callback) {
      return singleSyncYielded(
        minSync(provider, callback),
        _internalY.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleSyncYielded(
        reduceSync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const reverseProvider = toReverseSync(provider);
      return iterableSyncYielded(reverseProvider, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(reverseProvider, signal);
        },
      });
    },
    skip(count) {
      return iterableSyncYielded(skipSync(provider, count));
    },
    skipLast(count) {
      return iterableSyncYielded(skipLastSync(provider, count));
    },
    skipWhile(predicate) {
      return iterableSyncYielded(skipWhileSync(provider, predicate));
    },
    some(predicate) {
      return singleSyncYielded(someSync(provider, predicate), () => false);
    },
    toSorted(comparator) {
      const sortProvider = toSortedSync(provider, comparator);
      return iterableSyncYielded(sortProvider, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(sortProvider, signal);
        },
      });
    },
    take(count) {
      return iterableSyncYielded(takeSync(provider, count));
    },
    takeLast(count) {
      const takeLastProvider = takeLastSync(provider, count);
      return iterableSyncYielded(takeLastProvider, {
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableSyncYielded(takeWhileSync(provider, predicate));
    },
  };
}
