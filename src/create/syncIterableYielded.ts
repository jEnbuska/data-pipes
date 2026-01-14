import { type YieldedSyncProvider, type SyncIterableYielded } from "../types";
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
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { syncSingleYielded } from "./syncSingleYielded.ts";
import { getDisposableGenerator } from "../";
import { liftSync } from "../generators/misc/lift";
import { _internalY } from "../utils";

export function syncIterableYielded<TInput>(
  provider: YieldedSyncProvider<TInput>,
  overrides: Partial<SyncIterableYielded<TInput>> = {},
): SyncIterableYielded<TInput> {
  return {
    ...overrides,
    resolve() {
      return asyncIterableAYielded(resolve(provider));
    },
    resolveParallel(count: number) {
      return asyncIterableAYielded(resolveParallel(provider, count));
    },
    *[Symbol.iterator]() {
      const signal = new AbortController().signal;
      using generator = (getDisposableGenerator as any)(provider, [signal]);
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
    collect(signal?: AbortSignal) {
      return toArraySync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeSync(provider, signal);
    },
    [Symbol.toStringTag]: "IterableSyncYielded",
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
        collect(signal?: AbortSignal) {
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
    toSorted(comparator) {
      const sortProvider = toSortedSync(provider, comparator);
      return syncIterableYielded(sortProvider, {
        collect(signal?: AbortSignal) {
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
        collect(signal?: AbortSignal) {
          return toArraySyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return syncIterableYielded(takeWhileSync(provider, predicate));
    },
  };
}
