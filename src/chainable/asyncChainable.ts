import {
  type AsyncChainable,
  type AsyncGeneratorProvider,
  type GeneratorMiddleware,
} from "../types.ts";
import { createAsyncConsumable } from "../create-consumable.ts";
import {
  reverseAsync,
  findAsync,
  defaultIfEmptyAsync,
  minAsync,
  maxAsync,
  distinctByAsync,
  distinctUntilChangedAsync,
  sortAsync,
  groupByAsync,
  flatAsync,
  mapAsync,
  flatMapAsync,
  filterAsync,
  reduceAsync,
  forEachAsync,
  skipWhileAsync,
  skipAsync,
  takeAsync,
  countAsync,
  takeWhileAsync,
  everyAsync,
  someAsync,
  countByAsync,
  skipLastAsync,
  takeLastAsync,
  chunkByAsync,
} from "../generators";

export function createAsyncChainable<TInput = unknown>(
  generator: AsyncGeneratorProvider<TInput>,
): AsyncChainable<TInput> {
  return {
    ...createAsyncConsumable(generator),
    isAsync: true,
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
    skipLast(count: number): AsyncChainable<TInput> {
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
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createAsyncChainable(chunkByAsync(fn)(generator));
    },
  };
}
