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

export type Chainable<Input> = {
  map<Output>(fn: (next: Input) => Output): Chainable<Output>;
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Chainable<FlatArray<Input[], Depth>>;
  unflat(): Chainable<Input[]>;
  flatMap<Output>(
    callback: (value: Input) => Output | readonly Output[],
  ): Chainable<Output>;
  filter(fn: (next: Input) => boolean): Chainable<Input>;
  reduce<Output>(
    fn: (acc: Output, next: Input) => Output,
    initialValue: Output,
  ): Chainable<Output>;
  forEach(fn: (next: Input) => void): Chainable<Input>;
  skipWhile(fn: (next: Input) => boolean): Chainable<Input>;
  skip(count: number): Chainable<Input>;
  take(count: number): Chainable<Input>;
  count(): Chainable<number>;
  takeWhile(fn: (next: Input) => boolean): Chainable<Input>;
  toSingle<Default = Input>(defaultValue?: Default): Input | Default;
  toArray(): Input[];
  toConsumer(): void;
  sort(compareFn?: (a: Input, b: Input) => number): Chainable<Input>;
  groupBy<Key extends PropertyKey>(
    keySelector: (next: Input) => Key,
    groups: Key[],
  ): Chainable<Record<Key, Input[]>>;
  groupBy<Key extends PropertyKey>(
    keySelector: (next: Input) => Key,
  ): Chainable<Partial<Record<Key, Input[]>>>;
  distinctBy<Value>(selector: (next: Input) => Value): Chainable<Input>;
  distinctUntilChanged(
    comparator?: (previous: Input, current: Input) => boolean,
  ): Chainable<Input>;
  min(selector: (next: Input) => number): Chainable<Input>;
  max(selector: (next: Input) => number): Chainable<Input>;
  defaultIfEmpty<Default = Input>(
    defaultValue: Default,
  ): Chainable<Input | Default>;
  find(fn: (next: Input) => boolean): Chainable<Input>;
  some(fn: (next: Input) => boolean): Chainable<boolean>;
  every(fn: (next: Input) => boolean): Chainable<boolean>;
  reverse(): Chainable<Input>;
  toGenerator(): Generator<Input>;
  // Custom GeneratorOperator
  lift<Output = Input>(
    generatorFunction: (
      generator: OperatorGenerator<Input>,
    ) => OperatorGenerator<Output>,
  ): Chainable<Output>;
};

export function chainable<Input>(
  generator: OperatorGenerator<Input>,
): Chainable<Input> {
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
    distinctBy<Value>(selector: (next: Input) => Value) {
      return chainable(distinctBy(generator, selector));
    },
    distinctUntilChanged(isEqual) {
      return chainable(distinctUntilChanged(generator, isEqual));
    },
    sort(comparator) {
      return chainable(sort(generator, comparator));
    },
    lift<Output = Input>(
      generatorFunction: (
        generator: OperatorGenerator<Input>,
      ) => OperatorGenerator<Output>,
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
    filter(predicate: (next: Input) => boolean) {
      return chainable(filter(generator, predicate));
    },
    reduce<Output>(
      reducer: (acc: Output, next: Input) => Output,
      initialValue: Output,
    ) {
      return chainable(reduce(generator, reducer, initialValue));
    },
    forEach(consumer: (next: Input) => unknown) {
      return chainable(forEach(generator, consumer));
    },
    skipWhile(predicate: (next: Input) => boolean) {
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
    takeWhile(predicate: (next: Input) => boolean) {
      return chainable(takeWhile(generator, predicate));
    },
    every(predicate: (next: Input) => boolean) {
      return chainable(every(generator, predicate));
    },
    some(predicate: (next: Input) => boolean) {
      return chainable(some(generator, predicate));
    },
    toSingle<Default = Input>(...args: [Default] | []) {
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
