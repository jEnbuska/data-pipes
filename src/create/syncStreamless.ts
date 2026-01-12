import { asyncStreamless } from "./asyncStreamless";
import {
  batch,
  chunkBy,
  count,
  countBy,
  distinctBy,
  distinctUntilChanged,
  every,
  filter,
  find,
  flat,
  flatMap,
  forEach,
  groupBy,
  map,
  max,
  min,
  reduce,
  resolve,
  reverse,
  skip,
  skipLast,
  skipWhile,
  some,
  sort,
  take,
  takeLast,
  takeWhile,
  defaultTo,
  fold,
} from "../generators";
import { type SyncStreamless, type StreamlessProvider } from "../types";
import { InternalStreamless } from "../utils";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { toArrayFromReturn, toArray } from "../consumers/toArray";
import { consume, first } from "../consumers";
import { resolveParallel } from "../generators/mappers/resolve";

export function syncStreamless<TInput, TDefault = undefined>(
  source: StreamlessProvider<TInput>,
  getDefault: () => TDefault,
): SyncStreamless<TInput, TDefault> {
  return {
    batch(predicate) {
      return syncStreamless(
        batch(source, predicate),
        InternalStreamless.getEmptyList<TInput>,
      );
    },
    chunkBy(fn) {
      return syncStreamless(
        chunkBy(source, fn),
        InternalStreamless.getEmptyList<TInput>,
      );
    },
    count() {
      return syncStreamless(count(source), InternalStreamless.getZero);
    },
    countBy(fn) {
      return syncStreamless(countBy(source, fn), InternalStreamless.getZero);
    },
    defaultTo(getDefault) {
      return syncStreamless(defaultTo(source, getDefault), getDefault);
    },
    distinctBy(selector) {
      return syncStreamless(
        distinctBy(source, selector),
        InternalStreamless.getUndefined,
      );
    },
    distinctUntilChanged(isEqual) {
      return syncStreamless(
        distinctUntilChanged(source, isEqual),
        InternalStreamless.getUndefined,
      );
    },
    every(predicate) {
      return syncStreamless(every(source, predicate), () => true);
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncStreamless(
        filter<TInput, TOutput>(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    find(predicate) {
      return syncStreamless(
        find(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    flat(depth) {
      return syncStreamless(
        flat(source, depth),
        InternalStreamless.getUndefined,
      );
    },
    flatMap(callback) {
      return syncStreamless(
        flatMap(source, callback),
        InternalStreamless.getUndefined,
      );
    },
    fold(initial, reducer) {
      const initialOnce = InternalStreamless.once(initial);
      return syncStreamless(fold(source, initialOnce, reducer), initialOnce);
    },
    forEach(consumer) {
      return syncStreamless(forEach(source, consumer), getDefault);
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return syncStreamless(groupBy(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    lift(middleware) {
      return syncStreamless(
        middleware(source),
        InternalStreamless.getUndefined,
      );
    },
    map(mapper) {
      return syncStreamless(
        map(source, mapper),
        InternalStreamless.getUndefined,
      );
    },
    max(callback) {
      return syncStreamless(
        max(source, callback),
        InternalStreamless.getUndefined,
      );
    },
    min(callback) {
      return syncStreamless(
        min(source, callback),
        InternalStreamless.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return syncStreamless(
        reduce(source, reducer, initialValue),
        () => initialValue,
      );
    },
    resolve() {
      return asyncStreamless(resolve(source), getDefault);
    },
    resolveParallel(count = 100) {
      return asyncStreamless(resolveParallel(source, count), getDefault);
    },
    reverse() {
      return syncStreamlessFromListReturn(reverse(source));
    },
    skip(count) {
      return syncStreamless(
        skip(source, count),
        InternalStreamless.getUndefined,
      );
    },
    skipLast(count) {
      return syncStreamless(
        skipLast(source, count),
        InternalStreamless.getUndefined,
      );
    },
    skipWhile(predicate) {
      return syncStreamless(
        skipWhile(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    some(predicate) {
      return syncStreamless(some(source, predicate), () => false);
    },
    sort(comparator) {
      return syncStreamlessFromListReturn(sort(source, comparator));
    },
    take(count) {
      return syncStreamless(
        take(source, count),
        InternalStreamless.getUndefined,
      );
    },
    takeLast(count) {
      return syncStreamlessFromListReturn(takeLast(source, count));
    },
    takeWhile(predicate) {
      return syncStreamless(
        takeWhile(source, predicate),
        InternalStreamless.getUndefined,
      );
    },
    isAsync: false,
    [Symbol.toStringTag]: "SyncStreamless",
    *[Symbol.iterator]() {
      using generator = InternalStreamless.disposable(source);
      for (const next of generator) {
        yield next;
      }
    },
    toArray(signal?: AbortSignal) {
      return toArray<TInput>(source, signal);
    },
    consume(signal?: AbortSignal) {
      return consume<TInput>(source, signal);
    },
    first(signal?: AbortSignal) {
      return first<TInput, TDefault>(source, getDefault, signal);
    },
  };
}

function syncStreamlessFromListReturn<TInput>(
  source: StreamlessProvider<TInput, TInput[]>,
): SyncStreamless<TInput> {
  return {
    ...syncStreamless(source, InternalStreamless.getUndefined),
    toArray(signal) {
      return toArrayFromReturn<TInput>(source, signal);
    },
  };
}
