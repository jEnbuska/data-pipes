import { type Chainable, type ChainableGenerator } from "./types";
import {
  min,
  max,
  find,
  some,
  filter,
  defaultIfEmpty,
  distinctBy,
  distinctUntilChanged,
  sort,
  map,
  flatMap,
  flat,
  unflat,
  groupBy,
  reverse,
  count,
  takeWhile,
  every,
  take,
  skip,
  skipWhile,
  forEach,
  reduce,
} from "./generator-functions";
import {
  toArray,
  toGenerator,
  toConsumer,
  toSingle,
} from "./generator-consumers";
import { takeLast } from "./generator-functions/takeLast/takeLast.ts";
import { skipLast } from "./generator-functions/skipLast/skipLast.ts";

export function chainable<Input>(
  generator: ChainableGenerator<Input>,
): Chainable<Input> {
  return {
    reverse() {
      return chainable(reverse(generator));
    },
    find(predicate) {
      return chainable(find(generator, predicate));
    },
    defaultIfEmpty<Default>(defaultValue: Default) {
      return chainable(defaultIfEmpty(generator, defaultValue));
    },
    min(callback) {
      return chainable(min(generator, callback));
    },
    max(callback) {
      return chainable(max(generator, callback));
    },
    distinctBy<Value>(selector: (next: Input) => Value) {
      return chainable(distinctBy(generator, selector));
    },
    distinctUntilChanged(isEqual) {
      return chainable(distinctUntilChanged(generator, isEqual));
    },
    sort(comparator) {
      return chainable(sort(generator, comparator));
    },
    lift<Output>(
      generatorFunction: (
        generator: ChainableGenerator<Input>,
      ) => ChainableGenerator<Output>,
    ) {
      return chainable(generatorFunction(generator));
    },
    groupBy<Key extends PropertyKey>(
      keySelector: (next: Input) => Key,
      groups?: Key[],
    ) {
      return chainable(groupBy(generator, keySelector, groups)) as any;
    },
    flat<Depth extends number = 1>(depth?: Depth) {
      return chainable(flat(generator, depth));
    },
    unflat() {
      return chainable(unflat(generator));
    },
    map<Output>(mapper: (next: Input) => Output) {
      return chainable(map(generator, mapper));
    },
    flatMap<Output>(callback: (next: Input) => Output | readonly Output[]) {
      return chainable(flatMap(generator, callback));
    },
    filter(predicate) {
      return chainable(filter(generator, predicate));
    },
    reduce<Output>(
      reducer: (acc: Output, next: Input) => Output,
      initialValue: Output,
    ) {
      return chainable(reduce(generator, reducer, initialValue));
    },
    forEach(consumer) {
      return chainable(forEach(generator, consumer));
    },
    skipWhile(predicate) {
      return chainable(skipWhile(generator, predicate));
    },
    skip(count) {
      return chainable(skip(generator, count));
    },
    skipLast(count: number): Chainable<Input> {
      return chainable(skipLast(generator, count));
    },
    take(count) {
      return chainable(take(generator, count));
    },
    takeLast(count) {
      return chainable(takeLast(generator, count));
    },
    count() {
      return chainable(count(generator));
    },
    takeWhile(predicate) {
      return chainable(takeWhile(generator, predicate));
    },
    every(predicate) {
      return chainable(every(generator, predicate));
    },
    some(predicate) {
      return chainable(some(generator, predicate));
    },
    toSingle<Default>(...args: [Default] | []) {
      return toSingle(generator, ...args);
    },
    toArray() {
      return toArray(generator);
    },
    toGenerator() {
      return toGenerator(generator);
    },
    toConsumer() {
      toConsumer(generator);
    },
  };
}
