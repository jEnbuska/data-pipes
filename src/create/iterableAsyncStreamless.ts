import {
  type AsyncStreamlessProvider,
  type IterableAsyncStreamless,
} from "../types";
import { _internalStreamless } from "../utils";
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
  reverseAsync,
  skipAsync,
  skipLastAsync,
  skipWhileAsync,
  someAsync,
  sortAsync,
  takeAsync,
  takeLastAsync,
  takeWhileAsync,
} from "../generators";
import { consumeAsync } from "../consumers/consume";

import { createInitialGroups } from "../generators/reducers/groupBy";
import { singleAsyncStreamless } from "./singleAsyncStreamless";

export function iterableAsyncStreamless<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  overrides: Partial<IterableAsyncStreamless<TInput>> = {},
): IterableAsyncStreamless<TInput> {
  return {
    ...overrides,
    async *[Symbol.asyncIterator]() {
      using generator = _internalStreamless.disposable(source);
      for await (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: TInput) => boolean) {
      return singleAsyncStreamless(
        findAsync(source, predicate),
        _internalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncStreamless(flatAsync(source, depth));
    },
    flatMap(callback) {
      return iterableAsyncStreamless(flatMapAsync(source, callback));
    },
    map(mapper) {
      return iterableAsyncStreamless(mapAsync(source, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArrayAsync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    [Symbol.toStringTag]: "IterableAsyncStreamless",
    tap(callback) {
      return iterableAsyncStreamless(tapAsync(source, callback));
    },
    lift(middleware) {
      return iterableAsyncStreamless(middleware(source));
    },
    countBy(fn) {
      return singleAsyncStreamless(
        countByAsync(source, fn),
        _internalStreamless.getZero,
      );
    },
    count() {
      return singleAsyncStreamless(
        countAsync(source),
        _internalStreamless.getZero,
      );
    },
    chunkBy(fn) {
      return iterableAsyncStreamless(chunkByAsync(source, fn));
    },
    batch(predicate) {
      return iterableAsyncStreamless(batchAsync(source, predicate));
    },
    distinctBy(selector) {
      return iterableAsyncStreamless(distinctByAsync(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableAsyncStreamless(
        distinctUntilChangedAsync(source, isEqual),
      );
    },
    every(predicate) {
      return singleAsyncStreamless(
        everyAsync(source, predicate),
        _internalStreamless.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableAsyncStreamless(
        filterAsync<TInput, TOutput>(source, predicate),
      );
    },
    fold(initial, reducer) {
      const initialOnce = _internalStreamless.once(initial);
      return singleAsyncStreamless(
        foldAsync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleAsyncStreamless(
        groupByAsync(source, keySelector, groups),
        () => Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleAsyncStreamless(
        maxAsync(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    min(callback) {
      return singleAsyncStreamless(
        minAsync(source, callback),
        _internalStreamless.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleAsyncStreamless(
        reduceAsync(source, reducer, initialValue),
        () => initialValue,
      );
    },
    reverse() {
      const toArraySource = reverseAsync(source);
      return iterableAsyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    skip(count) {
      return iterableAsyncStreamless(skipAsync(source, count));
    },
    skipLast(count) {
      return iterableAsyncStreamless(skipLastAsync(source, count));
    },
    skipWhile(predicate) {
      return iterableAsyncStreamless(skipWhileAsync(source, predicate));
    },
    some(predicate) {
      return singleAsyncStreamless(someAsync(source, predicate), () => false);
    },
    sort(comparator) {
      const toArraySource = sortAsync(source, comparator);
      return iterableAsyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    take(count) {
      return iterableAsyncStreamless(takeAsync(source, count));
    },
    takeLast(count) {
      const toArraySource = takeLastAsync(source, count);
      return iterableAsyncStreamless(toArraySource, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn<TInput>(toArraySource, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableAsyncStreamless(takeWhileAsync(source, predicate));
    },
  };
}
