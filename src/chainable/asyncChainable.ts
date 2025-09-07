import type {
  Chainable,
  AsyncGeneratorProvider,
  GeneratorMiddleware,
} from "../types.ts";
import { createAsyncConsumable } from "../create-consumable.ts";
import {
  reverse,
  find,
  defaultIfEmpty,
  min,
  max,
  distinctBy,
  distinctUntilChanged,
  sort,
  groupBy,
  flat,
  map,
  flatMap,
  filter,
  reduce,
  forEach,
  skipWhile,
  skip,
  take,
  count,
  takeWhile,
  every,
  some,
} from "../generators";
import { skipLastAsync } from "../generators/skipLast/skipLast.ts";
import { takeLastAsync } from "../generators/takeLast/takeLast.ts";
import { reverseAsync } from "../generators/reverse/reverse.ts";
import { findAsync } from "../generators/find/find.ts";
import { defaultIfEmptyAsync } from "../generators/defaultIfEmpty/defaultIfEmpty.ts";
import { minAsync } from "../generators/min/min.ts";
import { maxAsync } from "../generators/max/max.ts";
import { distinctByAsync } from "../generators/distinctBy/distinctBy.ts";
import { sortAsync } from "../generators/sort/sort.ts";
import { distinctUntilChangedAsync } from "../generators/distinctUntilChanged/distinctUntilChanged.ts";
import { groupByAsync } from "../generators/groupBy/groupBy.ts";
import { flatAsync } from "../generators/flat/flat.ts";
import { mapAsync } from "../generators/map/map.ts";
import { flatMapAsync } from "../generators/flatMap/flatMap.ts";
import { filterAsync } from "../generators/filter/filter.ts";
import { reduceAsync } from "../generators/reduce/reduce.ts";
import { forEachAsync } from "../generators/forEach/forEach.ts";
import { skipWhileAsync } from "../generators/skipWhile/skipWhile.ts";
import { skipAsync } from "../generators/skip/skip.ts";
import { takeAsync } from "../generators/take/take.ts";
import { countAsync } from "../generators/count/count.ts";
import { takeWhileAsync } from "../generators/takeWhile/takeWhile.ts";
import { everyAsync } from "../generators/every/every.ts";
import { someAsync } from "../generators/some/some.ts";
import { countByAsync } from "../generators/countBy/countBy.ts";

export function createAsyncChainable<TInput = unknown>(
  generator: AsyncGeneratorProvider<TInput>,
): Chainable<TInput> {
  return {
    ...createAsyncConsumable(generator),
    reverse() {
      return createAsyncChainable(reverseAsync()(generator));
    },
    find(predicate) {
      return createAsyncChainable(findAsync(predicate)(generator));
    },
    defaultIfEmpty<Default>(defaultValue: Default) {
      return createAsyncChainable(
        defaultIfEmptyAsync<Default, TInput>(defaultValue)(generator),
      );
    },
    min(callback) {
      return createAsyncChainable(minAsync(callback)(generator));
    },
    max(callback) {
      return createAsyncChainable(maxAsync(callback)(generator));
    },
    distinctBy<Value>(selector: (next: TInput) => Value) {
      return createAsyncChainable(distinctByAsync(selector)(generator));
    },
    distinctUntilChanged(isEqual) {
      return createAsyncChainable(
        distinctUntilChangedAsync(isEqual)(generator),
      );
    },
    sort(comparator) {
      return createAsyncChainable(sortAsync(comparator)(generator));
    },
    lift<TOutput>(middleware: GeneratorMiddleware<TInput, TOutput, true>) {
      return createAsyncChainable<TOutput>(middleware(generator));
    },
    groupBy<
      Key extends PropertyKey,
      Groups extends Array<Key | PropertyKey> = [],
    >(keySelector: (next: TInput) => Key | PropertyKey, groups?: Groups) {
      return createAsyncChainable(
        groupByAsync<TInput, Key, Groups>(keySelector, groups)(generator),
      );
    },
    flat<Depth extends number = 1>(depth?: Depth) {
      return createAsyncChainable(flatAsync(depth)(generator));
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createAsyncChainable(mapAsync(mapper)(generator));
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createAsyncChainable(flatMapAsync(callback)(generator));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createAsyncChainable(
        filterAsync<TInput, TOutput>(predicate)(generator),
      );
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createAsyncChainable(
        reduceAsync(reducer, initialValue)(generator),
      );
    },
    forEach(consumer) {
      return createAsyncChainable(forEachAsync(consumer)(generator));
    },
    skipWhile(predicate) {
      return createAsyncChainable(skipWhileAsync(predicate)(generator));
    },
    skip(count) {
      return createAsyncChainable(skipAsync(count)(generator));
    },
    skipLast(count: number): Chainable<TInput> {
      return createAsyncChainable(skipLastAsync(count)(generator));
    },
    take(count) {
      return createAsyncChainable(takeAsync(count)(generator));
    },
    takeLast(count) {
      return createAsyncChainable(takeLastAsync(count)(generator));
    },
    count() {
      return createAsyncChainable(countAsync()(generator));
    },
    takeWhile(predicate) {
      return createAsyncChainable(takeWhileAsync(predicate)(generator));
    },
    every(predicate) {
      return createAsyncChainable(everyAsync(predicate)(generator));
    },
    some(predicate) {
      return createAsyncChainable(someAsync(predicate)(generator));
    },
    countBy(fn) {
      return createAsyncChainable(countByAsync(fn)(generator));
    },
  };
}
