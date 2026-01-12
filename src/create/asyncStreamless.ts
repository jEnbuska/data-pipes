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
import { type AsyncStreamless, type AsyncStreamlessProvider } from "../types";
import { InternalStreamless } from "../utils";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { toArrayAsyncFromReturn, toArrayAsync } from "../consumers/toArray";
import { consumeAsync } from "../consumers/consume";
import { firstAsync } from "../consumers/first";

export function asyncStreamless<TInput, TDefault = undefined>(
  source: AsyncStreamlessProvider<TInput>,
  getDefault: () => TDefault,
): AsyncStreamless<TInput, TDefault> {
  return {
    batch(predicate) {
      return asyncStreamless(
        batchAsync(source, predicate),
        InternalStreamless.getEmptyList<TInput>,
      );
    },
    chunkBy(fn) {
      return asyncStreamless(
        chunkByAsync(source, fn),
        InternalStreamless.getEmptyList<TInput>,
      );
    },
    count() {
      return asyncStreamless(countAsync(source), InternalStreamless.getZero);
    },
    countBy(fn) {
      return asyncStreamless(
        countByAsync(source, fn),
        InternalStreamless.getZero,
      );
    },
    defaultTo(getDefault) {
      return asyncStreamless(defaultToAsync(source, getDefault), getDefault);
    },
    distinctBy(selector) {
      return asyncStreamless(
        distinctByAsync(source, selector),
        InternalStreamless.getUndefined,
      );
    },
    distinctUntilChanged(isEqual) {
      return asyncStreamless(
        distinctUntilChangedAsync(source, isEqual),
        InternalStreamless.getUndefined,
      );
    },
    every(predicate) {
      const everySource = everyAsync(source, predicate);
      return asyncStreamless(everySource, () => true);
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return asyncStreamless(
        filterAsync<TInput, TOutput>(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    find(predicate) {
      return asyncStreamless(
        findAsync(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return asyncStreamless(
        flatAsync(source, depth),
        InternalStreamless.getUndefined,
      );
    },
    flatMap(callback) {
      return asyncStreamless(
        flatMapAsync(source, callback),
        InternalStreamless.getUndefined,
      );
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
      return asyncStreamless(
        middleware(source),
        InternalStreamless.getUndefined,
      );
    },
    map(mapper) {
      return asyncStreamless(
        mapAsync(source, mapper),
        InternalStreamless.getUndefined,
      );
    },
    max(callback) {
      return asyncStreamless(
        maxAsync(source, callback),
        InternalStreamless.getUndefined,
      );
    },
    min(callback) {
      return asyncStreamless(
        minAsync(source, callback),
        InternalStreamless.getUndefined,
      );
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
        InternalStreamless.getUndefined,
      );
    },
    skipLast(count) {
      return asyncStreamless(
        skipLastAsync(source, count),
        InternalStreamless.getUndefined,
      );
    },
    skipWhile(predicate) {
      return asyncStreamless(
        skipWhileAsync(source, predicate),
        InternalStreamless.getUndefined,
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
      return asyncStreamless(
        takeAsync(source, count),
        InternalStreamless.getUndefined,
      );
    },
    takeLast(count) {
      return asyncStreamlessFromListReturn(takeLastAsync(source, count));
    },
    takeWhile(predicate) {
      return asyncStreamless(
        takeWhileAsync(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    isAsync: true,
    [Symbol.toStringTag]: "AsyncStreamless",
    async *[Symbol.asyncIterator]() {
      using generator = InternalStreamless.disposable(source);
      for await (const next of generator) {
        yield next;
      }
    },
    toArray(signal?: AbortSignal) {
      return toArrayAsync<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return firstAsync<TInput, TDefault>(source, getDefault, signal);
    },
  };
}

function asyncStreamlessFromListReturn<TInput>(
  source: AsyncStreamlessProvider<TInput, TInput[]>,
): AsyncStreamless<TInput> {
  return {
    ...asyncStreamless(source, InternalStreamless.getUndefined),
    toArray(signal?: AbortSignal) {
      return toArrayAsyncFromReturn<TInput>(source, signal);
    },
  };
}
