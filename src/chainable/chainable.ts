import {
  type GeneratorProvider,
  type Chainable,
  type GeneratorMiddleware,
  type PipeSource,
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
  unflat,
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
import { skipLast } from "../generators/skipLast/skipLast.ts";
import { takeLast } from "../generators/takeLast/takeLast.ts";
import { createProvider } from "../create-provider.ts";

function createChainable<Input>(
  generator: GeneratorProvider<Input>,
): Chainable<Input> {
  return {
    ...createConsumable(generator),
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
    distinctBy<Value>(selector: (next: Input) => Value) {
      return createChainable(distinctBy(selector)(generator));
    },
    distinctUntilChanged(isEqual) {
      return createChainable(distinctUntilChanged(isEqual)(generator));
    },
    sort(comparator) {
      return createChainable(sort(comparator)(generator));
    },
    lift<Output>(middleware: GeneratorMiddleware<Input, Output>) {
      return createChainable(middleware(generator));
    },
    groupBy<Key extends PropertyKey>(
      keySelector: (next: Input) => Key,
      groups?: Key[],
    ) {
      return createChainable(
        (groupBy as any)(keySelector, groups)(generator),
      ) as any;
    },
    flat<Depth extends number = 1>(depth?: Depth) {
      return createChainable(flat(depth)(generator));
    },
    unflat() {
      return createChainable(unflat()(generator));
    },
    map<Output>(mapper: (next: Input) => Output) {
      return createChainable(map(mapper)(generator));
    },
    flatMap<Output>(callback: (next: Input) => Output | readonly Output[]) {
      return createChainable(flatMap(callback)(generator));
    },
    filter<Output extends Input>(predicate: (next: Input) => next is Output) {
      return createChainable(filter<Input, Output>(predicate)(generator));
    },
    reduce<Output>(
      reducer: (acc: Output, next: Input) => Output,
      initialValue: Output,
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
    skipLast(count: number): Chainable<Input> {
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
  };
}

/**
 * creates a chainable from the given sources
 *
 * @example
 * chainable([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * chainable([1,2,3])
 * .map(n => n * 2)
 * .toArray() // [2,4,6]
 *
 * @example
 * chainable(
 *  chainable([1,2,3]).map(n => n * 2)
 * ).map(n => n * 2)
 *  .toArray() // [4,8,12]
 */
export function chainable<Input>(
  source: PipeSource<Input> = [],
): Chainable<Input> {
  return createChainable(createProvider(source));
}
