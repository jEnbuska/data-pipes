export type YieldedProviderArgs = readonly [AbortSignal];

export type AsyncYieldedProvider<TOutput, TReturn = unknown | void> = (
  signal: AbortSignal,
) => AsyncGenerator<TOutput, TReturn, undefined & void>;

export type SyncYieldedProvider<TOutput, TReturn = unknown> = (
  signal: AbortSignal,
) => Generator<TOutput, TReturn, undefined & void>;

export type Yielded<
  TAsync extends boolean,
  TIterable extends boolean,
  TInput,
  TDefault = TInput,
> = TIterable extends true
  ? TAsync extends true
    ? IterableAsyncYielded<TInput>
    : IterableSyncYielded<TInput>
  : TAsync extends true
    ? SingleAsyncYielded<TInput, TDefault>
    : SingleSyncYielded<TInput, TDefault>;

export type SingleSyncYielded<TInput, TDefault> = CommonYielded<
  false,
  false,
  TInput,
  TDefault
> & {
  resolve(): Yielded<true, false, TInput, undefined>;
  [Symbol.toStringTag]: `SingleSyncYielded`;
  consume(signal?: AbortSignal): void;
  collect(signal?: AbortSignal): TInput | TDefault;
  defaultTo<TDefault>(
    getDefault: () => TDefault,
  ): Pick<SingleSyncYielded<TInput, TDefault>, "collect">;
};
export type SingleAsyncYielded<TInput, TDefault> = CommonYielded<
  true,
  false,
  Awaited<TInput>,
  TDefault
> & {
  [Symbol.toStringTag]: `SingleAsyncYielded`;
  consume(signal?: AbortSignal): Promise<void>;
  collect(signal?: AbortSignal): Promise<TInput | TDefault>;
  defaultTo<TDefault>(
    getDefault: () => TDefault,
  ): Pick<SingleAsyncYielded<TInput, TDefault>, "collect">;
};

export type IterableSyncYielded<TInput> = IterableYielded<false, TInput> & {
  resolve(): Yielded<true, true, TInput>;
  resolveParallel(count: number): Yielded<true, true, TInput>;
  [Symbol.iterator](): IterableIterator<TInput>;
  [Symbol.toStringTag]: `IterableSyncYielded`;
  consume(signal?: AbortSignal): void;
  collect(signal?: AbortSignal): TInput[];
};

export type IterableAsyncYielded<TInput> = IterableYielded<
  true,
  Awaited<TInput>
> & {
  [Symbol.asyncIterator](): AsyncIterableIterator<TInput>;
  [Symbol.toStringTag]: `IterableAsyncYielded`;
  consume(signal?: AbortSignal): Promise<void>;
  collect(signal?: AbortSignal): Promise<Array<Awaited<TInput>>>;
};

export type IterableYielded<
  TAsync extends boolean = false,
  TInput = unknown,
> = CommonYielded<TAsync, true, TInput> & {
  /**
   * @example
   * yielded(employees)
   * .countBy(employee => employee.salary)
   * .collect() // salaries total (number)
   * */
  countBy(fn: (next: TInput) => number): Yielded<TAsync, false, number, number>;
  chunkBy<TIdentifier>(
    fn: (next: TInput) => TIdentifier,
  ): Yielded<TAsync, true, TInput[]>;
  /**
   * Batch values into groups   *
   * @example
   * yielded([1,2,3,4,5])
   *  .batch(acc => acc.length < 3)
   *  .collect() // [[1,2], [3,4] [5]];
   */
  batch(predicate: (acc: TInput[]) => boolean): Yielded<TAsync, true, TInput[]>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * yielded([1,2,3])
   *   .reduce((sum, n) => sum + n, 0)
   *   .collect() // 6
   * */
  reduce<TOutput>(
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
    initialValue: TOutput,
  ): Yielded<TAsync, false, TOutput>;
  /**
   * Just and other way to reduce items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * yielded([1,2,3])
   *   .fold(() => 0, (sum, n) => sum + n)
   *   .collect() // 6
   * */
  fold<TOutput>(
    initial: () => TOutput,
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  ): Yielded<TAsync, false, TOutput>;
  skip(count: number): Yielded<TAsync, true, TInput>;
  /**
   * skips the last `count` items produced by the generator and yields the rest to the next operation.
   * @example
   * yielded([1,2,3])
   *  .skipLast(2)
   *  .collect() // [1]
   */
  skipLast(count: number): Yielded<TAsync, true, TInput>;
  /**
   * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .skipWhile(n => n < 3)
   *  .collect() // [3,4]
   * */
  skipWhile(fn: (next: TInput) => boolean): Yielded<TAsync, true, TInput>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * yielded([1,2,3])
   *  .take(2)
   *  .collect() // [1,2]
   */
  take(count: number): Yielded<TAsync, true, TInput>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * yielded([1,2,3])
   *  .takeLast(2)
   *  .collect() // [2,3]
   */
  takeLast(count: number): Yielded<TAsync, true, TInput>;
  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * yielded([1,2,3])
   *  .count()
   *  .collect() // 3
   */
  count(): Yielded<TAsync, false, number>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .collect() // [1,2]
   */
  takeWhile(fn: (next: TInput) => boolean): Yielded<TAsync, true, TInput>;
  /**
   * sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   *
   * @example
   * yielded([3,2,1])
   *  .toSorted((a, z) => a - z)
   *  .collect() // [1,2,3]
   */
  toSorted(
    compareFn?: (a: TInput, b: TInput) => number,
  ): Yielded<TAsync, true, TInput>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .groupBy(n => n % 2 ? 'odd' : 'even')
   *  .collect() // {even: [2,4], odd: [1,3]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups?: undefined,
  ): Yielded<TAsync, false, Partial<Record<TKey, TInput[]>>>;
  groupBy<TKey extends PropertyKey, TGroups extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups: TGroups[],
  ): Yielded<
    TAsync,
    false,
    Record<TGroups, TInput[]> &
      Partial<Record<Exclude<TKey, TGroups>, TInput[]>>
  >;
  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * yielded([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .collect() // [1,2]
   */
  distinctBy<TValue>(
    selector: (next: TInput) => TValue,
  ): Yielded<TAsync, true, TInput>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * yielded([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .collect() // [1,2,3]
   *
   * @example
   * yielded([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .collect() // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (previous: TInput, current: TInput) => boolean,
  ): Yielded<TAsync, true, TInput>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally, it yields the item with the lowest number to the next operation.
   *
   * @example
   * yielded([2,1,3,4])
   *  .min(n => n)
   *  .collect() // 1
   */
  min(
    selector: (next: TInput) => number,
  ): Yielded<TAsync, false, TInput, undefined>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally it yields the item with the highest number to the next operation.
   *
   * @example
   * yielded([1,2,4,3])
   *  .max(n => n)
   *  .collect() // 4
   */
  max(
    selector: (next: TInput) => number,
  ): Yielded<TAsync, false, TInput, undefined>;

  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .collect() // [1,2,3];
   */
  filter<TOutput extends TInput>(
    fn: (next: TInput) => next is TOutput,
  ): Yielded<TAsync, true, TOutput>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *   .filter(n => n % 2)
   *   .collect() // [1,3];
   */
  filter(fn: (next: TInput) => any): Yielded<TAsync, true, TInput>;

  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
   *
   * @example
   * yielded([1,2,3,4])
   *  .some(n => n > 2)
   *  .collect() // true
   */
  some(fn: (next: TInput) => boolean): Yielded<TAsync, false, boolean>;
  /**
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
   *
   * @example
   * yielded([1,2,3,4])
   *  .every(n => n > 1)
   *  .collect() // false
   */
  every(fn: (next: TInput) => boolean): Yielded<TAsync, false, boolean>;
  /**
   * yields the items in reverse order after the generator is consumed
   * @example
   * yielded([1,2,3])
   *  .toReverse()
   *  .collect() // [3,2,1]
   */
  toReverse(): Yielded<TAsync, true, TInput>;
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
   *  .collect() // [2, 4, 6];
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
   *  .collect() // [1,2,3]
   *
   * @example
   * yielded([[1], [[2]], [[[3]]]])
   *  .flat(2)
   *  .collect() // [1,2,[3]]
   * */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Yielded<TAsync, true, FlatArray<TInput[], Depth>>;
  flatMap<TOutput>(
    callback: (value: TInput) => TOutput | TOutput[],
  ): Yielded<TAsync, true, TOutput>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * yielded([1,2,3,4])
   *  .find(n => n > 2)
   *  .collect() // [3]
   */
  find(
    predicate: (next: TInput) => boolean,
  ): Yielded<TAsync, false, TInput, undefined>;

  /**
   * @example
   * yielded(person)
   *   .find((p): n is Male => p.gender === 'male')
   *   .collect() // Male | undefined;
   *
   * @example
   * yielded(persons)
   *   .find((p): n is Male => p.gender === 'male')
   *   .collect() // Male[];
   */
  find<TOutput extends TInput>(
    predicate: (next: TInput) => next is TOutput,
  ): Yielded<TAsync, false, TOutput, undefined>;
  /**
   * Accepts the previous generator middleware and yields the output's to the next operation.
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
  ): Yielded<TAsync, true, TOutput>;
};

export type YieldedLiftMiddleware<TAsync, TInput, TOutput> =
  TAsync extends false
    ? (
        generator: Generator<TInput, unknown, undefined & void>,
      ) => Generator<TOutput, unknown, undefined & void>
    : (
        generator: AsyncGenerator<TInput, void, undefined & void>,
      ) => AsyncGenerator<TOutput, void, undefined & void>;
