import type {
  GeneratorProvider,
  Chainable,
  GeneratorMiddleware,
} from "../types.ts";
import { createConsumable } from "../create-consumable.ts";
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
  resolve,
  countBy,
  skipLast,
  takeLast,
  chunkBy,
} from "../generators";
import { createAsyncChainable } from "./asyncChainable.ts";

export function createChainable<TInput = unknown>(
  generator: GeneratorProvider<TInput>,
): Chainable<TInput> {
  return {
    ...createConsumable(generator),
    isAsync: false,
    reverse() {
      return createChainable(reverse()(generator));
    },
    find(predicate) {
      return createChainable(find(predicate)(generator));
    },
    defaultIfEmpty<Default>(defaultValue: Default) {
      return createChainable(defaultIfEmpty(defaultValue)(generator));
    },
    min(callback) {
      return createChainable(min(callback)(generator));
    },
    max(callback) {
      return createChainable(max(callback)(generator));
    },
    distinctBy<Value>(selector: (next: TInput) => Value) {
      return createChainable(distinctBy(selector)(generator));
    },
    distinctUntilChanged(isEqual) {
      return createChainable(distinctUntilChanged(isEqual)(generator));
    },
    sort(comparator) {
      return createChainable(sort(comparator)(generator));
    },
    lift<TOutput>(middleware: GeneratorMiddleware<TInput, TOutput>) {
      return createChainable(middleware(generator));
    },
    groupBy<
      Key extends PropertyKey,
      Groups extends Array<Key | PropertyKey> = [],
    >(keySelector: (next: TInput) => Key | PropertyKey, groups?: Groups) {
      return createChainable(
        groupBy<TInput, Key, Groups>(keySelector, groups)(generator),
      );
    },
    flat<Depth extends number = 1>(depth?: Depth) {
      return createChainable(flat(depth)(generator));
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createChainable(map(mapper)(generator));
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createChainable(flatMap(callback)(generator));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createChainable(filter<TInput, TOutput>(predicate)(generator));
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createChainable(reduce(reducer, initialValue)(generator));
    },
    forEach(consumer) {
      return createChainable(forEach(consumer)(generator));
    },
    skipWhile(predicate) {
      return createChainable(skipWhile(predicate)(generator));
    },
    skip(count) {
      return createChainable(skip(count)(generator));
    },
    skipLast(count: number): Chainable<TInput> {
      return createChainable(skipLast(count)(generator));
    },
    take(count) {
      return createChainable(take(count)(generator));
    },
    takeLast(count) {
      return createChainable(takeLast(count)(generator));
    },
    count() {
      return createChainable(count()(generator));
    },
    takeWhile(predicate) {
      return createChainable(takeWhile(predicate)(generator));
    },
    every(predicate) {
      return createChainable(every(predicate)(generator));
    },
    some(predicate) {
      return createChainable(some(predicate)(generator));
    },
    resolve() {
      return createAsyncChainable(resolve<TInput>()(generator));
    },
    countBy(fn) {
      return createChainable(countBy(fn)(generator));
    },
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createChainable(chunkBy(fn)(generator));
    },
  };
}
