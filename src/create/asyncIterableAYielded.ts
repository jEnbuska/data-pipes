import { _yielded } from "../_internal.ts";
import { consumeAsync } from "../consumers/consume.ts";
import { toArrayAsync, toArrayAsyncFromReturn } from "../consumers/toArray.ts";
import { distinctByAsync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedAsync } from "../generators/filters/distinctUntilChanged.ts";
import { skipAsync } from "../generators/filters/drop.ts";
import { skipLastAsync } from "../generators/filters/dropLast.ts";
import { skipWhileAsync } from "../generators/filters/dropWhile.ts";
import { filterAsync } from "../generators/filters/filter.ts";
import { takeAsync } from "../generators/filters/take.ts";
import { takeLastAsync } from "../generators/filters/takeLast.ts";
import { takeWhileAsync } from "../generators/filters/takeWhile.ts";
import { everyAsync } from "../generators/finders/every.ts";
import { findAsync } from "../generators/finders/find.ts";
import { someAsync } from "../generators/finders/some.ts";
import { batchAsync } from "../generators/grouppers/batch.ts";
import { chunkByAsync } from "../generators/grouppers/chunkBy.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { countAsync } from "../generators/reducers/count.ts";
import { countByAsync } from "../generators/reducers/countBy.ts";
import {
  createInitialGroups,
  groupByAsync,
} from "../generators/reducers/groupBy.ts";
import { maxAsync } from "../generators/reducers/maxBy.ts";
import { minAsync } from "../generators/reducers/minBy.ts";
import { reduceAsync } from "../generators/reducers/reduce.ts";
import { toReverseAsync } from "../generators/sorters/toReverse.ts";
import { toSortedAsync } from "../generators/sorters/toSorted.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import {
  type AsyncIterableYielded,
  type YieldedAsyncProvider,
} from "../types.ts";
import { asyncSingleYielded } from "./asyncSingleYielded.ts";

const stringTag = "AsyncIterableYielded";
export function asyncIterableAYielded<In>(
  provider: YieldedAsyncProvider<Awaited<In>>,
  overrides: Partial<AsyncIterableYielded<In>> = {},
): AsyncIterableYielded<In> {
  return {
    ...overrides,
    [Symbol.toStringTag]: stringTag,
    async *[Symbol.asyncIterator]() {
      const signal = new AbortController().signal;
      using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
      for await (const next of generator) {
        yield next;
      }
    },
    batch(predicate) {
      return asyncIterableAYielded(batchAsync(provider, predicate));
    },
    chunkBy(fn) {
      return asyncIterableAYielded(chunkByAsync(provider, fn));
    },
    consume(signal?: AbortSignal) {
      return consumeAsync<In>(provider, signal);
    },
    count() {
      return asyncSingleYielded(countAsync(provider), _yielded.getZero);
    },
    countBy(fn) {
      return asyncSingleYielded(countByAsync(provider, fn), _yielded.getZero);
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
        _yielded.getTrue,
      );
    },
    filter<Out extends In>(predicate: (next: In) => next is R) {
      return asyncIterableAYielded(filterAsync<In, Out>(provider, predicate));
    },
    find(predicate: (next: Awaited<In>) => boolean) {
      return asyncSingleYielded(
        findAsync(provider, predicate),
        _yielded.getUndefined,
      );
    },
    flat(depth) {
      return asyncIterableAYielded(flatAsync(provider, depth));
    },
    flatMap(callback) {
      return asyncIterableAYielded(flatMapAsync(provider, callback));
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
    lift(middleware) {
      return asyncIterableAYielded(liftAsync(provider, middleware));
    },
    map(mapper) {
      return asyncIterableAYielded(mapAsync(provider, mapper));
    },
    max(callback) {
      return asyncSingleYielded(
        maxAsync(provider, callback),
        _yielded.getUndefined,
      );
    },
    min(callback) {
      return asyncSingleYielded(
        minAsync(provider, callback),
        _yielded.getUndefined,
      );
    },
    reduce(reducer, initialValue) {
      return asyncSingleYielded(
        reduceAsync(provider, reducer, initialValue),
        () => initialValue,
      );
    },
    resolve(signal?: AbortSignal) {
      return toArrayAsync(provider, signal);
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
    tap(callback) {
      return asyncIterableAYielded(tapAsync(provider, callback));
    },
    toReverse() {
      const reverseProvider = toReverseAsync(provider);
      return asyncIterableAYielded(reverseProvider, {
        resolve(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(reverseProvider, signal);
        },
      });
    },
    toSorted(comparator) {
      const sortedProvider = toSortedAsync(provider, comparator);
      return asyncIterableAYielded(sortedProvider, {
        resolve(signal?: AbortSignal) {
          return toArrayAsyncFromReturn(sortedProvider, signal);
        },
      });
    },
  };
}
