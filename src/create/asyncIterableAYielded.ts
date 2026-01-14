import { type YieldedAsyncProvider, type AsyncIterableYielded } from "../types";
import { _internalY } from "../utils";
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
import { asyncSingleYielded } from "./asyncSingleYielded.ts";
import { liftAsync } from "../generators/misc/lift";

export function asyncIterableAYielded<TInput>(
  provider: YieldedAsyncProvider<Awaited<TInput>>,
  overrides: Partial<AsyncIterableYielded<TInput>> = {},
): AsyncIterableYielded<TInput> {
  return {
    ...overrides,
    async *[Symbol.asyncIterator]() {
      const signal = new AbortController().signal;
      using generator = _internalY.getDisposableAsyncGenerator(
        provider,
        signal,
      );
      for await (const next of generator) {
        yield next;
      }
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return asyncIterableAYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return asyncIterableAYielded(flatMapAsync(provider, callback));
    },
    map(mapper) {
      return asyncIterableAYielded(mapAsync(provider, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArrayAsync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(provider, signal);
    },
    [Symbol.toStringTag]: "AsyncIterableYielded",
    tap(callback) {
      return asyncIterableAYielded(tapAsync(provider, callback));
    },
    lift(middleware) {
      return asyncIterableAYielded(liftAsync(provider, middleware));
    },
    countBy(fn) {
      return asyncSingleYielded(countByAsync(provider, fn), _internalY.getZero);
    },
    count() {
      return asyncSingleYielded(countAsync(provider), _internalY.getZero);
    },
    chunkBy(fn) {
      return asyncIterableAYielded(chunkByAsync(provider, fn));
    },
    batch(predicate) {
      return asyncIterableAYielded(batchAsync(provider, predicate));
    },
    distinctBy(selector) {
      return asyncIterableAYielded(distinctByAsync(provider, selector));
    },
    distinctUntilChanged(isEqual) {
      return asyncIterableAYielded(
        distinctUntilChangedAsync(provider, isEqual),
      );
    },
    every(predicate) {
      return asyncSingleYielded(
        everyAsync(provider, predicate),
        _internalY.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return asyncIterableAYielded(filterAsync(provider, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalY.once(initial);
      return asyncSingleYielded(
        foldAsync(provider, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return asyncSingleYielded(
        groupByAsync(provider, keySelector, groups),
        () => Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return asyncSingleYielded(
        maxAsync(provider, callback),
        _internalY.getUndefined,
      );
    },
    min(callback) {
      return asyncSingleYielded(
        minAsync(provider, callback),
        _internalY.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return asyncSingleYielded(
        reduceAsync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const reverseProvider = toReverseAsync(provider);
      return asyncIterableAYielded(reverseProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(reverseProvider, signal);
        },
      });
    },
    skip(count) {
      return asyncIterableAYielded(skipAsync(provider, count));
    },
    skipLast(count) {
      return asyncIterableAYielded(skipLastAsync(provider, count));
    },
    skipWhile(predicate) {
      return asyncIterableAYielded(skipWhileAsync(provider, predicate));
    },
    some(predicate) {
      return asyncSingleYielded(someAsync(provider, predicate), () => false);
    },
    toSorted(comparator) {
      const sortedProvider = toSortedAsync(provider, comparator);
      return asyncIterableAYielded(sortedProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(sortedProvider, signal);
        },
      });
    },
    take(count) {
      return asyncIterableAYielded(takeAsync(provider, count));
    },
    takeLast(count) {
      const takeLastProvider = takeLastAsync(provider, count);
      return asyncIterableAYielded(takeLastProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return asyncIterableAYielded(takeWhileAsync(provider, predicate));
    },
  };
}
