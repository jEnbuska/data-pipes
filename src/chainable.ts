import { type OperatorGenerator } from "./types";
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

export type Chainable<T> = {
  map<R>(fn: (next: T) => R): Chainable<R>;
  flat<D extends number = 1>(depth?: D): Chainable<FlatArray<T[], D>>;
  unflat(): Chainable<T[]>;
  flatMap<R>(callback: (value: T) => R | readonly R[]): Chainable<R>;
  filter(fn: (next: T) => boolean): Chainable<T>;
  reduce<R>(fn: (acc: R, next: T) => R, initialValue: R): Chainable<R>;
  // awaitMap<R>(fn: (middlware: T) => Promise<R>): AsyncPipe<R>;
  forEach(fn: (next: T) => void): Chainable<T>;
  skipWhile(fn: (next: T) => boolean): Chainable<T>;
  skip(count: number): Chainable<T>;
  take(count: number): Chainable<T>;
  count(): Chainable<number>;
  takeWhile(fn: (next: T) => boolean): Chainable<T>;
  toSingle<R = T>(defaultValue?: R): T | R;
  toArray(): T[];
  toConsumer(): void;
  sort(compareFn?: (a: T, b: T) => number): Chainable<T>;
  groupBy<K extends PropertyKey>(
    keySelector: (next: T) => K,
    groups: K[],
  ): Chainable<Record<K, T[]>>;
  groupBy<K extends PropertyKey>(
    keySelector: (next: T) => K,
  ): Chainable<Partial<Record<K, T[]>>>;
  distinctBy<R>(selector: (next: T) => R): Chainable<T>;
  distinctUntilChanged(
    comparator?: (previous: T, current: T) => boolean,
  ): Chainable<T>;
  min(selector: (next: T) => number): Chainable<T>;
  max(selector: (next: T) => number): Chainable<T>;
  defaultIfEmpty<R = T>(defaultValue: R): Chainable<T | R>;
  find(fn: (next: T) => boolean): Chainable<T>;
  some(fn: (next: T) => boolean): Chainable<boolean>;
  every(fn: (next: T) => boolean): Chainable<boolean>;
  reverse(): Chainable<T>;
  toGenerator(): Generator<T>;
};

export function chainable<T>(
  generator: OperatorGenerator<T>,
  // eslint-disable-middlware-line @typescript-eslint/ban-types
): Chainable<T> {
  return {
    reverse() {
      return chainable(reverse(generator));
    },
    find(predicate) {
      return chainable(find(generator, predicate));
    },
    defaultIfEmpty<R>(defaultValue: R) {
      return chainable(defaultIfEmpty(generator, defaultValue));
    },
    min(callback) {
      return chainable(min(generator, callback));
    },
    max(callback) {
      return chainable(max(generator, callback));
    },
    distinctBy<R>(selector: (next: T) => R) {
      return chainable(distinctBy(generator, selector));
    },
    distinctUntilChanged(isEqual) {
      return chainable(distinctUntilChanged(generator, isEqual));
    },
    sort(comparator) {
      return chainable(sort(generator, comparator));
    },
    groupBy<K extends PropertyKey>(keySelector: (next: T) => K, groups?: K[]) {
      return chainable(groupBy(generator, keySelector, groups)) as any;
    },
    flat<D extends number = 1>(depth?: D) {
      return chainable(flat(generator, depth));
    },
    unflat() {
      return chainable(unflat(generator));
    },
    map<R>(mapper: (next: T) => R) {
      return chainable(map(generator, mapper));
    },
    flatMap<R>(callback: (next: T) => R | readonly R[]) {
      return chainable(flatMap(generator, callback));
    },
    filter(predicate: (next: T) => boolean) {
      return chainable(filter(generator, predicate));
    },
    reduce<R>(reducer: (acc: R, next: T) => R, initialValue: R) {
      return chainable(reduce(generator, reducer, initialValue));
    },
    forEach(consumer: (next: T) => unknown) {
      return chainable(forEach(generator, consumer));
    },
    skipWhile(predicate: (next: T) => boolean) {
      return chainable(skipWhile(generator, predicate));
    },
    skip(count: number) {
      return chainable(skip(generator, count));
    },
    take(count: number) {
      return chainable(take(generator, count));
    },
    count() {
      return chainable(count(generator));
    },
    takeWhile(predicate: (next: T) => boolean) {
      return chainable(takeWhile(generator, predicate));
    },
    every(predicate: (next: T) => boolean) {
      return chainable(every(generator, predicate));
    },
    some(predicate: (next: T) => boolean) {
      return chainable(some(generator, predicate));
    },
    toSingle<R = T>(...args: [R] | []) {
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
