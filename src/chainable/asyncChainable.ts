import { createAsyncConsumable } from "../create-consumable.ts";
import {
  batchAsync,
  chunkByAsync,
  countAsync,
  countByAsync,
  defaultIfEmptyAsync,
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
} from "../generators";
import {
  type AsyncChainable,
  type AsyncGeneratorProvider,
  type GeneratorMiddleware,
  type GeneratorProvider,
} from "../types.ts";

export function createAsyncChainable<TInput = unknown>(
  generator: AsyncGeneratorProvider<TInput>,
  source:
    | GeneratorProvider<unknown>
    | AsyncGeneratorProvider<unknown> = generator,
): AsyncChainable<TInput> {
  return {
    ...createAsyncConsumable(generator, source),
    batch(predicate) {
      return createAsyncChainable(batchAsync(predicate)(generator), source);
    },
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createAsyncChainable(chunkByAsync(fn)(generator), source);
    },
    count() {
      return createAsyncChainable(countAsync()(generator), source);
    },
    countBy(fn) {
      return createAsyncChainable(countByAsync(fn)(generator), source);
    },
    defaultIfEmpty<TDefault>(defaultValue: TDefault) {
      return createAsyncChainable(
        defaultIfEmptyAsync<TDefault, TInput>(defaultValue)(generator),
        source,
      );
    },
    distinctBy<TValue>(selector: (next: TInput) => TValue) {
      return createAsyncChainable(distinctByAsync(selector)(generator), source);
    },
    distinctUntilChanged(isEqual) {
      return createAsyncChainable(
        distinctUntilChangedAsync(isEqual)(generator),
        source,
      );
    },
    every(predicate) {
      return createAsyncChainable(everyAsync(predicate)(generator), source);
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createAsyncChainable(
        filterAsync<TInput, TOutput>(predicate)(generator),
        source,
      );
    },
    find(predicate) {
      return createAsyncChainable(findAsync(predicate)(generator), source);
    },
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createAsyncChainable(flatAsync(depth)(generator), source);
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createAsyncChainable(flatMapAsync(callback)(generator), source);
    },
    forEach(consumer) {
      return createAsyncChainable(forEachAsync(consumer)(generator), source);
    },
    groupBy<
      TKey extends PropertyKey,
      TGroups extends Array<TKey | PropertyKey> = [],
    >(keySelector: (next: TInput) => TKey | PropertyKey, groups?: TGroups) {
      return createAsyncChainable(
        groupByAsync<TInput, TKey, TGroups>(keySelector, groups)(generator),
        source,
      );
    },
    isAsync: true,
    lift<TOutput>(middleware: GeneratorMiddleware<TInput, TOutput, true>) {
      return createAsyncChainable<TOutput>(middleware(generator), source);
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createAsyncChainable(mapAsync(mapper)(generator), source);
    },
    max(callback) {
      return createAsyncChainable(maxAsync(callback)(generator), source);
    },
    min(callback) {
      return createAsyncChainable(minAsync(callback)(generator), source);
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createAsyncChainable(
        reduceAsync(reducer, initialValue)(generator),
        source,
      );
    },
    reverse() {
      return createAsyncChainable(reverseAsync()(generator), source);
    },
    skip(count) {
      return createAsyncChainable(skipAsync(count)(generator), source);
    },
    skipLast(count: number): AsyncChainable<TInput> {
      return createAsyncChainable(skipLastAsync(count)(generator), source);
    },
    skipWhile(predicate) {
      return createAsyncChainable(skipWhileAsync(predicate)(generator), source);
    },
    some(predicate) {
      return createAsyncChainable(someAsync(predicate)(generator), source);
    },
    sort(comparator) {
      return createAsyncChainable(sortAsync(comparator)(generator), source);
    },
    take(count) {
      return createAsyncChainable(takeAsync(count)(generator), source);
    },
    takeLast(count) {
      return createAsyncChainable(takeLastAsync(count)(generator), source);
    },
    takeWhile(predicate) {
      return createAsyncChainable(takeWhileAsync(predicate)(generator), source);
    },
  };
}
