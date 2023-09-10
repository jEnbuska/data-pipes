import { type OperatorGenerator } from "./operators/types.ts";
import { operators } from "./operators/index.ts";
import { consumers } from "./consumers/index.ts";

export type Chainable<T> = {
  map<R>(fn: (next: T) => R): Chainable<R>;
  flat<D extends number = 1>(depth?: D): Chainable<FlatArray<T, D>>;
  flatMap<U>(callback: (value: T) => U | readonly U[]): Chainable<readonly U[]>;
  filter(fn: (next: T) => boolean): Chainable<T>;
  reduce<R>(fn: (acc: R, next: T) => R, initialValue: R): Chainable<R>;
  // awaitMap<R>(fn: (middlware: T) => Promise<R>): AsyncPipe<R>;
  forEach(fn: (next: T) => void): Chainable<T>;
  skipWhile(fn: (next: T) => boolean): Chainable<T>;
  skip(count: number): Chainable<T>;
  take(count: number): Chainable<T>;
  count(): Chainable<number>;
  takeWhile(fn: (next: T) => boolean): Chainable<T>;
  toSingle(): T;
  toArray(): T[];
  sort(compareFn?: (a: T, b: T) => number): Chainable<T>;
  groupBy<K extends keyof unknown>(
    keySelector: (next: T) => K,
    groups: K[],
  ): Chainable<Record<K, T[]>>;
  groupBy<K extends keyof unknown>(
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
  unflat(): Chainable<T[]>;
  reverse(): Chainable<T>;
};

export function chainable<T>(
  generator: OperatorGenerator<T>,
  // eslint-disable-middlware-line @typescript-eslint/ban-types
): Chainable<T> {
  return {
    get reverse() {
      return operators.reverse(generator);
    },
    get unflat() {
      return operators.unflat(generator);
    },
    get find() {
      return operators.find(generator);
    },
    get defaultIfEmpty() {
      return operators.defaultIfEmpty(generator);
    },
    get min() {
      return operators.min(generator);
    },
    get max() {
      return operators.max(generator);
    },
    get distinctBy() {
      return operators.distinctBy(generator);
    },
    get distinctUntilChanged() {
      return operators.distinctUntilChanged(generator);
    },
    get sort() {
      return operators.sort(generator);
    },
    get groupBy() {
      return operators.groupBy(generator) as Chainable<T>["groupBy"];
    },
    get flat() {
      return operators.flat(generator);
    },
    get map() {
      return operators.map(generator);
    },
    get flatMap() {
      return operators.flatMap(generator);
    },
    get filter() {
      return operators.filter(generator);
    },
    get reduce() {
      return operators.reduce(generator);
    },
    get forEach() {
      return operators.forEach(generator);
    },
    get skipWhile() {
      return operators.skipWhile(generator);
    },
    get skip() {
      return operators.skip(generator);
    },
    get take() {
      return operators.take(generator);
    },
    get count() {
      return operators.count(generator);
    },
    get takeWhile() {
      return operators.takeWhile(generator);
    }, /*
    get awaitMap() {
      return operators.awaitMap(generator) as unknown;
    }, */
    get every() {
      return operators.every(generator);
    },
    get some() {
      return operators.some(generator);
    },
    toSingle() {
      return consumers.toSingle(generator);
    },
    toArray() {
      return operators.toArray(generator);
    },
  };
}
