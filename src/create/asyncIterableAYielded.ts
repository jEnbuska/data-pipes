import {
  type YieldedAsyncProvider,
  type AsyncIterableYielded,
} from "../types.ts";
import { _internalY } from "../utils.ts";
import { toArrayAsyncFromReturn, toArrayAsync } from "../consumers/toArray.ts";
import { consumeAsync } from "../consumers/consume.ts";
import {
  createInitialGroups,
  groupByAsync,
} from "../generators/reducers/groupBy.ts";
import { asyncSingleYielded } from "./asyncSingleYielded.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { findAsync } from "../generators/finders/find.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { countByAsync } from "../generators/reducers/countBy.ts";
import { countAsync } from "../generators/reducers/count.ts";
import { chunkByAsync } from "../generators/grouppers/chunkBy.ts";
import { batchAsync } from "../generators/grouppers/batch.ts";
import { distinctByAsync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedAsync } from "../generators/filters/distinctUntilChanged.ts";
import { everyAsync } from "../generators/finders/every.ts";
import { filterAsync } from "../generators/filters/filter.ts";
import { foldAsync } from "../generators/reducers/fold.ts";
import { maxAsync } from "../generators/reducers/max.ts";
import { minAsync } from "../generators/reducers/min.ts";
import { reduceAsync } from "../generators/reducers/reduce.ts";
import { toReverseAsync } from "../generators/sorters/toReverse.ts";
import { skipAsync } from "../generators/filters/skip.ts";
import { skipLastAsync } from "../generators/filters/skipLast.ts";
import { skipWhileAsync } from "../generators/filters/skipWhile.ts";
import { someAsync } from "../generators/finders/some.ts";
import { toSortedAsync } from "../generators/sorters/toSorted.ts";
import { takeAsync } from "../generators/filters/take.ts";
import { takeLastAsync } from "../generators/filters/takeLast.ts";
import { takeWhileAsync } from "../generators/filters/takeWhile.ts";

const stringTag = "AsyncIterableYielded";
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
    resolve(signal?: AbortSignal) {
      return toArrayAsync(provider, signal);
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<TInput>(provider, signal);
    },
    [Symbol.toStringTag]: stringTag,
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
      return asyncIterableAYielded(
        filterAsync<TInput, TOutput>(provider, predicate),
      );
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
        resolve(signal?: AbortSignal) {
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
        resolve(signal?: AbortSignal) {
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
        resolve(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(takeLastProvider, signal);
        },
      });
    },
    takeWhile(predicate) {
      return asyncIterableAYielded(takeWhileAsync(provider, predicate));
    },
  };
}
