import type { SyncStreamlessProvider, IterableSyncStreamless } from "../types";
import { _internalStreamless } from "../utils";
import {
  flat,
  map,
  tap,
  chunkBy,
  batch,
  distinctBy,
  distinctUntilChanged,
  every,
  filter,
  fold,
  groupBy,
  max,
  min,
  reduce,
  reverse,
  skip,
  skipLast,
  skipWhile,
  some,
  sort,
  take,
  takeLast,
  takeWhile,
  flatMap,
  find,
  countBy,
  count,
  resolve,
  resolveParallel,
} from "../generators";
import { toArrayFromReturn, toArray } from "../consumers/toArray";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { consume } from "../consumers";
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
        find(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableSyncStreamless(flat(source, depth));
    },
    flatMap(callback) {
      return iterableSyncStreamless(flatMap(source, callback));
    },
    map(mapper) {
      return iterableSyncStreamless(map(source, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArray<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consume<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "IterableSyncStreamless",
    tap(callback) {
      return iterableSyncStreamless(tap(source, callback));
    },
    lift(middleware) {
      return iterableSyncStreamless(middleware(source));
    },
    countBy(fn) {
      return singleSyncStreamless(
        countBy(source, fn),
        _internalStreamless.getZero,
      );
    },
    count() {
      return singleSyncStreamless(count(source), _internalStreamless.getZero);
    },
    chunkBy(fn) {
      return iterableSyncStreamless(chunkBy(source, fn));
    },
    batch(predicate) {
      return iterableSyncStreamless(batch(source, predicate));
    },
    distinctBy(selector) {
      return iterableSyncStreamless(distinctBy(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableSyncStreamless(distinctUntilChanged(source, isEqual));
    },
    every(predicate) {
      return singleSyncStreamless(
        every(source, predicate),
        _internalStreamless.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableSyncStreamless(filter<TInput, TOutput>(source, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalStreamless.once(initial);
      return singleSyncStreamless(
        fold(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleSyncStreamless(groupBy(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleSyncStreamless(
        max(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    min(callback) {
      return singleSyncStreamless(
        min(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleSyncStreamless(
        reduce(source, reducer, initialValue),
        () => initialValue,
      );
    },
    reverse() {
      const toArraySource = reverse(source);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    skip(count) {
      return iterableSyncStreamless(skip(source, count));
    },
    skipLast(count) {
      return iterableSyncStreamless(skipLast(source, count));
    },
    skipWhile(predicate) {
      return iterableSyncStreamless(skipWhile(source, predicate));
    },
    some(predicate) {
      return singleSyncStreamless(some(source, predicate), () => false);
    },
    sort(comparator) {
      const toArraySource = sort(source, comparator);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    take(count) {
      return iterableSyncStreamless(take(source, count));
    },
    takeLast(count) {
      const toArraySource = takeLast(source, count);
      return iterableSyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableSyncStreamless(takeWhile(source, predicate));
    },
  };
}
