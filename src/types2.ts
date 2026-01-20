import type { MaybePromise } from "./types.ts";

const asyncExcludes = ["toAwaited"] as const;
type AsyncExcludes<TAsync extends boolean> = TAsync extends true
  ? (typeof asyncExcludes)[number]
  : "";

const singleExcludes = [
  "find",
  "drop",
  "take",
  "reduce",
  "toArray",
  "some",
  "every",
  "find",
  "batch",
  "toSorted",
  "toReverse",
  "dropLast",
  "takeUntil",
  "groupBy",
] as const;
type SingleExcludes<TSingle extends boolean> = TSingle extends true
  ? (typeof singleExcludes)[number]
  : "";

type Yielded<TYieldedIterator> =
  TYieldedIterator extends YieldedIteratorObject<
    infer TArgs,
    infer T,
    infer TAsync,
    infer TSingle,
    infer TNullable
  >
    ? Omit<
        YieldedIteratorObject<TArgs, T, TAsync, TSingle, TNullable>,
        AsyncExcludes<TAsync> | SingleExcludes<TSingle>
      >
    : never;

type AnyYielded<
  TArgs extends any[],
  T,
  TAsync extends boolean,
  TSingle extends boolean,
  TNullable extends boolean,
> = Yielded<
  YieldedIteratorObject<
    TArgs,
    TAsync extends true ? Awaited<T> : T,
    TAsync,
    TSingle,
    TNullable
  >
>;

type YieldedIteratorObject<
  TArgs extends any[],
  T,
  TAsync extends boolean,
  TSingle extends boolean,
  TNullable extends boolean,
> = {
  /**
   * Returns this iterator.
   */
  [Symbol.iterator](): IteratorObject<T, void | undefined, undefined>;

  /**
   * Creates an iterator whose values are the result of applying the callback to the values from this iterator.
   * @param callbackfn A function that accepts up to two arguments to be used to transform values from the underlying iterator.
   */
  map<U>(
    callbackfn: (value: T, index: number) => MaybePromise<TAsync, U>,
  ): AnyYielded<TArgs, T, TAsync, TSingle, TNullable>;

  batch(
    callbackfn: (acc: T[], index: number) => unknown,
  ): AnyYielded<TArgs, T, TAsync, TSingle, TNullable>;

  /**
   * Creates an iterator whose values are those from this iterator for which the provided predicate returns true.
   * @param predicate A function that accepts up to two arguments to be used to test values from the underlying iterator.
   */
  filter<S extends T>(
    predicate: (value: T, index: number) => value is S,
  ): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  /**
   * Creates an iterator whose values are those from this iterator for which the provided predicate returns true.
   * @param predicate A function that accepts up to two arguments to be used to test values from the underlying iterator.
   */
  filter(
    predicate: (value: T, index: number) => unknown,
  ): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  /**
   * Creates an iterator whose values are the values from this iterator, stopping once the provided limit is reached.
   * @param limit The maximum number of values to yield.
   */
  take(limit: number): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  takeUntil(
    predicate: (next: T, index: number) => unknown,
  ): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  /**
   * Creates an iterator whose values are the values from this iterator after skipping the provided count.
   * @param count The number of values to drop.
   */
  drop(count: number): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  dropLast(count: number): AnyYielded<TArgs, T, TAsync, TSingle, true>;

  /**
   * Creates an iterator whose values are the result of applying the callback to the values from this iterator and then flattening the resulting iterators or iterables.
   * @param callback A function that accepts up to two arguments to be used to transform values from the underlying iterator into new iterators or iterables to be flattened into the result.
   */
  flatMap<U>(
    callback: (
      value: T,
      index: number,
    ) => MaybePromise<TAsync, U | readonly U[]>,
  ): AnyYielded<TArgs, T, TAsync, false, true>;

  flat<const Depth extends number = 1>(
    depth?: number,
  ): AnyYielded<TArgs, FlatArray<T[], Depth>, TAsync, false, true>;

  /**
   * Calls the specified callback function for all the elements in this iterator. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of a value from the iterator.
   */
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
    ) => MaybePromise<TAsync, T>,
  ): AnyYielded<TArgs, T, TAsync, true, true>;
  reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
    ) => MaybePromise<TAsync, T>,
    initialValue: T,
  ): AnyYielded<TArgs, T, TAsync, true, false>;

  /**
   * Calls the specified callback function for all the elements in this iterator. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of a value from the iterator.
   */
  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
    ) => MaybePromise<TAsync, U>,
    initialValue: U,
  ): AnyYielded<TArgs, T, TAsync, true, false>;

  groupBy<K extends PropertyKey>(
    keySelector: (next: T, index: number) => MaybePromise<TAsync, K>,
  ): AnyYielded<TArgs, Partial<Record<K, T[]>>, TAsync, true, false>;

  groupBy<K extends PropertyKey, const G extends PropertyKey>(
    keySelector: (next: T, index: number) => MaybePromise<TAsync, K>,
    groups: G[],
  ): AnyYielded<
    TArgs,
    Record<G, T[]> & Partial<Record<Exclude<K, G>, T[]>>,
    TAsync,
    true,
    false
  >;

  /**
   * Creates a new array from the values yielded by this iterator.
   */
  toArray(...args: TArgs): MaybePromise<TAsync, T[]>;

  /**
   * Performs the specified action for each element in the iterator.
   * @param callbackfn A function that accepts up to two arguments. forEach calls the callbackfn function one time for each element in the iterator.
   */
  forEach(
    callbackfn: (value: T, index: number) => void,
  ): MaybePromise<TAsync, void>;
  /**
   * Performs the specified action for each element in the iterator.
   * @param callbackfn A function that accepts up to two arguments. forEach calls the callbackfn function one time for each element in the iterator.
   */
  tap(
    callbackfn: (value: T, index: number) => void,
  ): AnyYielded<TArgs, T, TAsync, TSingle, TNullable>;

  /**
   * Determines whether the specified callback function returns true for any element of this iterator.
   * @param predicate A function that accepts up to two arguments. The some method calls
   * the predicate function for each element in this iterator until the predicate returns a value
   * true, or until the end of the iterator.
   */
  some(
    predicate: (value: T, index: number) => unknown,
  ): AnyYielded<TArgs, boolean, TAsync, true, false>;

  /**
   * Determines whether all the members of this iterator satisfy the specified test.
   * @param predicate A function that accepts up to two arguments. The every method calls
   * the predicate function for each element in this iterator until the predicate returns
   * false, or until the end of this iterator.
   */
  every(
    predicate: (value: T, index: number) => unknown,
  ): AnyYielded<TArgs, boolean, TAsync, true, false>;

  /**
   * Returns the value of the first element in this iterator where predicate is true, and undefined
   * otherwise.
   * @param predicate find calls predicate once for each element of this iterator, in
   * order, until it finds one where predicate returns true. If such an element is found, find
   * immediately returns that element value. Otherwise, find returns undefined.
   */
  find<S extends T>(
    predicate: (value: T, index: number) => value is S,
  ): AnyYielded<TArgs, S, TAsync, true, true>;
  find(
    predicate: (value: T, index: number) => unknown,
  ): AnyYielded<TArgs, T, TAsync, true, true>;

  toAwaited(): AnyYielded<TArgs, Awaited<T>, true, TSingle, TNullable>;

  defaultTo<TDefault>(
    getDefault: () => MaybePromise<TAsync, TDefault>,
  ): AnyYielded<TArgs, T | TDefault, TAsync, TSingle, false>;

  toSorted(
    compareFn: (a: T, b: T) => MaybePromise<TAsync, number>,
  ): AnyYielded<TArgs, T, TAsync, TSingle, TNullable>;
  toReverse(): AnyYielded<TArgs, T, TAsync, TSingle, TNullable>;

  readonly [Symbol.toStringTag]: string;
};
