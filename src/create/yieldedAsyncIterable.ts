import { _yielded } from "../_internal.ts";
import { everyAsync } from "../consumers/every.ts";
import { findAsync } from "../consumers/find.ts";
import { groupByAsync } from "../consumers/groupBy.ts";
import { maxByAsync } from "../consumers/maxBy.ts";
import { minByAsync } from "../consumers/minBy.ts";
import { reduceAsync } from "../consumers/reduce.ts";
import { someAsync } from "../consumers/some.ts";
import { toArrayAsync } from "../consumers/toArray.ts";
import { toReverseAsync } from "../consumers/toReverse.ts";
import { toSortedAsync } from "../consumers/toSorted.ts";
import { distinctByAsync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedAsync } from "../generators/filters/distinctUntilChanged.ts";
import { skipAsync } from "../generators/filters/drop.ts";
import { dropLastAsync } from "../generators/filters/dropLast.ts";
import { dropWhileAsync } from "../generators/filters/dropWhile.ts";
import { filterAsync } from "../generators/filters/filter.ts";
import { takeAsync } from "../generators/filters/take.ts";
import { takeLastAsync } from "../generators/filters/takeLast.ts";
import { takeWhileAsync } from "../generators/filters/takeWhile.ts";
import { batchAsync } from "../generators/grouppers/batch.ts";
import { chunkByAsync } from "../generators/grouppers/chunkBy.ts";
import { liftAsync } from "../generators/misc/lift.ts";
import { mapAsync } from "../generators/misc/map.ts";
import { tapAsync } from "../generators/misc/tap.ts";
import { countByAsync } from "../generators/reducers/countBy.ts";
import { flatAsync } from "../generators/spreaders/flat.ts";
import { flatMapAsync } from "../generators/spreaders/flatMap.ts";
import type { AsyncYieldedIterator, YieldedSyncGenerator } from "../types.ts";
import { nextToParent } from "./toInvokable.ts";

const stringTag = "YieldedAsyncIterable";

type T = IteratorObject<boolean>;

export function yieldedAsyncIterable<TArgs extends any[], TInput, TReturn>(
  returnsResult: TReturn extends TInput[] ? true : false,
  current: (...args: TArgs) => YieldedSyncGenerator<TInput>,
): AsyncYieldedIterator<TInput> {
  const toParent = nextToParent(current);
  return {
    [Symbol.toStringTag]: stringTag,
    async *[Symbol.asyncIterator]() {
      for await (const next of current(...([] as unknown as TArgs))) {
        yield next;
      }
    },
    batch(predicate) {
      return yieldedAsyncIterable(
        false,
        toParent(batchAsync(current, predicate)),
      );
    },
    chunkBy(fn) {
      return yieldedAsyncIterable(false, chunkByAsync(current, fn));
    },
    countBy(fn) {
      return yieldedAsyncIterable(
        false,
        countByAsync(current, fn),
        _yielded.getZero,
      );
    },
    distinctBy(selector) {
      return yieldedAsyncIterable(false, distinctByAsync(current, selector));
    },
    distinctUntilChanged(isEqual) {
      return yieldedAsyncIterable(
        false,
        distinctUntilChangedAsync(current, isEqual),
      );
    },
    every(predicate) {
      return yieldedAsyncIterable(false, everyAsync(current, predicate));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return yieldedAsyncIterable(
        filterAsync<TInput, TOutput>(current, predicate),
      );
    },
    find(predicate: (next: Awaited<TInput>) => boolean) {
      return yieldedAsyncIterable(findAsync(current, predicate));
    },
    flat(depth) {
      return yieldedAsyncIterable(flatAsync(current, depth));
    },
    flatMap(callback) {
      return yieldedAsyncIterable(flatMapAsync(current, callback));
    },
    groupBy(
      keySelector: (next: any) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return yieldedAsyncIterable(
        false,
        groupByAsync(current, keySelector, groups),
      );
    },
    lift(middleware) {
      return yieldedAsyncIterable(liftAsync(current, middleware));
    },
    map(mapper) {
      return yieldedAsyncIterable(mapAsync(current, mapper));
    },
    maxBy(callback) {
      return yieldedAsyncIterable(maxByAsync(current, callback));
    },
    minBy(callback) {
      return yieldedAsyncIterable(minByAsync(current, callback));
    },
    reduce(reducer, initialValue) {
      return yieldedAsyncIterable(
        reduceAsync(current, reducer, initialValue),
        () => initialValue,
      );
    },
    toArray(...args: TArgs) {
      return toArrayAsync(returnsResult, current, args);
    },
    skip(count) {
      return yieldedAsyncIterable(false, skipAsync(current, count));
    },
    skipLast(count) {
      return yieldedAsyncIterable(false, dropLastAsync(current, count));
    },
    skipWhile(predicate) {
      return yieldedAsyncIterable(false, dropWhileAsync(current, predicate));
    },
    some(predicate) {
      return yieldedAsyncIterable(
        false,
        someAsync(current, predicate),
        () => false,
      );
    },
    take(count) {
      return yieldedAsyncIterable(false, takeAsync(current, count));
    },
    takeLast(count) {
      return yieldedAsyncIterable(false, takeLastAsync(current, count));
    },
    takeWhile(predicate) {
      return yieldedAsyncIterable(false, takeWhileAsync(current, predicate));
    },
    tap(callback) {
      return yieldedAsyncIterable(false, tapAsync(current, callback));
    },
    toReverse() {
      return yieldedAsyncIterable(false, rue, toReverseAsync(current));
    },
    toSorted(comparator) {
      return yieldedAsyncIterable(
        false,
        rue,
        toSortedAsync(current, comparator),
      );
    },
  };
}
