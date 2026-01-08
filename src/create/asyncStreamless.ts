import {
  chunkByAsync,
  countAsync,
  countByAsync,
  distinctByAsync,
  distinctUntilChangedAsync,
  everyAsync,
  filterAsync,
  findAsync,
  flatAsync,
  flatMapAsync,
  forEachAsync,
  groupByAsync,
  mapAsync,
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
  batchAsync,
  defaultToAsync,
  foldAsync,
} from "../generators";
import { type AsyncStreamless, type AsyncProviderFunction } from "../types";
import { InternalStreamless } from "../utils";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { toArrayAsyncFromReturn } from "../consumers/toArray";
import asyncStreamlessConsumers from "./asyncStreamlessConsumers";

export function asyncStreamless<TInput, TDefault = undefined>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
): AsyncStreamless<TInput, TDefault> {
  return {
    isAsync: true,
    ...asyncStreamlessConsumers(source, getDefault),
    batch(predicate) {
      return asyncStreamless(batchAsync(source, predicate), (): TInput[] => []);
    },
    chunkBy(fn) {
      return asyncStreamless(chunkByAsync(source, fn), (): TInput[] => []);
    },
    count() {
      return asyncStreamless(countAsync(source), () => 0);
    },
    countBy(fn) {
      return asyncStreamless(countByAsync(source, fn), () => 0);
    },
    defaultTo(getDefault) {
      return asyncStreamless(defaultToAsync(source, getDefault), getDefault);
    },
    distinctBy(selector) {
      return asyncStreamless(
        distinctByAsync(source, selector),
        () => undefined,
      );
    },
    distinctUntilChanged(isEqual) {
      return asyncStreamless(
        distinctUntilChangedAsync(source, isEqual),
        () => undefined,
      );
    },
    every(predicate) {
      const everySource = everyAsync(source, predicate);
      return asyncStreamless(
        everySource,
        InternalStreamless.createDefault<true>(true),
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return asyncStreamless(
        filterAsync<TInput, TOutput>(source, predicate),
        () => undefined,
      );
    },
    find(predicate) {
      return asyncStreamless(findAsync(source, predicate), () => undefined);
    },
    flat(depth) {
      return asyncStreamless(flatAsync(source, depth), () => undefined);
    },
    flatMap(callback) {
      return asyncStreamless(flatMapAsync(source, callback), () => undefined);
    },
    fold(initial, reducer) {
      const initialOnce = InternalStreamless.once(initial);
      return asyncStreamless(
        foldAsync(source, initialOnce, reducer),
        initialOnce,
      );
    },
    forEach(consumer) {
      return asyncStreamless(forEachAsync(source, consumer), getDefault);
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return asyncStreamless(groupByAsync(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    lift(middleware) {
      return asyncStreamless(middleware(source), () => undefined);
    },
    map(mapper) {
      return asyncStreamless(mapAsync(source, mapper), () => undefined);
    },
    max(callback) {
      return asyncStreamless(maxAsync(source, callback), () => undefined);
    },
    min(callback) {
      return asyncStreamless(minAsync(source, callback), () => undefined);
    },
    reduce(reducer, initialValue) {
      return asyncStreamless(
        reduceAsync(source, reducer, initialValue),
        () => initialValue,
      );
    },
    reverse() {
      return asyncStreamlessFromListReturn(reverseAsync(source));
    },
    skip(count) {
      return asyncStreamless(
        skipAsync(source, count),
        InternalStreamless.createDefault(undefined),
      );
    },
    skipLast(count) {
      return asyncStreamless(skipLastAsync(source, count), () => undefined);
    },
    skipWhile(predicate) {
      return asyncStreamless(
        skipWhileAsync(source, predicate),
        () => undefined,
      );
    },
    some(predicate) {
      const someSource = someAsync(source, predicate);
      return asyncStreamless(someSource, () => false as const);
    },
    sort(comparator) {
      return asyncStreamlessFromListReturn(sortAsync(source, comparator));
    },
    take(count) {
      return asyncStreamless(takeAsync(source, count), () => undefined);
    },
    takeLast(count) {
      return asyncStreamlessFromListReturn(takeLastAsync(source, count));
    },
    takeWhile(predicate) {
      return asyncStreamless(
        takeWhileAsync(source, predicate),
        () => undefined,
      );
    },
  };
}

function asyncStreamlessFromListReturn<TInput>(
  source: AsyncProviderFunction<TInput, TInput[]>,
): AsyncStreamless<TInput> {
  return {
    ...asyncStreamless(source, () => undefined),
    toArray(signal?: AbortSignal) {
      return toArrayAsyncFromReturn<TInput>(source, signal);
    },
  };
}
