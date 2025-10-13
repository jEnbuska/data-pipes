import { createAsyncConsumable } from "../create-consumable.ts";
import {
  chunkByAsync,
  countAsync,
  countByAsync,
  defaultToAsync,
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
} from "../generators";
import {
  type AsyncChainable,
  type AsyncPipeSource,
  type AsyncLiftMiddleware,
  type GroupByGroups,
} from "../types.ts";
import { foldAsync } from "../generators/reducers/fold.ts";

export function createAsyncChainable<TInput = unknown, TDefault = undefined>(
  source: AsyncPipeSource<TInput>,
  defaultValue?: TDefault,
): AsyncChainable<TInput> {
  return {
    isAsync: true,
    ...createAsyncConsumable(source, defaultValue),
    fold<TOutput>(
      initial: () => TOutput,
      reducer: (acc: TOutput, next: TInput) => TOutput,
    ) {
      return createAsyncChainable(foldAsync(source, initial, reducer));
    },
    batch(predicate) {
      return createAsyncChainable(batchAsync(source, predicate));
    },
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createAsyncChainable(chunkByAsync(source, fn));
    },
    count() {
      return createAsyncChainable(countAsync(source));
    },
    countBy(fn) {
      return createAsyncChainable(countByAsync(source, fn));
    },
    defaultTo<TDefault>(defaultValue: TDefault) {
      return createAsyncChainable<TInput | TDefault, TDefault>(
        defaultToAsync<TInput, TDefault>(source, defaultValue),
        defaultValue,
      );
    },
    distinctBy<TValue>(selector: (next: TInput) => TValue) {
      return createAsyncChainable(distinctByAsync(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return createAsyncChainable(distinctUntilChangedAsync(source, isEqual));
    },
    every(predicate) {
      return createAsyncChainable(everyAsync(source, predicate));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createAsyncChainable(
        filterAsync<TInput, TOutput>(source, predicate),
      );
    },
    find(predicate) {
      return createAsyncChainable(findAsync(source, predicate));
    },
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createAsyncChainable(flatAsync(source, depth));
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createAsyncChainable<TOutput | readonly TOutput[]>(
        flatMapAsync<TInput, TOutput>(source, callback),
      );
    },
    forEach(consumer) {
      return createAsyncChainable(forEachAsync(source, consumer));
    },
    groupBy<
      TKey extends PropertyKey,
      TGroups extends undefined | GroupByGroups<TKey> = undefined,
    >(...args: Parameters<AsyncChainable<TInput>["groupBy"]>) {
      return createAsyncChainable(
        groupByAsync<TInput, TKey, TGroups>(
          source,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          args[0] as any,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          args[1] as any,
        ),
      );
    },
    lift<TOutput>(middleware: AsyncLiftMiddleware<TInput, TOutput>) {
      return createAsyncChainable<TOutput>(middleware(source));
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createAsyncChainable(mapAsync<TInput, TOutput>(source, mapper));
    },
    max(callback) {
      return createAsyncChainable(maxAsync(source, callback));
    },
    min(callback) {
      return createAsyncChainable(minAsync(source, callback));
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createAsyncChainable(reduceAsync(source, reducer, initialValue));
    },
    reverse() {
      return createAsyncChainable(reverseAsync(source));
    },
    skip(count) {
      return createAsyncChainable(skipAsync(source, count));
    },
    skipLast(count: number): AsyncChainable<TInput> {
      return createAsyncChainable(skipLastAsync(source, count));
    },
    skipWhile(predicate) {
      return createAsyncChainable(skipWhileAsync(source, predicate));
    },
    some(predicate) {
      return createAsyncChainable(someAsync(source, predicate));
    },
    sort(comparator) {
      return createAsyncChainable(sortAsync(source, comparator));
    },
    take(count) {
      return createAsyncChainable(takeAsync(source, count));
    },
    takeLast(count) {
      return createAsyncChainable(takeLastAsync(source, count));
    },
    takeWhile(predicate) {
      return createAsyncChainable(takeWhileAsync(source, predicate));
    },
  };
}
