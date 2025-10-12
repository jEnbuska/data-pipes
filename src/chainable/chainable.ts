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
  type PipeSource,
  type GroupByGroups,
  type LiftMiddleware,
} from "../types.ts";

export function createChainable<TInput = unknown>(
  source: PipeSource<TInput>,
): Chainable<TInput> {
  return {
    batch(predicate) {
      return createChainable(batch(source, predicate));
    },
    ...createConsumable(source),
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createChainable(chunkBy(source, fn));
    },
    count() {
      return createChainable(count(source));
    },
    countBy(fn) {
      return createChainable(countBy(source, fn));
    },
    defaultIfEmpty<TDefault>(defaultValue: TDefault) {
      return createChainable(defaultIfEmpty(source, defaultValue));
    },
    distinctBy<Value>(selector: (next: TInput) => Value) {
      return createChainable(distinctBy(source, selector));
    },
    distinctUntilChanged(isEqual) {
      return createChainable(distinctUntilChanged(source, isEqual));
    },
    every(predicate) {
      return createChainable(every(source, predicate));
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createChainable(filter<TInput, TOutput>(source, predicate));
    },
    find(predicate) {
      return createChainable(find(source, predicate));
    },
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createChainable(flat(source, depth));
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createChainable(flatMap(source, callback));
    },
    forEach(consumer) {
      return createChainable(forEach(source, consumer));
    },
    groupBy<
      TKey extends PropertyKey,
      TGroups extends undefined | GroupByGroups<TKey> = undefined,
    >(...args: Parameters<Chainable<TInput>["groupBy"]>) {
      return createChainable(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        groupBy<TInput, TKey, TGroups>(source, args[0] as any, args[1] as any),
      );
    },
    isAsync: false,
    lift<TOutput>(middleware: LiftMiddleware<TInput, TOutput>) {
      return createChainable(middleware(source));
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createChainable(map(source, mapper));
    },
    max(callback) {
      return createChainable(max(source, callback));
    },
    min(callback) {
      return createChainable(min(source, callback));
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput) => TOutput,
      initialValue: TOutput,
    ) {
      return createChainable(reduce(source, reducer, initialValue));
    },
    resolve() {
      return createAsyncChainable(resolve<TInput>(source));
    },
    reverse() {
      return createChainable(reverse(source));
    },
    skip(count) {
      return createChainable(skip(source, count));
    },
    skipLast(count: number): Chainable<TInput> {
      return createChainable(skipLast(source, count));
    },
    skipWhile(predicate) {
      return createChainable(skipWhile(source, predicate));
    },
    some(predicate) {
      return createChainable(some(source, predicate));
    },
    sort(comparator) {
      return createChainable(sort(source, comparator));
    },
    take(count) {
      return createChainable(take(source, count));
    },
    takeLast(count) {
      return createChainable(takeLast(source, count));
    },
    takeWhile(predicate) {
      return createChainable(takeWhile(source, predicate));
    },
  };
}
