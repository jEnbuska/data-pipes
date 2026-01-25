export type YieldedSyncGenerator<TOutput = unknown> = Generator<
  TOutput,
  undefined,
  unknown
> &
  GeneratorFunction;

export type YieldedAsyncGenerator<TOutput = unknown> = AsyncGenerator<
  TOutput,
  undefined,
  unknown
> &
  AsyncGeneratorFunction;

export type YieldedGenerator<
  TInput,
  TAsync extends boolean,
> = TAsync extends true
  ? YieldedAsyncGenerator<TInput>
  : YieldedSyncGenerator<TInput>;

export type Yielded<TAsync extends boolean, TInput> = YieldedConsumers<
  TAsync,
  TInput
> &
  YieldedMiddlewares<TAsync, TInput> & {
    [Symbol.toStringTag]: TAsync extends true ? "AsyncYielded" : "SyncYielded";
  };

type MaybePromise<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T> | T
  : T;

type ReturnValue<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T>
  : T;

export type YieldedAsyncMiddlewares<TInput> = YieldedMiddlewares<
  true,
  TInput
> & {
  /**
   * @example
   * yielded([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .awaited()
   *  .parallel(3)
   *  .toArray() // Promise<[300, 10, 100, 450, 550]>
   */
  parallel(count: number): Yielded<true, TInput>;
};

export type YieldedSyncMiddlewares<TInput> = YieldedMiddlewares<
  false,
  TInput
> & {
  /**
   * @example
   * await yielded([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .awaited()
   *  .map(n => n * 2)
   *  .toArray() // Promise<[1,2,3]>
   */
  awaited(): Yielded<true, TInput>;
};
export type YieldedMiddlewares<TAsync extends boolean, TInput> = {
  /**
   * @examples
   * yielded([1,2,3,4,5])
   * .chunkBy((n) => n % 2)
   * .toArray(); // ([[1,3,5], [2,4]]) number[][]
   */
  chunkBy<TIdentifier>(
    fn: (next: TInput) => MaybePromise<TIdentifier, TAsync>,
  ): Yielded<TAsync, TInput[]>;
  /**
   * Batch values into batches before feeding them as a batch to next operation
   * @example
   * yielded([1,2,3,4,5])
   *  .batch(acc => acc.length < 3)
   *  .toArray(); // ([[1,2], [3,4] [5]]) number[][];
   * @example
   *  yielded([] as number[])
   *  .batch(acc => acc.length < 3)
   *  .toArray(); // ([]) number[][] ;
   */
  batch(
    predicate: (acc: TInput[]) => MaybePromise<boolean, TAsync>,
  ): Yielded<TAsync, TInput[]>;
  /**
   * @example
   * yielded([1,2,3,4,5])
   *   .drop(2)
   *   .toArray // ([3,4,5]) number[]
   */
  drop(count: number): Yielded<TAsync, TInput>;
  /**
   * drops the last `count` items produced by the generator and yields the rest to the next operation.
   * Note. The dropLast operator stars emitting previous values to next operation, when it has the dropped amount
   * of values buffered
   * @example
   * yielded([1,2,3,4,5])
   *  .dropLast(2)
   *  .toArray(); // ([1,2,3]) number[]
   *
   * @example
   * yielded(['A','B','C','D', 'E'])
   *  .tap(l => storeStep.push(`${l}1`))
   *  .dropLast(2)
   *  .tap(l => storeStep.push(`${l}2`))
   *  .toArray(); (['A', 'B', 'C']) string[]
   *  // steps ->
   *  // A1  B1  C1
   *  // A2          D1
   *  //     B2          E1
   *  //         C2
   */
  dropLast(count: number): Yielded<TAsync, TInput>;
  /**
   * drops items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .dropWhile(n => n < 3)
   *  .toArray() // ([3,4]) number[]
   */
  dropWhile(
    fn: (next: TInput) => MaybePromise<boolean, TAsync>,
  ): Yielded<TAsync, TInput>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * yielded([1,2,3,4,5])
   *  .take(2)
   *  .toArray() satisfies number[] // [1,2]
   */
  take(count: number): Yielded<TAsync, TInput>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .takeLast(2)
   *  .toArray() satisfies number[] // [4,5]
   */
  takeLast(count: number): Yielded<TAsync, TInput>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .toArray() satisfies number[] // [1,2]
   */
  takeWhile(
    fn: (next: TInput) => MaybePromise<boolean, TAsync>,
  ): Yielded<TAsync, TInput>;
  /**
   * Sorts the items in reverse order and then yields them to the next operation one by one in the sorted order.
   *
   * @example
   * yielded([1,2,3,4,5])
   *  .reversed()
   *  .toArray() satisfies number[] // [5,4,3,2,1]
   */
  sorted(
    compareFn: (a: TInput, b: TInput) => MaybePromise<number, TAsync>,
  ): Yielded<TAsync, TInput>;

  /**
   * Sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   * sorted handles
   *
   * @example
   * yielded([3,2,1,4,5])
   *  .sorted((a, z) => a - z)
   *  .toArray() // ([1,2,3,4,5]) number[]
   */
  sorted(
    compareFn: (a: TInput, b: TInput) => MaybePromise<number, TAsync>,
  ): Yielded<TAsync, TInput>;

  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * yielded([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .toArray() satisfies number[] // [1,2]
   */
  distinctBy<TValue>(
    selector: (next: TInput) => MaybePromise<TValue, TAsync>,
  ): Yielded<TAsync, TInput>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * yielded([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .toArray() // ([1,2,3]) number[]
   *
   * @example
   * yielded([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .toArray() satisfies number[] // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (
      previous: TInput,
      current: TInput,
    ) => MaybePromise<boolean, TAsync>,
  ): Yielded<TAsync, TInput>;

  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .toArray() satisfies number[] // [1,2,3];
   */
  filter<TOutput extends TInput>(
    fn: (next: TInput) => next is TOutput,
  ): Yielded<TAsync, TOutput>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *   .filter(n => n % 2)
   *   .toArray() satisfies number[] // [1,3] ;
   */
  filter(fn: (next: TInput) => any): Yielded<TAsync, TInput>;

  /**
   * yields the items in reverse order after the parent generator is consumed
   * @example
   * yielded([1,2,3])
   *  .reversed()
   *  .toArray() satisfies number[] // [3,2,1]
   */
  reversed(): Yielded<TAsync, TInput>;
  /**
   * Maps next item produced by the generator using the provided transform function and yields it
   * to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *  .map(n => n * 2)
   *  .toArray() satisfies number[]  // [2, 4, 6];
   *
   * @example
   *  yielded(1)
   *  .map(n => n * 2)
   *  .toArray() satisfies number[] // [2]
   */
  map<TOutput = unknown>(
    mapper: (next: TInput) => MaybePromise<TOutput, TAsync>,
  ): Yielded<TAsync, TOutput>;

  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * yielded([1,2,3])
   *  .tab(n => console.log(n))
   *  .toArray() satisfies number[] // ([1, 2, 3])
   */
  tap(callback: (next: TInput) => unknown): Yielded<TAsync, TInput>;
  /**
   * Returns a new array with all sub-array elements concatenated into it recursively up to the
   * specified depth.
   *
   * @example
   * yielded([[1], [2], [3]])
   *  .flat()
   *  .toArray() // [1,2,3]
   *
   * @example
   * yielded([[1], [[2]], [[[3]]]])
   *  .flat(2)
   *  .toArray() Array<number | number[]> // [1,2,[3]]
   */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Yielded<TAsync, FlatArray<TInput[], Depth>>;
  flatMap<TOutput>(
    callback: (value: TInput) => MaybePromise<TOutput | TOutput[], TAsync>,
  ): Yielded<TAsync, TOutput>;
  /**
   * Accepts a generator function that accepts the  previous generator
   *
   * @example
   * yielded([1,2,3])
   *  .lift(function* multiplyByTwo(generator) {
   *    using generator = InternalYielded.disposable(provider, args);
   *    for (const next of generator) {
   *     yield next * 2;
   *    }
   *   })
   *   .toArray() satisfies number[] // [2, 4, 6]
   *
   * @example
   * yielded([-2,1,2,-3,4])
   *  .lift(function* filterNegatives(generator) {
   *    using generator = InternalYielded.disposable(provider, args);
   *    for (const next of generator) {
   *      if (next < 0) continue;
   *      yield next;
   *    }
   *   })
   *  .toArray() satisfies number[] // [1, 2, 4]
   *
   * @example
   * yielded(["a", "b", "c"])
   *  .lift(function* joinStrings(generator) {
   *      const acc: string[] = [];
   *      using generator = InternalYielded.disposable(provider, args);
   *      for (const next of generator) {
   *       acc.push(next);
   *      }
   *      yield acc.join(".");
   *  })
   *  .toArray() satisfies string[] // ["a.b.c"]
   */
  lift<TOutput = never>(
    middleware: (
      generator: YieldedGenerator<TInput, TAsync>,
    ) => YieldedGenerator<TOutput, TAsync>,
  ): Yielded<TAsync, TOutput>;
};

export type YieldedConsumers<TAsync extends boolean, TInput> = {
  /**
   * @example
   * yielded(person)
   *   .find((p): n is Male => p.gender === 'male') satisfies Male | undefined;
   */
  find<TOutput extends TInput>(
    predicate: (next: TInput) => next is TOutput,
  ): ReturnValue<TOutput | undefined, TAsync>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * yielded([1,2,3,4])
   *  .find(n => n > 2) satisfies number | undefined // (3)
   */
  find(
    predicate: (next: TInput) => MaybePromise<unknown, TAsync>,
  ): ReturnValue<TInput | undefined, TAsync>;
  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
   *
   * @example
   * yielded([1,2,3,4])
   *  .some(n => n > 2) satisfies boolean // true
   *
   * @example
   * yielded([])
   *  .every(Boolean) satisfies boolean  // false
   */
  some(
    predicate: (next: TInput, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;
  /**
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
   *
   * @example
   * yielded([1,2,3,4])
   *  .every(n => n > 1) satisfies boolean // false
   *
   * @example
   * yielded([])
   *  .every(Boolean) satisfies boolean // true
   */
  every(
    predicate: (next: TInput, index: number) => unknown,
  ): ReturnValue<boolean, TAsync>;

  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally, it yields the item with the lowest number to the next operation.
   *
   * @example
   * yielded([2,1,3,4])
   *  .min(n => n) satisfies number | undefined // 1
   */
  minBy(
    selector: (next: TInput) => MaybePromise<number, TAsync>,
  ): ReturnValue<TInput | undefined, TAsync>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally yields the item with the highest number to the next operation.
   *
   * @example
   * yielded([1,2,4,5,3])
   *  .maxBy(n => n) satisfies number | undefined // 5
   */
  maxBy(
    selector: (next: TInput) => MaybePromise<number, TAsync>,
  ): ReturnValue<TInput | undefined, TAsync>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * Defining 'groups' argument you can ensure that all these groups are part of the result
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(
   *    n => n % 2 ? 'odd' : 'even',
   *    ['odd', 'even', 'other']
   *  ) satisfies Record<
   *      'odd' | 'even' | 'other',
   *      number[]
   *    > // ({even: [2,4], odd: [1,3,5], other:[]})
   */
  groupBy<TKey extends PropertyKey, const TGroups extends PropertyKey>(
    keySelector: (next: TInput) => MaybePromise<TKey, TAsync>,
    groups: TGroups[],
  ): ReturnValue<
    Record<TGroups, TInput[]> &
      Partial<Record<Exclude<TKey, TGroups>, TInput[]>>,
    TAsync
  >;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even') satisfies Partial<Record<'odd' | 'even', number[]>> // {even: [2,4], odd: [1,3,5]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: TInput) => MaybePromise<TKey, TAsync>,
    groups?: undefined,
  ): ReturnValue<Partial<Record<TKey, TInput[]>>, TAsync>;

  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * yielded([10, 20, 100])
   *  .count() satisfies number // 3
   */
  count(): ReturnValue<number, TAsync>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 15
   *
   * @example
   * yielded([] as number[])
   *   .reduce((sum, n) => sum + n, 0) satisfies number // 0
   */
  reduce<TOutput>(
    reducer: (
      acc: TOutput,
      next: TInput,
      index: number,
    ) => MaybePromise<TOutput, TAsync>,
    initialValue: MaybePromise<TOutput, TAsync>,
  ): ReturnValue<TOutput, TAsync>;

  /**
   * @example
   * yielded([1,2,4,3])
   *   .reduce((acc, next) => acc < next ? next : acc) satisfies undefined | number // 4
   */
  reduce(
    reducer: (
      acc: TInput,
      next: TInput,
      index: number,
    ) => MaybePromise<TInput, TAsync>,
  ): ReturnValue<TInput | undefined, TAsync>;

  /**
   * @example
   * yielded([1,2,3,4,5])
   * .countBy(n => n) satisfies number | undefined // 15
   *
   * @example
   * yielded([] as number[])
   * .countBy(n => n) satisfies number | undefined // 0 number
   */
  countBy(fn: (next: TInput) => number): ReturnValue<number, TAsync>;
  /**
   * Sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   * sorted handles
   *
   * @example
   * yielded([3,2,1,4,5])
   *  .toSorted((a, b) => a - b) satisfies number[] // [1,2,3,4,5]
   */
  /**
   * Returns the output as an array
   *
   * @example
   * yielded([3,2,1,4,5])
   *  .toArray() satisfies number[] // [1,2,3,4,5]
   */
  toArray(): ReturnValue<TInput[], TAsync>;

  forEach(
    cb: (next: TInput, index: number) => unknown,
  ): ReturnValue<void, TAsync>;
} & (TAsync extends true
  ? {
      [Symbol.asyncIterator](): AsyncGenerator<TInput, void, unknown>;
    }
  : {
      [Symbol.iterator](): IterableIterator<TInput, undefined, unknown>;
    });
