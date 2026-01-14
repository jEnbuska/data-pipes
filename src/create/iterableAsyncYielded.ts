import { type YieldedAsyncProvider, type IterableAsyncYielded } from "../types";
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
import { singleAsyncYielded } from "./singleAsyncYielded";
import { liftAsync } from "../generators/misc/lift";

export function iterableAsyncYielded<TInput>(
  provider: YieldedAsyncProvider<Awaited<TInput>>,
  overrides: Partial<IterableAsyncYielded<TInput>> = {},
): IterableAsyncYielded<TInput> {
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
      return singleAsyncYielded(
        findAsync(provider, predicate),
        _internalY.getUndefined,
      );
    },
    flat(depth) {
      return iterableAsyncYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return iterableAsyncYielded(flatMapAsync(provider, callback));
    },
    map(mapper) {
      return iterableAsyncYielded(mapAsync(provider, mapper));
    },
    collect(signal?: AbortSignal) {
      return toArrayAsync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(provider, signal);
    },
    [Symbol.toStringTag]: "IterableAsyncYielded",
    tap(callback) {
      return iterableAsyncYielded(tapAsync(provider, callback));
    },
    lift(middleware) {
      return iterableAsyncYielded(liftAsync(provider, middleware));
    },
    countBy(fn) {
      return singleAsyncYielded(countByAsync(provider, fn), _internalY.getZero);
    },
    count() {
      return singleAsyncYielded(countAsync(provider), _internalY.getZero);
    },
    chunkBy(fn) {
      return iterableAsyncYielded(chunkByAsync(provider, fn));
    },
    batch(predicate) {
      return iterableAsyncYielded(batchAsync(provider, predicate));
    },
    distinctBy(selector) {
      return iterableAsyncYielded(distinctByAsync(provider, selector));
    },
    distinctUntilChanged(isEqual) {
      return iterableAsyncYielded(distinctUntilChangedAsync(provider, isEqual));
    },
    every(predicate) {
      return singleAsyncYielded(
        everyAsync(provider, predicate),
        _internalY.getTrue,
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return iterableAsyncYielded(filterAsync(provider, predicate));
    },
    fold(initial, reducer) {
      const initialOnce = _internalY.once(initial);
      return singleAsyncYielded(
        foldAsync(provider, initialOnce, reducer),
        initialOnce,
      );
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return singleAsyncYielded(
        groupByAsync(provider, keySelector, groups),
        () => Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    max(callback) {
      return singleAsyncYielded(
        maxAsync(provider, callback),
        _internalY.getUndefined,
      );
    },
    min(callback) {
      return singleAsyncYielded(
        minAsync(provider, callback),
        _internalY.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return singleAsyncYielded(
        reduceAsync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    toReverse() {
      const reverseProvider = toReverseAsync(provider);
      return iterableAsyncYielded(reverseProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(reverseProvider, signal);
        },
      });
    },
    skip(count) {
      return iterableAsyncYielded(skipAsync(provider, count));
    },
    skipLast(count) {
      return iterableAsyncYielded(skipLastAsync(provider, count));
    },
    skipWhile(predicate) {
      return iterableAsyncYielded(skipWhileAsync(provider, predicate));
    },
    some(predicate) {
      return singleAsyncYielded(someAsync(provider, predicate), () => false);
    },
    toSorted(comparator) {
      const sortedProvider = toSortedAsync(provider, comparator);
      return iterableAsyncYielded(sortedProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(sortedProvider, signal);
        },
      });
    },
    take(count) {
      return iterableAsyncYielded(takeAsync(provider, count));
    },
    takeLast(count) {
      const takeLastProvider = takeLastAsync(provider, count);
      return iterableAsyncYielded(takeLastProvider, {
        collect(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return iterableAsyncYielded(takeWhileAsync(provider, predicate));
    },
  };
}
