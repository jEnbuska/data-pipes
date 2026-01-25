export type YieldedIterator<TOut = unknown> = IteratorObject<
  TOut,
  undefined,
  unknown
>;

export type YieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined,
  unknown
>;

export type PromiseOrNot<T> = Promise<T> | T;

export type YieldedGenerator<T, TAsync extends boolean> = TAsync extends true
  ? YieldedAsyncGenerator<T>
  : YieldedIterator<T>;
export interface IAsyncYielded<T> extends ISharedYieldedOperations<T, true> {
  /**
   * @example
   * Yielded.from([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .awaited()
   *  .parallel(3)
   *  .toArray() // Promise<[300, 10, 100, 450, 550]>
   */
  parallel(count: number): IAsyncYielded<T>;
}

export interface IYielded<T> extends ISharedYieldedOperations<T, false> {
  /**
   * @example
   * await Yielded.from([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .awaited()
   *  .map(n => n * 2)
   *  .toArray() // Promise<[1,2,3]>
   */
  awaited(): IAsyncYielded<Awaited<T>>;
}

export type IAnyYielded<T, TAsync extends boolean> = TAsync extends true
  ? IAsyncYielded<T>
  : IYielded<T>;

type MaybePromise<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T> | T
  : T;

export interface ISharedYieldedOperations<T, TAsync extends boolean> {
  /**
   * @examples
   * Yielded.from([1,2,3,4,5])
   * .chunkBy((n) => n % 2)
   * .toArray(); // ([[1,3,5], [2,4]]) number[][]
   */
  chunkBy<TIdentifier>(
    fn: (next: T) => MaybePromise<TIdentifier, TAsync>,
  ): IAnyYielded<T[], TAsync>;
  /**
   * Batch values into batches before feeding them as a batch to next operation
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .batch(acc => acc.length < 3)
   *  .toArray(); // ([[1,2], [3,4] [5]]) number[][];
   * @example
   *  Yielded.from([] as number[])
   *  .batch(acc => acc.length < 3)
   *  .toArray(); // ([]) number[][] ;
   */
  batch(
    predicate: (acc: T[]) => MaybePromise<boolean, TAsync>,
  ): IAnyYielded<T[], TAsync>;
  /**
   * @example
   * Yielded.from([1,2,3,4,5])
   *   .drop(2)
   *   .toArray // ([3,4,5]) number[]
   */
  drop(count: number): IAnyYielded<T, TAsync>;
  /**
   * drops the last `count` items produced by the generator and yields the rest to the next operation.
   * Note. The dropLast operator stars emitting previous values to next operation, when it has the dropped amount
   * of values buffered
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .dropLast(2)
   *  .toArray(); // ([1,2,3]) number[]
   *
   * @example
   * Yielded.from(['A','B','C','D', 'E'])
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
  dropLast(count: number): IAnyYielded<T, TAsync>;
  /**
   * drops items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * Yielded.from([1,2,3,4])
   *  .dropWhile(n => n < 3)
   *  .toArray() // ([3,4]) number[]
   */
  dropWhile(
    fn: (next: T) => MaybePromise<boolean, TAsync>,
  ): IAnyYielded<T, TAsync>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .take(2)
   *  .toArray() satisfies number[] // [1,2]
   */
  take(count: number): IAnyYielded<T, TAsync>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * Yielded.from([1,2,3,4,5])
   *  .takeLast(2)
   *  .toArray() satisfies number[] // [4,5]
   */
  takeLast(count: number): IAnyYielded<T, TAsync>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * Yielded.from([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .toArray() satisfies number[] // [1,2]
   */
  takeWhile(
    fn: (next: T) => MaybePromise<boolean, TAsync>,
  ): IAnyYielded<T, TAsync>;

  /**
   * Sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   * sorted handles
   *
   * @example
   * Yielded.from([3,2,1,4,5])
   *  .sorted((a, z) => a - z)
   *  .toArray() // ([1,2,3,4,5]) number[]
   */
  sorted(
    compareFn: (a: T, b: T) => MaybePromise<number, TAsync>,
  ): IAnyYielded<T, TAsync>;

  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * Yielded.from([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .toArray() satisfies number[] // [1,2]
   */
  distinctBy<TValue>(
    selector: (next: T) => MaybePromise<TValue, TAsync>,
  ): IAnyYielded<T, TAsync>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * Yielded.from([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .toArray() // ([1,2,3]) number[]
   *
   * @example
   * Yielded.from([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .toArray() satisfies number[] // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (previous: T, current: T) => MaybePromise<boolean, TAsync>,
  ): IAnyYielded<T, TAsync>;

  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * Yielded.from([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .toArray() satisfies number[] // [1,2,3];
   */
  filter<TOut extends T>(
    fn: (next: T) => next is TOut,
  ): IAnyYielded<TOut, TAsync>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * Yielded.from([1,2,3])
   *   .filter(n => n % 2)
   *   .toArray() satisfies number[] // [1,3] ;
   */
  filter(fn: (next: T) => any): IAnyYielded<T, TAsync>;

  /**
   * yields the items in reverse order after the parent generator is consumed
   * @example
   * Yielded.from([1,2,3])
   *  .reversed()
   *  .toArray() satisfies number[] // [3,2,1]
   */
  reversed(): IAnyYielded<T, TAsync>;
  /**
   * Maps next item produced by the generator using the provided transform function and yields it
   * to the next operation.
   *
   * @example
   * Yielded.from([1,2,3])
   *  .map(n => n * 2)
   *  .toArray() satisfies number[]  // [2, 4, 6];
   *
   * @example
   *  Yielded.from(1)
   *  .map(n => n * 2)
   *  .toArray() satisfies number[] // [2]
   */
  map<TOut>(
    mapper: (next: T) => MaybePromise<TOut, TAsync>,
  ): IAnyYielded<TOut, TAsync>;

  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * Yielded.from([1,2,3])
   *  .tab(n => console.log(n))
   *  .toArray() satisfies number[] // ([1, 2, 3])
   */
  tap(callback: (next: T) => unknown): IAnyYielded<T, TAsync>;
  /**
   * Returns a new array with all sub-array elements concatenated into it recursively up to the
   * specified depth.
   *
   * @example
   * Yielded.from([[1], [2], [3]])
   *  .flat()
   *  .toArray() // [1,2,3]
   *
   * @example
   * Yielded.from([[1], [[2]], [[[3]]]])
   *  .flat(2)
   *  .toArray() Array<number | number[]> // [1,2,[3]]
   */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): IAnyYielded<FlatArray<T[], Depth>, TAsync>;
  flatMap<TOut>(
    callback: (value: T) => MaybePromise<TOut | TOut[], TAsync>,
  ): IAnyYielded<TOut, TAsync>;
  /**
   * Accepts a generator function that accepts the  previous generator
   *
   * @example
   * Yielded.from([1,2,3])
   *  .lift(function* multiplyByTwo(generator) {
   *    using generator = InternalYielded.disposable(provider, args);
   *    for (const next of generator) {
   *     yield next * 2;
   *    }
   *   })
   *   .toArray() satisfies number[] // [2, 4, 6]
   *
   * @example
   * Yielded.from([-2,1,2,-3,4])
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
   * Yielded.from(["a", "b", "c"])
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
  lift<TOut = never>(
    middleware: (
      generator: YieldedGenerator<T, TAsync>,
    ) => YieldedGenerator<TOut, TAsync>,
  ): IAnyYielded<TOut, TAsync>;
}
