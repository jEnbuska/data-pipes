import type { SyncYieldedProvider, IterableSyncYielded } from "../types";
import { _internalYielded } from "../utils";
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
      using generator = _internalYielded.disposable(source);
      for (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return singleSyncYielded(
        findSync(source, predicate),
        _internalYielded.getUndefined,
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
      return toArraySync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "IterableSyncYielded",
    tap(callback) {
      return iterableSyncYielded(tapSync(source, callback));
    },
    lift(middleware) {
      return iterableSyncYielded(middleware(source));
    },
    countBy(fn) {
      return singleSyncYielded(
        countBySync(source, fn),
        _internalYielded.getZero,
      );
    },
    count() {
      return singleSyncYielded(countSync(source), _internalYielded.getZero);
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
        _internalYielded.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableSyncYielded(
        filterSync<TInput, TOutput>(source, predicate),
      );
    },
    fold(initial, reducer) {
      const initialOnce = _internalYielded.once(initial);
      return singleSyncYielded(
        foldSync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleSyncYielded(groupBySync(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleSyncYielded(
        maxSync(source, callback),
        _internalYielded.getUndefined,
      );
    },
    min(callback) {
      return singleSyncYielded(
        minSync(source, callback),
        _internalYielded.getUndefined,
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
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
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
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
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
          return toArraySyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableSyncYielded(takeWhileSync(source, predicate));
    },
  };
}
