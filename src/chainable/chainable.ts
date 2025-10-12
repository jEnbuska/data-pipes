import { createAsyncChainable } from "./asyncChainable.ts";
import { createConsumable } from "../create-consumable.ts";
import {
  batch,
  chunkBy,
  count,
  countBy,
  defaultIfEmpty,
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
} from "../generators";
import {
  type Chainable,
  type GeneratorMiddleware,
  type GeneratorProvider,
} from "../types.ts";

export function createChainable<TInput = unknown>(
  generator: GeneratorProvider<TInput>,
  source: GeneratorProvider<unknown> = generator,
): Chainable<TInput> {
  return {
    ...createConsumable(generator),
    batch(predicate) {
      return createChainable(batch(predicate)(generator), source);
    },
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createChainable(chunkBy(fn)(generator), source);
    },
    count() {
      return createChainable(count()(generator), source);
    },
    countBy(fn) {
      return createChainable(countBy(fn)(generator), source);
    },
    defaultIfEmpty<TDefault>(defaultValue: TDefault) {
      return createChainable(defaultIfEmpty(defaultValue)(generator), source);
    },
    distinctBy<Value>(selector: (next: TInput) => Value) {
      return createChainable(distinctBy(selector)(generator), source);
    },
    distinctUntilChanged(isEqual) {
      return createChainable(distinctUntilChanged(isEqual)(generator), source);
    },
    every(predicate) {
      return createChainable(every(predicate)(generator), source);
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createChainable(
        filter<TInput, TOutput>(predicate)(generator),
        source,
      );
    },
    find(predicate) {
      return createChainable(find(predicate)(generator), source);
    },
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createChainable(flat(depth)(generator), source);
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createChainable(flatMap(callback)(generator), source);
    },
    forEach(consumer) {
      return createChainable(forEach(consumer)(generator), source);
    },
    groupBy<
      TKey extends PropertyKey,
      TGroups extends Array<TKey | PropertyKey> = [],
    >(keySelector: (next: TInput) => TKey | PropertyKey, groups?: TGroups) {
      return createChainable(
        groupBy<TInput, TKey, TGroups>(keySelector, groups)(generator),
        source,
      );
    },
    isAsync: false,
    lift<TOutput>(middleware: GeneratorMiddleware<TInput, TOutput>) {
      return createChainable(middleware(generator), source);
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createChainable(map(mapper)(generator), source);
    },
    max(callback) {
      return createChainable(max(callback)(generator), source);
    },
    min(callback) {
      return createChainable(min(callback)(generator), source);
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createChainable(reduce(reducer, initialValue)(generator), source);
    },
    resolve() {
      return createAsyncChainable(resolve<TInput>()(generator), source);
    },
    reverse() {
      return createChainable(reverse()(generator), source);
    },
    skip(count) {
      return createChainable(skip(count)(generator), source);
    },
    skipLast(count: number): Chainable<TInput> {
      return createChainable(skipLast(count)(generator), source);
    },
    skipWhile(predicate) {
      return createChainable(skipWhile(predicate)(generator), source);
    },
    some(predicate) {
      return createChainable(some(predicate)(generator), source);
    },
    sort(comparator) {
      return createChainable(sort(comparator)(generator), source);
    },
    take(count) {
      return createChainable(take(count)(generator), source);
    },
    takeLast(count) {
      return createChainable(takeLast(count)(generator), source);
    },
    takeWhile(predicate) {
      return createChainable(takeWhile(predicate)(generator), source);
    },
  };
}
