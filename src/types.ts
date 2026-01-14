export type YieldedAsyncProvider<TOutput, TReturn = unknown | void> = (
  signal: AbortSignal,
) => AsyncGenerator<TOutput, TReturn, undefined & void>;

export type YieldedSyncProvider<TOutput, TReturn = unknown> = (
  signal: AbortSignal,
) => Generator<TOutput, TReturn, undefined & void>;

export type Yielded<
  TAsync extends boolean,
  TIterable extends boolean,
  TInput,
  TDefault = TInput,
> = TIterable extends true
  ? IterableYielded<TAsync, TInput>
  : SingleYielded<TAsync, TInput, TDefault>;

type SingleYielded<
  TAsync extends boolean,
  TInput,
  TDefault = TInput,
> = TAsync extends true
  ? AsyncSingleYielded<TInput, TDefault>
  : SyncSingleYielded<TInput, TDefault>;

type IterableYielded<TAsync extends boolean, TInput> = TAsync extends true
  ? AsyncIterableYielded<TInput>
  : SyncIterableYielded<TInput>;

export type SyncSingleYielded<TInput, TDefault> = CommonYielded<
  false,
  false,
  TInput,
  TDefault
> & {
  /**
   * @example
   * await yielded(1)
   *   .map(n => Promise.resolve(n))
   *   .toAwaited()
   *   .map(n => n * 2)
   *   .resolve() // Promise<number | undefined>
   * */
  toAwaited(): AsyncSingleYielded<TInput, undefined>;
  [Symbol.toStringTag]: `SyncSingleYielded`;
  consume(signal?: AbortSignal): void;
  resolve(signal?: AbortSignal): TInput | TDefault;
  /**
   * defaultTo Provides default value before resolving yielded for single result to avoid 'undefined' case
   * @example
   * yielded([1,2,3])
   *  .find(n => n < 0)
   *  .defaultTo(0)
   *  .resolve() satisfies number // 0
   * */
  defaultTo<TDefault>(
    getDefault: () => TDefault,
  ): Pick<SyncSingleYielded<TInput, TDefault>, "resolve">;
};
export type AsyncSingleYielded<TInput, TDefault> = CommonYielded<
  true,
  false,
  Awaited<TInput>,
  TDefault
> & {
  [Symbol.toStringTag]: `AsyncSingleYielded`;
  consume(signal?: AbortSignal): Promise<void>;
  resolve(signal?: AbortSignal): Promise<TInput | TDefault>;
  /**
   * defaultTo Provides default value before resolving yielded for single result to avoid 'undefined' case
   * @example
   * yielded([1,2,3])
   *  .toAwaited()
   *  .find(n => n < 0)
   *  .defaultTo(0)
   *  .resolve() satisfies Promise<number> // Promise<0>
   */
  defaultTo<TDefault>(
    getDefault: () => TDefault,
  ): Pick<AsyncSingleYielded<TInput, TDefault>, "resolve">;
};

export type SyncIterableYielded<TInput> = SharedIterableYielded<
  false,
  TInput
> & {
  /**
   * @example
   * await yielded([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .toAwaited()
   *  .map(n => n * 2)
   *  .resolve() // Promise<[1,2,3]>
   */
  toAwaited(): AsyncIterableYielded<TInput>;
  /**
   * @example
   * yielded([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .toAwaitedParallel(3)
   *  .resolve() // Promise<[300, 10, 100, 450, 550]>
   */
  toAwaitedParallel(count: number): AsyncIterableYielded<TInput>;
  [Symbol.iterator](): IterableIterator<TInput>;
  [Symbol.toStringTag]: `SyncIterableYielded`;
  consume(signal?: AbortSignal): void;
  resolve(signal?: AbortSignal): TInput[];
};

export type AsyncIterableYielded<TInput> = SharedIterableYielded<
  true,
  Awaited<TInput>
> & {
  [Symbol.asyncIterator](): AsyncIterableIterator<TInput>;
  [Symbol.toStringTag]: `AsyncIterableYielded`;
  consume(signal?: AbortSignal): Promise<void>;
  resolve(signal?: AbortSignal): Promise<Array<Awaited<TInput>>>;
};

export type SharedIterableYielded<
  TAsync extends boolean = false,
  TInput = unknown,
> = CommonYielded<TAsync, true, TInput> & {
  /**
   * @example
   * yielded([1,2,3,4,5])
   * .countBy(n => n)
   * .resolve() // 15
   *
   * @example
   * yielded([] as number[])
   * .countBy(n => n)
   * .resolve() // 0
   * */
  countBy(fn: (next: TInput) => number): SingleYielded<TAsync, number, number>;
  /**
   * @examples
   * yielded([1,2,3,4,5])
   * .chunkBy((n) => n % 2)
   * .resolve() // [[1,3,5], [2,4]]
   * */
  chunkBy<TIdentifier>(
    fn: (next: TInput) => TIdentifier,
  ): IterableYielded<TAsync, TInput[]>;
  /**
   * Batch values into batches before feeding them as a batch to next operation
   * @example
   * yielded([1,2,3,4,5])
   *  .batch(acc => acc.length < 3)
   *  .resolve() // [[1,2], [3,4] [5]];
   * @example
   *  yielded([] as number[])
   *  .batch(acc => acc.length < 3)
   *  .resolve() // [];
   */
  batch(
    predicate: (acc: TInput[]) => boolean,
  ): IterableYielded<TAsync, TInput[]>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *   .reduce((sum, n) => sum + n, 0)
   *   .resolve() // 15
   *
   *   @example
   * yielded([] as number[])
   *   .reduce((sum, n) => sum + n, 0)
   *   .resolve() // 0
   * */
  reduce<TOutput>(
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
    initialValue: TOutput,
  ): SingleYielded<TAsync, TOutput>;
  /**
   * Just and other way to reduce items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *   .fold(() => 0, (sum, n) => sum + n)
   *   .resolve() // 15
   * @example
   * yielded([] as number[])
   *   .fold(() => 0, (sum, n) => sum + n)
   *   .resolve() // 0
   *
   * */
  fold<TOutput>(
    initial: () => TOutput,
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  ): SingleYielded<TAsync, TOutput>;
  /**
   * @example
   * yielded([1,2,3,4,5])
   *   .skip(2)
   *   .resolve() // [3,4,5]
   * */
  skip(count: number): IterableYielded<TAsync, TInput>;
  /**
   * skips the last `count` items produced by the generator and yields the rest to the next operation.
   * Note. The skipLast operator stars emitting previous values to next operation, when it has the skipped amount
   * of values buffered
   * @example
   * yielded([1,2,3,4,5])
   *  .skipLast(2)
   *  .resolve() // [1,2,3]
   
   *
   * @example
   * yielded(['A','B','C','D', 'E'])
   *  .tap(l => storeStep.push(`${l}1`))
   *  .skipLast(2)
   *  .tap(l => storeStep.push(`${l}2`))
   *  .consume()
   *  // steps ->
   *  // A1  B1  C1
   *  // A2          D1
   *  //     B2          E1
   *  //         C2
   */
  skipLast(count: number): IterableYielded<TAsync, TInput>;
  /**
   * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .skipWhile(n => n < 3)
   *  .resolve() // [3,4]
   * */
  skipWhile(fn: (next: TInput) => boolean): IterableYielded<TAsync, TInput>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * yielded([1,2,3,4,5])
   *  .take(2)
   *  .resolve() // [1,2]
   */
  take(count: number): IterableYielded<TAsync, TInput>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .takeLast(2)
   *  .resolve() // [4,5]
   */
  takeLast(count: number): IterableYielded<TAsync, TInput>;
  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * yielded([1,2,3])
   *  .count()
   *  .resolve() // 3
   */
  count(): SingleYielded<TAsync, number>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .resolve() // [1,2]
   */
  takeWhile(fn: (next: TInput) => boolean): IterableYielded<TAsync, TInput>;
  /**
   * Sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   * toSorted handles
   *
   * @example
   * yielded([3,2,1,4,5])
   *  .toSorted((a, z) => a - z)
   *  .resolve() // [1,2,3,4,5]
   */
  toSorted(
    compareFn: (a: TInput, b: TInput) => number,
  ): IterableYielded<TAsync, TInput>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even')
   *  .resolve() // {even: [2,4], odd: [1,3,5]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups?: undefined,
  ): SingleYielded<TAsync, Partial<Record<TKey, TInput[]>>>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * Defining 'groups' argument you can ensure that all these groups are part of the result
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even', ['odd', 'even', 'other'])
   *  .collect() // {even: [2,4], odd: [1,3,5], other:[]}
   */
  groupBy<TKey extends PropertyKey, TGroups extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups: TGroups[],
  ): SingleYielded<
    TAsync,
    Record<TGroups, TInput[]> &
      Partial<Record<Exclude<TKey, TGroups>, TInput[]>>
  >;
  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * yielded([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .resolve() // [1,2]
   */
  distinctBy<TValue>(
    selector: (next: TInput) => TValue,
  ): IterableYielded<TAsync, TInput>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * yielded([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .resolve() // [1,2,3]
   *
   * @example
   * yielded([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .resolve() // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (previous: TInput, current: TInput) => boolean,
  ): IterableYielded<TAsync, TInput>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally, it yields the item with the lowest number to the next operation.
   *
   * @example
   * yielded([2,1,3,4])
   *  .min(n => n)
   *  .resolve() // 1
   */
  min(
    selector: (next: TInput) => number,
  ): SingleYielded<TAsync, TInput, undefined>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally yields the item with the highest number to the next operation.
   *
   * @example
   * yielded([1,2,4,5,3])
   *  .max(n => n)
   *  .resolve() // 5
   */
  max(
    selector: (next: TInput) => number,
  ): SingleYielded<TAsync, TInput, undefined>;

  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .resolve() satisfies number[] // [1,2,3];
   */
  filter<TOutput extends TInput>(
    fn: (next: TInput) => next is TOutput,
  ): IterableYielded<TAsync, TOutput>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *   .filter(n => n % 2)
   *   .resolve() // [1,3];
   */
  filter(fn: (next: TInput) => any): IterableYielded<TAsync, TInput>;

  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
   *
   * @example
   * yielded([1,2,3,4])
   *  .some(n => n > 2)
   *  .resolve() // true
   *
   * @example
   * yielded([])
   *  .every(Boolean)
   *  .resolve() // false
   */
  some(fn: (next: TInput) => boolean): SingleYielded<TAsync, boolean>;
  /**
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
   *
   * @example
   * yielded([1,2,3,4])
   *  .every(n => n > 1)
   *  .resolve() // false
   *
   * @example
   * yielded([])
   *  .every(Boolean)
   *  .resolve() // true
   */
  every(fn: (next: TInput) => boolean): SingleYielded<TAsync, boolean>;
  /**
   * yields the items in reverse order after the parent generator is consumed
   * @example
   * yielded([1,2,3])
   *  .toReverse()
   *  .resolve() // [3,2,1]
   */
  toReverse(): IterableYielded<TAsync, TInput>;
};

type CommonYielded<
  TAsync extends boolean,
  TIterable extends boolean,
  TInput,
  TDefault = undefined,
> = {
  /**
   * Maps next item produced by the generator using the provided transform function and yields it
   * to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *  .map(n => n * 2)
   *  .resolve() // [2, 4, 6];
   *
   * @example
   *  yielded(1)
   *  .map(n => n * 2)
   *  .resolve() satisfies number | undefined
   */
  map<TOutput = unknown>(
    mapper: (next: TInput) => TOutput,
  ): Yielded<TAsync, TIterable, TOutput, undefined>;

  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * yielded([1,2,3])
   *  .tab(n => console.log(n)) // 1, 2, 3
   *  .consume();
   * */
  tap(
    callback: (next: TInput) => unknown,
  ): Yielded<TAsync, TIterable, TInput, TDefault>;
  /**
   * Returns a new array with all sub-array elements concatenated into it recursively up to the
   * specified depth.
   *
   * @example
   * yielded([[1], [2], [3]])
   *  .flat()
   *  .resolve() // [1,2,3]
   *
   * @example
   * yielded([[1], [[2]], [[[3]]]])
   *  .flat(2)
   *  .resolve() // [1,2,[3]]
   * */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): IterableYielded<TAsync, FlatArray<TInput[], Depth>>;
  flatMap<TOutput>(
    callback: (value: TInput) => TOutput | TOutput[],
  ): IterableYielded<TAsync, TOutput>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * yielded([1,2,3,4])
   *  .find(n => n > 2)
   *  .resolve() // [3]
   */
  find(
    predicate: (next: TInput) => boolean,
  ): SingleYielded<TAsync, TInput, undefined>;

  /**
   * @example
   * yielded(person)
   *   .find((p): n is Male => p.gender === 'male')
   *   .resolve() // Male | undefined;
   *
   * @example
   * yielded(persons)
   *   .find((p): n is Male => p.gender === 'male')
   *   .resolve() // Male[];
   */
  find<TOutput extends TInput>(
    predicate: (next: TInput) => next is TOutput,
  ): SingleYielded<TAsync, TOutput, undefined>;
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
   *   .collect() // [2, 4, 6]
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
   *  .collect() // [1, 2, 4]
   *
   * @example
   * yielded("a", "b", "c")
   *  .lift(function* joinStrings(generator) {
   *      const acc: string[] = [];
   *      using generator = InternalYielded.disposable(provider, args);
   *      for (const next of generator) {
   *       acc.push(next);
   *      }
   *      yield acc.join(".");
   *  })
   *  .collect() // "a.b.c"
   * */
  lift<TOutput = never>(
    middleware: YieldedLiftMiddleware<TAsync, TInput, TOutput>,
  ): IterableYielded<TAsync, TOutput>;
};

export type YieldedLiftMiddleware<TAsync, TInput, TOutput> = TAsync extends true
  ? (
      generator: ReturnType<YieldedAsyncProvider<TInput>>,
    ) => ReturnType<YieldedAsyncProvider<TOutput>>
  : (
      generator: ReturnType<YieldedSyncProvider<TInput>>,
    ) => ReturnType<YieldedSyncProvider<TOutput>>;
