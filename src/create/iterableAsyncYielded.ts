import { type AsyncYieldedProvider, type IterableAsyncYielded } from "../types";
import { _internalYielded } from "../utils";
import { toArrayAsyncFromReturn, toArrayAsync } from "../consumers/toArray";
import {
  findAsync,
  flatAsync,
  flatMapAsync,
  mapAsync,
  tapAsync,
  countByAsync,
  countAsync,
  chunkByAsync,
  batchAsync,
  distinctByAsync,
  distinctUntilChangedAsync,
  everyAsync,
  filterAsync,
  foldAsync,
  groupByAsync,
  maxAsync,
  minAsync,
  reduceAsync,
  toReverseAsync,
  skipAsync,
  skipLastAsync,
  skipWhileAsync,
  someAsync,
  toSortedAsync,
  takeAsync,
  takeLastAsync,
  takeWhileAsync,
} from "../generators";
import { consumeAsync } from "../consumers/consume";

import { createInitialGroups } from "../generators/reducers/groupBy";
import { singleAsyncYielded } from "./singleAsyncYielded";
import { getDisposableAsyncGenerator } from "../index.ts";

export function iterableAsyncYielded<TInput>(
  source: AsyncYieldedProvider<Awaited<TInput>>,
  overrides: Partial<IterableAsyncYielded<TInput>> = {},
): IterableAsyncYielded<TInput> {
  return {
    ...overrides,
    async *[Symbol.asyncIterator]() {
      const signal = new AbortController().signal;
      using generator = (getDisposableAsyncGenerator as any)(source, [signal]);
      for await (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return singleAsyncYielded(
        findAsync(source, predicate),
        _internalYielded.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncYielded(flatAsync(source, depth));
    },
    flatMap(callback) {
      return iterableAsyncYielded(flatMapAsync(source, callback));
    },
    map(mapper) {
      return iterableAsyncYielded(mapAsync(source, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArrayAsync(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "IterableAsyncYielded",
    tap(callback) {
      return iterableAsyncYielded(tapAsync(source, callback));
    },
    lift(middleware) {
      return iterableAsyncYielded(middleware(source));
    },
    countBy(fn) {
      return singleAsyncYielded(
        countByAsync(source, fn),
        _internalYielded.getZero,
      );
    },
    count() {
      return singleAsyncYielded(countAsync(source), _internalYielded.getZero);
    },
    chunkBy(fn) {
      return iterableAsyncYielded(chunkByAsync(source, fn));
    },
    batch(predicate) {
      return iterableAsyncYielded(batchAsync(source, predicate));
    },
    distinctBy(selector) {
      return iterableAsyncYielded(distinctByAsync(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableAsyncYielded(distinctUntilChangedAsync(source, isEqual));
    },
    every(predicate) {
      return singleAsyncYielded(
        everyAsync(source, predicate),
        _internalYielded.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableAsyncYielded(filterAsync(source, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalYielded.once(initial);
      return singleAsyncYielded(
        foldAsync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleAsyncYielded(groupByAsync(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleAsyncYielded(
        maxAsync(source, callback),
        _internalYielded.getUndefined,
      );
    },
    min(callback) {
      return singleAsyncYielded(
        minAsync(source, callback),
        _internalYielded.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleAsyncYielded(
        reduceAsync(source, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const toArraySource = toReverseAsync(source);
      return iterableAsyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(toArraySource, signal);
        },
      });
    },
    skip(count) {
      return iterableAsyncYielded(skipAsync(source, count));
    },
    skipLast(count) {
      return iterableAsyncYielded(skipLastAsync(source, count));
    },
    skipWhile(predicate) {
      return iterableAsyncYielded(skipWhileAsync(source, predicate));
    },
    some(predicate) {
      return singleAsyncYielded(someAsync(source, predicate), () => false);
    },
    toSorted(comparator) {
      const toArraySource = toSortedAsync(source, comparator);
      return iterableAsyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(toArraySource, signal);
        },
      });
    },
    take(count) {
      return iterableAsyncYielded(takeAsync(source, count));
    },
    takeLast(count) {
      const toArraySource = takeLastAsync(source, count);
      return iterableAsyncYielded(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableAsyncYielded(takeWhileAsync(source, predicate));
    },
  };
}
