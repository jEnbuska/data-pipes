import { asyncStreamless } from "./asyncStreamless";
import syncStreamlessConsumers from "./syncStreamlessConsumers";
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
import { type SyncStreamless, type ProviderFunction } from "../types";

import { InternalStreamless } from "../utils";
import { createInitialGroups } from "../generators/reducers/groupBy";
import { toArrayFromReturn } from "../consumers/toArray";

export function syncStreamless<TInput, TDefault = undefined>(
  source: ProviderFunction<TInput>,
  getDefault: () => TDefault,
): SyncStreamless<TInput, TDefault> {
  return {
    isAsync: false,
    ...syncStreamlessConsumers(source, getDefault),
    batch(predicate) {
      return syncStreamless(
        batch(source, predicate),
        InternalStreamless.createDefault<TInput[]>([]),
      );
    },
    chunkBy(fn) {
      return syncStreamless(
        chunkBy(source, fn),
        InternalStreamless.createDefault<TInput[]>([]),
      );
    },
    count() {
      return syncStreamless(count(source), InternalStreamless.createDefault(0));
    },
    countBy(fn) {
      return syncStreamless(
        countBy(source, fn),
        InternalStreamless.createDefault(0),
      );
    },
    defaultTo(getDefault) {
      return syncStreamless(defaultTo(source, getDefault), getDefault);
    },
    distinctBy(selector) {
      return syncStreamless(
        distinctBy(source, selector),
        InternalStreamless.createDefault(undefined),
      );
    },
    distinctUntilChanged(isEqual) {
      return syncStreamless(
        distinctUntilChanged(source, isEqual),
        InternalStreamless.createDefault(undefined),
      );
    },
    every(predicate) {
      return syncStreamless(
        every(source, predicate),
        InternalStreamless.createDefault<true>(true),
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return syncStreamless(
        filter<TInput, TOutput>(source, predicate),
        InternalStreamless.createDefault(undefined),
      );
    },
    find(predicate) {
      return syncStreamless(
        find(source, predicate),
        InternalStreamless.createDefault(undefined),
      );
    },
    flat(depth) {
      return syncStreamless(
        flat(source, depth),
        InternalStreamless.createDefault(undefined),
      );
    },
    flatMap(callback) {
      return syncStreamless(
        flatMap(source, callback),
        InternalStreamless.createDefault(undefined),
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
        InternalStreamless.createDefault(undefined),
      );
    },
    map(mapper) {
      return syncStreamless(
        map(source, mapper),
        InternalStreamless.createDefault(undefined),
      );
    },
    max(callback) {
      return syncStreamless(
        max(source, callback),
        InternalStreamless.createDefault(undefined),
      );
    },
    min(callback) {
      return syncStreamless(
        min(source, callback),
        InternalStreamless.createDefault(undefined),
      );
    },
    reduce(reducer, initialValue) {
      return syncStreamless(
        reduce(source, reducer, initialValue),
        InternalStreamless.createDefault(initialValue),
      );
    },
    resolve() {
      return asyncStreamless(resolve(source), getDefault);
    },
    reverse() {
      return syncStreamlessFromListReturn(reverse(source));
    },
    skip(count) {
      return syncStreamless(
        skip(source, count),
        InternalStreamless.createDefault(undefined),
      );
    },
    skipLast(count) {
      return syncStreamless(
        skipLast(source, count),
        InternalStreamless.createDefault(undefined),
      );
    },
    skipWhile(predicate) {
      return syncStreamless(
        skipWhile(source, predicate),
        InternalStreamless.createDefault(undefined),
      );
    },
    some(predicate) {
      return syncStreamless(
        some(source, predicate),
        InternalStreamless.createDefault<false>(false),
      );
    },
    sort(comparator) {
      return syncStreamlessFromListReturn(sort(source, comparator));
    },
    take(count) {
      return syncStreamless(
        take(source, count),
        InternalStreamless.createDefault(undefined),
      );
    },
    takeLast(count) {
      return syncStreamlessFromListReturn(takeLast(source, count));
    },
    takeWhile(predicate) {
      return syncStreamless(
        takeWhile(source, predicate),
        InternalStreamless.createDefault(undefined),
      );
    },
  };
}

function syncStreamlessFromListReturn<TInput>(
  source: ProviderFunction<TInput, TInput[]>,
): SyncStreamless<TInput> {
  return {
    ...syncStreamless(source, InternalStreamless.createDefault(undefined)),
    toArray(signal) {
      return toArrayFromReturn<TInput>(source, signal);
    },
  };
}
