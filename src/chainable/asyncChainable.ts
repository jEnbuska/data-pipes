import { createAsyncConsumers } from "../create-consumers.ts";
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
} from "../generators";
import { type AsyncChainable, type AsyncProviderFunction } from "../types.ts";
import { foldAsync } from "../generators/reducers/fold.ts";
import { createDefault, returnUndefined } from "../utils.ts";
import { createInitialGroups } from "../generators/reducers/groupBy.ts";

import { toArrayAsyncFromReturn } from "../consumers/toArray.ts";

export function createAsyncChainable<TInput, TDefault = undefined>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
): AsyncChainable<TInput, TDefault> {
  return {
    isAsync: true,
    ...createAsyncConsumers(source, getDefault),
    batch(predicate) {
      return createAsyncChainable(
        batchAsync(source, predicate),
        createDefault<TInput[]>([]),
      );
    },
    chunkBy(fn) {
      return createAsyncChainable(
        chunkByAsync(source, fn),
        createDefault<TInput[]>([]),
      );
    },
    count() {
      return createAsyncChainable(countAsync(source), createDefault(0));
    },
    countBy(fn) {
      return createAsyncChainable(countByAsync(source, fn), createDefault(0));
    },
    defaultTo(getDefault) {
      return createAsyncChainable(
        defaultToAsync(source, getDefault),
        getDefault,
      );
    },
    distinctBy(selector) {
      return createAsyncChainable(
        distinctByAsync(source, selector),
        returnUndefined,
      );
    },
    distinctUntilChanged(isEqual) {
      return createAsyncChainable(
        distinctUntilChangedAsync(source, isEqual),
        returnUndefined,
      );
    },
    every(predicate) {
      const everySource = everyAsync(source, predicate);
      return createAsyncChainable(everySource, createDefault<true>(true));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createAsyncChainable(
        filterAsync<TInput, TOutput>(source, predicate),
        returnUndefined,
      );
    },
    find(predicate) {
      return createAsyncChainable(
        findAsync(source, predicate),
        returnUndefined,
      );
    },
    flat(depth) {
      return createAsyncChainable(flatAsync(source, depth), returnUndefined);
    },
    flatMap(callback) {
      return createAsyncChainable(
        flatMapAsync(source, callback),
        returnUndefined,
      );
    },
    fold(initial, reducer) {
      return createAsyncChainable(foldAsync(source, initial, reducer), initial);
    },
    forEach(consumer) {
      return createAsyncChainable(forEachAsync(source, consumer), getDefault);
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return createAsyncChainable(
        groupByAsync(source, keySelector, groups),
        () => Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    lift(middleware) {
      return createAsyncChainable(middleware(source), returnUndefined);
    },
    map(mapper) {
      return createAsyncChainable(mapAsync(source, mapper), returnUndefined);
    },
    max(callback) {
      return createAsyncChainable(maxAsync(source, callback), returnUndefined);
    },
    min(callback) {
      return createAsyncChainable(minAsync(source, callback), returnUndefined);
    },
    reduce(reducer, initialValue) {
      return createAsyncChainable(
        reduceAsync(source, reducer, initialValue),
        createDefault(initialValue),
      );
    },
    reverse() {
      return createAsyncChainableFromListReturn(reverseAsync(source));
    },
    skip(count) {
      return createAsyncChainable(skipAsync(source, count), returnUndefined);
    },
    skipLast(count) {
      return createAsyncChainable(
        skipLastAsync(source, count),
        returnUndefined,
      );
    },
    skipWhile(predicate) {
      return createAsyncChainable(
        skipWhileAsync(source, predicate),
        returnUndefined,
      );
    },
    some(predicate) {
      const someSource = someAsync(source, predicate);
      return createAsyncChainable(someSource, createDefault<false>(false));
    },
    sort(comparator) {
      return createAsyncChainableFromListReturn(sortAsync(source, comparator));
    },
    take(count) {
      return createAsyncChainable(takeAsync(source, count), returnUndefined);
    },
    takeLast(count) {
      return createAsyncChainableFromListReturn(takeLastAsync(source, count));
    },
    takeWhile(predicate) {
      return createAsyncChainable(
        takeWhileAsync(source, predicate),
        returnUndefined,
      );
    },
  };
}

function createAsyncChainableFromListReturn<TInput>(
  source: AsyncProviderFunction<TInput, TInput[]>,
): AsyncChainable<TInput> {
  return {
    ...createAsyncChainable(source, returnUndefined),
    toArray(signal?: AbortSignal) {
      return toArrayAsyncFromReturn<TInput>(source, signal);
    },
  };
}
