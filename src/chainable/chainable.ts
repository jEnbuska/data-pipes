import {
  type GeneratorProvider,
  type GeneratorMiddleware,
  type SyncPipeSource,
  type AsyncPipeSource,
  type AsyncChainable,
  type Chainable
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
  some
} from "../generators";
import { skipLast } from "../generators/skipLast/skipLast.ts";
import { takeLast } from "../generators/takeLast/takeLast.ts";
import { createProvider, createAsyncProvider } from "../create-provider.ts";
import { resolve } from "../generators/resolve/resolve.ts";
import { createAsyncChainable } from "./asyncChainable.ts";
import { countBy } from "../generators/countBy/countBy.ts";

function createChainable<TInput = unknown>(
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

export function chainable<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncChainable<TInput>;
export function chainable<TInput>(
  source: SyncPipeSource<TInput>,
): Chainable<TInput>;
export function chainable(source: any) {
  if (isAsyncGeneratorFunction<any>(source)) {
    return createAsyncChainable(createAsyncProvider(source));
  }
  return createChainable(createProvider(source));
}

function isAsyncGeneratorFunction<TInput>(
  source: unknown,
): source is AsyncPipeSource<TInput> {
  return (
    Boolean(source) &&
    Object.getPrototypeOf(source).constructor.name === "AsyncGeneratorFunction"
  );
}
