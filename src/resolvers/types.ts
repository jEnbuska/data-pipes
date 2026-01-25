type MaybePromise<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T> | T
  : T;

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
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * Yielded.from([1,2,3,4])
   *  .find(n => n > 2) satisfies number | undefined // (3)
   */
  find(
    predicate: (next: T) => MaybePromise<unknown, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
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
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
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
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally, it yields the item with the lowest number to the next operation.
   *
   * @example
   * Yielded.from([2,1,3,4])
   *  .min(n => n) satisfies number | undefined // 1
   */
  minBy(
    selector: (next: T) => MaybePromise<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally yields the item with the highest number to the next operation.
   *
   * @example
   * Yielded.from([1,2,4,5,3])
   *  .maxBy(n => n) satisfies number | undefined // 5
   */
  maxBy(
    selector: (next: T) => MaybePromise<number, TAsync>,
  ): ReturnValue<T | undefined, TAsync>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
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
    keySelector: (next: T) => MaybePromise<TKey, TAsync>,
    groups: TGroups[],
  ): ReturnValue<
    Record<TGroups, T[]> & Partial<Record<Exclude<TKey, TGroups>, T[]>>,
    TAsync
  >;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even') satisfies Partial<Record<'odd' | 'even', number[]>> // {even: [2,4], odd: [1,3,5]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: T) => MaybePromise<TKey, TAsync>,
    groups?: undefined,
  ): ReturnValue<Partial<Record<TKey, T[]>>, TAsync>;

  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * Yielded.from([10, 20, 100])
   *  .count() satisfies number // 3
   */
  count(): ReturnValue<number, TAsync>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * Yielded.from([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 15
   *
   * @example
   * Yielded.from([] as number[])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 0
   */
  reduce<TOut>(
    reducer: (acc: TOut, next: T, index: number) => MaybePromise<TOut, TAsync>,
    initialValue: MaybePromise<TOut, TAsync>,
  ): ReturnValue<TOut, TAsync>;

  /**
   * @example
   * Yielded.from([1,2,4,3])
   *   .reduce((acc, next) => acc < next ? next : acc) satisfies undefined | number // 4
   */
  reduce(
    reducer: (acc: T, next: T, index: number) => MaybePromise<T, TAsync>,
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
   * Sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   * sorted handles
   *
   * @example
   * Yielded.from([3,2,1,4,5])
   *  .toSorted((a, b) => a - b) satisfies number[] // [1,2,3,4,5]
   */
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
