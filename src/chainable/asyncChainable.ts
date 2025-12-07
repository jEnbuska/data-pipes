import { createAsyncConsumable } from "../create-consumable.ts";
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
import {
  type AsyncChainable,
  type AsyncPipeSource,
  type AsyncLiftMiddleware,
} from "../types.ts";
import { foldAsync } from "../generators/reducers/fold.ts";
import { createDefault, returnUndefined } from "../utils.ts";
import { createInitialGroups } from "../generators/reducers/groupBy.ts";

import { toArrayAsyncFromReturn } from "../consumers/toArray.ts";

export function createAsyncChainable<TInput, TDefault = undefined>(
  source: AsyncPipeSource<TInput>,
  getDefault: () => TDefault,
): AsyncChainable<TInput, TDefault> {
  return {
    batch(predicate) {
      return createAsyncChainable(
        batchAsync(source, predicate),
        createDefault<TInput[]>([]),
      );
    },
    ...createAsyncConsumable<TInput, TDefault>(source, getDefault),
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
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
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return createAsyncChainable(
        defaultToAsync(source, getDefault),
        getDefault,
      );
    },
    distinctBy<TValue>(selector: (next: TInput) => TValue) {
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
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createAsyncChainable(
        flatAsync<TInput, TDepth>(source, depth),
        returnUndefined,
      );
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createAsyncChainable(
        flatMapAsync<TInput, TOutput>(source, callback),
        returnUndefined,
      );
    },
    fold<TOutput>(
      initial: () => TOutput,
      reducer: (acc: TOutput, next: TInput) => TOutput,
    ) {
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
    isAsync: true,
    lift(middleware: AsyncLiftMiddleware<any, any>) {
      return createAsyncChainable(middleware(source), returnUndefined);
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createAsyncChainable(
        mapAsync<TInput, TOutput>(source, mapper),
        returnUndefined,
      );
    },
    max(callback) {
      return createAsyncChainable(maxAsync(source, callback), returnUndefined);
    },
    min(callback) {
      return createAsyncChainable(minAsync(source, callback), returnUndefined);
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createAsyncChainable(
        reduceAsync(source, reducer, initialValue),
        createDefault(initialValue),
      );
    },
    reverse() {
      const asyncReverseSource = reverseAsync(source);
      return {
        ...createAsyncChainable(asyncReverseSource, returnUndefined),
        toArray(signal) {
          return toArrayAsyncFromReturn(asyncReverseSource, signal);
        },
      };
    },
    skip(count) {
      return createAsyncChainable(skipAsync(source, count), returnUndefined);
    },
    skipLast(count: number) {
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
      const asyncSortSource = sortAsync(source, comparator);
      return {
        ...createAsyncChainable(asyncSortSource, returnUndefined),
        toArray(signal) {
          return toArrayAsyncFromReturn(asyncSortSource, signal);
        },
      };
    },
    take(count) {
      return createAsyncChainable(takeAsync(source, count), returnUndefined);
    },
    takeLast(count) {
      return createAsyncChainable(
        takeLastAsync(source, count),
        returnUndefined,
      );
    },
    takeWhile(predicate) {
      return createAsyncChainable(
        takeWhileAsync(source, predicate),
        returnUndefined,
      );
    },
  };
}
