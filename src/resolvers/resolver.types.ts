import type { CallbackReturn } from "../shared.types.ts";

/** If Async then Promise<T> otherwise T */
type ReturnValue<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T>
  : T;

interface ISharedYieldedResolver<T, TAsync extends boolean> {
  [Symbol.dispose](): void;

  /**
   * @example
   * Yielded.from(person)
   *   .find((p): n is Male => p.gender === 'male') satisfies Male | undefined;
   */
  find<TOut extends T>(
    predicate: (next: T) => next is TOut,
  ): ReturnValue<TOut | undefined, TAsync>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it returns that value
   * @example
   * Yielded.from([1,2,3,4])
   *  .find(n => n > 2) satisfies number | undefined // (3)
   */
  find(
    predicate: (next: T) => CallbackReturn<unknown, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * returns true when predicate returns true for the first time, otherwise finally returns false after the generator is consumer. <br/>
   * if the generator does not yield anything returns false
   *
   * @example
   * Yielded.from([1,2,3,4])
   *  .some(n => n > 2) satisfies boolean // true
   *
   * @example
   * Yielded.from([])
   *  .every(Boolean) satisfies boolean  // false
   */
  some(
    predicate: (next: T, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;
  /**
   * returns false when predicate returns false for the first time, otherwise finally returns true after the generator is consumer. <br/>
   * if the generator does not yield anything returns true
   *
   * @example
   * Yielded.from([1,2,3,4])
   *  .every(n => n > 1) satisfies boolean // false
   *
   * @example
   * Yielded.from([])
   *  .every(Boolean) satisfies boolean // true
   */
  every(
    predicate: (next: T, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;

  /**
   * Takes each item produced by the generator and find the value with the lowest number returned.
   *
   * @example
   * Yielded.from([2,1,3,4])
   *  .min(n => n) satisfies number | undefined // 1
   */
  minBy(
    selector: (next: T) => CallbackReturn<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * Takes each item produced by the generator and find the value with the highest number returned.
   *
   * @example
   * Yielded.from([1,2,4,5,3])
   *  .maxBy(n => n) satisfies number | undefined // 5
   */
  maxBy(
    selector: (next: T) => CallbackReturn<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then finally the grouped data.
   * Defining 'groups' argument you can ensure that all these groups are part of the result
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .groupBy(
   *    n => n % 2 ? 'odd' : 'even',
   *    ['odd', 'even', 'other']
   *  ) satisfies Record<
   *      'odd' | 'even' | 'other',
   *      number[]
   *    > // ({even: [2,4], odd: [1,3,5], other:[]})
   */
  groupBy<TKey extends PropertyKey, const TGroups extends PropertyKey>(
    keySelector: (next: T) => CallbackReturn<TKey, TAsync>,
    groups: TGroups[],
  ): ReturnValue<
    Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>,
    TAsync
  >;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then returns the grouped data.
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even') satisfies Partial<Record<'odd' | 'even', number[]>> // {even: [2,4], odd: [1,3,5]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: T) => CallbackReturn<TKey, TAsync>,
    groups?: undefined,
  ): ReturnValue<Partial<Record<TKey, T[]>>, TAsync>;

  /**
   * counts the number of items produced by the generator and returns the total cound.
   * @example
   * Yielded.from([10, 20, 100])
   *  .count() satisfies number // 3
   */
  count(): ReturnValue<number, TAsync>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * @example
   * Yielded.from([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 15
   *
   * @example
   * Yielded.from([] as number[])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 0
   */
  reduce<TOut>(
    reducer: (
      acc: TOut,
      next: T,
      index: number,
    ) => CallbackReturn<TOut, TAsync>,
    initialValue: TAsync extends true ? Promise<TOut> | TOut : TOut,
  ): ReturnValue<TOut, TAsync>;

  /**
   * @example
   * Yielded.from([1,2,4,3])
   *   .reduce((acc, next) => acc < next ? next : acc) satisfies undefined | number // 4
   */
  reduce(
    reducer: (acc: T, next: T, index: number) => CallbackReturn<T, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;

  /**
   * @example
   * Yielded.from([1,2,3,4,5])
   * .countBy(n => n) satisfies number | undefined // 15
   *
   * @example
   * Yielded.from([] as number[])
   * .countBy(n => n) satisfies number | undefined // 0 number
   */
  countBy(fn: (next: T) => number): ReturnValue<number, TAsync>;
  /**
   * Returns the items produced by the generator in a sorted order.
   * sorted handles
   *
   * @example
   * Yielded.from([3,2,1,4,5])
   *  .toSorted((a, b) => a - b) satisfies number[] // [1,2,3,4,5]
   */
  toSorted(
    compare: (previous: T, next: T) => CallbackReturn<number, TAsync>,
  ): ReturnValue<T[], TAsync>;

  /**
   * Returns the items in reverse order thay are received.
   * sorted handles
   *
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .toReversed((a, b) => a - b) satisfies number[] // [5,4,3,2,1]
   */
  toReversed(): ReturnValue<T[], TAsync>;
  /**
   * Returns the output as an array
   *
   * @example
   * Yielded.from([3,2,1,4,5])
   *  .toArray() satisfies number[] // [1,2,3,4,5]
   */
  toArray(): ReturnValue<T[], TAsync>;

  forEach(cb: (next: T, index: number) => unknown): ReturnValue<void, TAsync>;

  consume(): ReturnValue<void, TAsync>;

  /** Get first item produced by the generator and then stop the work
   * Yielded.from([1,2,3,4,5])
   *  .filter(it => it>3)
   *  .first() satisfies number | undefined; // 4
   * */
  first(): ReturnValue<T | undefined, TAsync>;
}

export interface IAsyncYieldedResolver<T> extends ISharedYieldedResolver<
  T,
  true
> {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}

export interface IYieldedResolver<T> extends ISharedYieldedResolver<T, false> {
  [Symbol.iterator](): Generator<T>;
}
