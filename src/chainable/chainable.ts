import { createAsyncChainable } from "./asyncChainable.ts";
import { createConsumable } from "../create-consumable.ts";
import {
  batch,
  chunkBy,
  count,
  countBy,
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
  defaultTo,
} from "../generators";
import {
  type Chainable,
  type PipeSource,
  type LiftMiddleware,
} from "../types.ts";
import { fold } from "../generators/reducers/fold.ts";
import { createDefault, returnUndefined } from "../utils.ts";
import { createInitialGroups } from "../generators/reducers/groupBy.ts";
import { toArrayFromReturn } from "../consumers/toArray.ts";

export function createChainable<TInput, TDefault = undefined>(
  source: PipeSource<TInput>,
  getDefault: () => TDefault,
): Chainable<TInput, TDefault> {
  return {
    batch(predicate) {
      return createChainable(
        batch(source, predicate),
        createDefault<TInput[]>([]),
      );
    },
    ...createConsumable<TInput, TDefault>(source, getDefault),
    chunkBy<TIdentifier>(fn: (next: TInput) => TIdentifier) {
      return createChainable(chunkBy(source, fn), createDefault<TInput[]>([]));
    },
    count() {
      return createChainable(count(source), createDefault(0));
    },
    countBy(fn) {
      return createChainable(countBy(source, fn), createDefault(0));
    },
    defaultTo<TDefault>(getDefault: () => TDefault) {
      return createChainable(defaultTo(source, getDefault), getDefault);
    },
    distinctBy<Value>(selector: (next: TInput) => Value) {
      return createChainable(distinctBy(source, selector), returnUndefined);
    },
    distinctUntilChanged(isEqual) {
      return createChainable(
        distinctUntilChanged(source, isEqual),
        returnUndefined,
      );
    },
    every(predicate) {
      return createChainable(
        every(source, predicate),
        createDefault<true>(true),
      );
    },
    filter<TOutput extends TInput>(
      predicate: (next: TInput) => next is TOutput,
    ) {
      return createChainable(
        filter<TInput, TOutput>(source, predicate),
        returnUndefined,
      );
    },
    find(predicate) {
      return createChainable(find(source, predicate), returnUndefined);
    },
    flat<TDepth extends number = 1>(depth?: TDepth) {
      return createChainable(flat(source, depth), returnUndefined);
    },
    flatMap<TOutput>(callback: (next: TInput) => TOutput | readonly TOutput[]) {
      return createChainable(flatMap(source, callback), returnUndefined);
    },
    fold<TOutput>(
      initial: () => TOutput,
      reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
    ) {
      return createChainable(fold(source, initial, reducer), initial);
    },
    forEach(consumer: (next: TInput) => unknown) {
      return createChainable(forEach(source, consumer), getDefault);
    },
    groupBy(
      keySelector: (next: TInput) => PropertyKey,
      groups: PropertyKey[] = [],
    ) {
      return createChainable(groupBy(source, keySelector, groups), () =>
        Object.fromEntries(createInitialGroups(groups ?? [])),
      );
    },
    isAsync: false,
    lift<TOutput>(middleware: LiftMiddleware<TInput, TOutput>) {
      return createChainable(middleware(source), returnUndefined);
    },
    map<TOutput>(mapper: (next: TInput) => TOutput) {
      return createChainable(map(source, mapper), returnUndefined);
    },
    max(callback) {
      return createChainable(max(source, callback), returnUndefined);
    },
    min(callback) {
      return createChainable(min(source, callback), returnUndefined);
    },
    reduce<TOutput>(
      reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
      initialValue: TOutput,
    ) {
      return createChainable(
        reduce(source, reducer, initialValue),
        createDefault(initialValue),
      );
    },
    resolve() {
      return createAsyncChainable(resolve<TInput>(source), getDefault);
    },
    reverse() {
      return createChainableFromListReturn(reverse(source));
    },
    skip(count) {
      return createChainable(skip(source, count), returnUndefined);
    },
    skipLast(count: number) {
      return createChainable(skipLast(source, count), returnUndefined);
    },
    skipWhile(predicate) {
      return createChainable(skipWhile(source, predicate), returnUndefined);
    },
    some(predicate) {
      return createChainable(
        some(source, predicate),
        createDefault<false>(false),
      );
    },
    sort(comparator) {
      return createChainableFromListReturn(sort(source, comparator));
    },
    take(count) {
      return createChainable(take(source, count), returnUndefined);
    },
    takeLast(count) {
      return createChainableFromListReturn(takeLast(source, count));
    },
    takeWhile(predicate) {
      return createChainable(takeWhile(source, predicate), returnUndefined);
    },
  };
}

function createChainableFromListReturn<TInput>(
  source: PipeSource<TInput, TInput[]>,
): Chainable<TInput> {
  return {
    ...createChainable(source, returnUndefined),
    toArray(signal) {
      return toArrayFromReturn<TInput>(source, signal);
    },
  };
}
