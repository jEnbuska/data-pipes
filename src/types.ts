export type AsyncProviderFunction<
  TOutput,
  TReturn = unknown,
> = () => AsyncGenerator<TOutput, TReturn, undefined & void>;

export type ProviderFunction<TOutput, TReturn = unknown> = () => Generator<
  TOutput,
  TReturn,
  undefined & void
>;

type ConsumerResult<
  TInput,
  TAsync extends boolean = false,
> = TAsync extends true ? Promise<TInput> : TInput;

export type ChainableConsumersFunctions<
  TInput,
  TAsync extends boolean = false,
  TDefault = undefined,
> = {
  [Symbol.toStringTag]: TAsync extends true
    ? "AsyncStreamless"
    : "SyncStreamless";
  /**
   * Triggers the generators to execute and returns their outputs as an array.
   */
  toArray(signal?: AbortSignal): ConsumerResult<TInput[], TAsync>;
  /**
   * Initiates the execution of the generators but does not return any value.
   */
  consume(signal?: AbortSignal): ConsumerResult<void, TAsync>;
  /**
   * Initiates the generators and retrieves the first item they produce.
   * - If the generator provides no items but a defaultTo was provided, the default value is returned.
   */
  first(signal?: AbortSignal): ConsumerResult<TInput | TDefault, TAsync>;
} & (TAsync extends true
  ? {
      [Symbol.asyncIterator](): AsyncIterableIterator<TInput>;
    }
  : {
      [Symbol.iterator](): IterableIterator<TInput>;
    });

type MaybeAwaited<TOutput, TAsync> = TAsync extends true
  ? Awaited<TOutput>
  : TOutput;

export type Chainable<
  TInput = unknown,
  TAsync extends boolean = false,
  TDefault = undefined,
> = TAsync extends false
  ? SyncStreamless<TInput, TDefault>
  : AsyncStreamless<TInput, TDefault>;

export type SyncStreamless<
  TInput = unknown,
  TDefault = undefined,
> = ChainableFunctions<TInput, false, TDefault> & {
  isAsync: false;
  resolve(): AsyncStreamless<
    TInput extends Promise<infer U> ? U : TInput,
    TDefault
  >;
};

export type AsyncStreamless<
  TInput = unknown,
  TDefault = undefined,
> = ChainableFunctions<TInput, true, TDefault> & { isAsync: true };

type ChainableFunctions<
  TInput = unknown,
  TAsync extends boolean = false,
  TDefault = undefined,
> = ChainableConsumersFunctions<TInput, TAsync, TDefault> & {
  /**
   * Maps next item produced by the generator using the provided transform function and yields it
   * to the next operation.
   *
   * @example
   * streamless([1,2,3])
   *  .map(n => n * 2)
   *  .toArray() // [2, 4, 6];
   */
  map<TOutput = unknown>(
    mapper: (next: TInput) => TOutput,
  ): Chainable<MaybeAwaited<TOutput, TAsync>, TAsync>;
  /**
   * Batch values into groups   *
   * @example
   * streamless([1,2,3,4,5])
   *  .batch(acc => acc.length < 3)
   *  .toArray() // [[1,2], [3,4] [5]];
   */
  batch(
    predicate: (acc: TInput[]) => boolean,
  ): Chainable<MaybeAwaited<TInput[], TAsync>, TAsync, TInput[]>;
  /**
   * Returns a new array with all sub-array elements concatenated into it recursively up to the
   * specified depth.
   *
   * @example
   * streamless([[1], [2], [3]])
   *  .flat()
   *  .toArray() // [1,2,3]
   *
   * @example
   * streamless([[1], [[2]], [[[3]]]])
   *  .flat(2)
   *  .toArray() // [1,2,[3]]
   * */
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Chainable<FlatArray<TInput[], Depth>, TAsync>;
  flatMap<TOutput>(
    callback: (value: TInput) => TOutput | readonly TOutput[],
  ): Chainable<MaybeAwaited<TOutput, TAsync>, TAsync>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * streamless([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .toArray() // [1,2,3];
   */
  filter<TOutput extends TInput>(
    fn: (next: TInput) => next is TOutput,
  ): Chainable<MaybeAwaited<TOutput, TAsync>, TAsync>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * streamless([1,2,3])
   *   .filter(n => n % 2)
   *   .toArray() // [1,3];
   */
  filter(fn: (next: TInput) => any): Chainable<TInput, TAsync>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * streamless([1,2,3])
   *   .reduce((sum, n) => sum + n, 0)
   *   .first() // 6
   * */
  reduce<TOutput>(
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
    initialValue: TOutput,
  ): Chainable<TOutput, TAsync, TOutput>;
  /**
   * Just and other way to reduce items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * streamless([1,2,3])
   *   .fold(() => 0, (sum, n) => sum + n)
   *   .first() // 6
   * */
  fold<TOutput>(
    initial: () => TOutput,
    reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  ): Chainable<TOutput, TAsync, TOutput>;
  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * streamless([1,2,3])
   *  .forEach(n => console.log(n)) // 1, 2, 3
   *  .consume();
   * */
  forEach(
    callback: (next: TInput) => unknown,
  ): Chainable<TInput, TAsync, TDefault>;
  /**
   * skips the first `count` items produced by the generator and yields the rest to the next operation.
   * @example
   * streamless([1,2,3])
   *  .skip(2)
   *  .toArray() // [3]
   */
  skip(count: number): Chainable<TInput, TAsync>;
  /**
   * skips the last `count` items produced by the generator and yields the rest to the next operation.
   * @example
   * streamless([1,2,3])
   *  .skipLast(2)
   *  .toArray() // [1]
   */
  skipLast(count: number): Chainable<TInput, TAsync>;
  /**
   * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * streamless([1,2,3,4])
   *  .skipWhile(n => n < 3)
   *  .toArray() // [3,4]
   * */
  skipWhile(fn: (next: TInput) => boolean): Chainable<TInput, TAsync>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * streamless([1,2,3])
   *  .take(2)
   *  .toArray() // [1,2]
   */
  take(count: number): Chainable<TInput, TAsync>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * streamless([1,2,3])
   *  .takeLast(2)
   *  .toArray() // [2,3]
   */
  takeLast(count: number): Chainable<TInput, TAsync>;
  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * streamless([1,2,3])
   *  .count()
   *  .first() // 3
   */
  count(): Chainable<number, TAsync, number>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * streamless([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .toArray() // [1,2]
   */
  takeWhile(fn: (next: TInput) => boolean): Chainable<TInput, TAsync>;
  /**
   * sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   *
   * @example
   * streamless([3,2,1])
   *  .sort((a, z) => a - z)
   *  .toArray() // [1,2,3]
   */
  sort(compareFn?: (a: TInput, b: TInput) => number): Chainable<TInput, TAsync>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * streamless([1,2,3,4])
   *  .groupBy(n => n % 2 ? 'odd' : 'even')
   *  .first() // {even: [2,4], odd: [1,3]}
   */
  groupBy<TKey extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups?: undefined,
  ): Chainable<
    Partial<Record<TKey, TInput[]>>,
    TAsync,
    Partial<Record<TKey, TInput[]>>
  >;
  groupBy<TKey extends PropertyKey, TGroups extends PropertyKey>(
    keySelector: (next: TInput) => TKey,
    groups: TGroups[],
  ): Chainable<
    Record<TGroups, TInput[]> &
      Partial<Record<Exclude<TKey, TGroups>, TInput[]>>,
    TAsync,
    Record<TGroups, TInput[]> &
      Partial<Record<Exclude<TKey, TGroups>, TInput[]>>
  >;
  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * streamless([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .toArray() // [1,2]
   */
  distinctBy<TValue>(
    selector: (next: TInput) => TValue,
  ): Chainable<TInput, TAsync>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * streamless([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .toArray() // [1,2,3]
   *
   * @example
   * streamless([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .toArray() // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (previous: TInput, current: TInput) => boolean,
  ): Chainable<TInput, TAsync>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally it yields the item with the lowest number to the next operation.
   *
   * @example
   * streamless(2,1,3,4)
   *  .min(n => n)
   *  .first() // 1
   */
  min(selector: (next: TInput) => number): Chainable<TInput, TAsync>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally it yields the item with the highest number to the next operation.
   *
   * @example
   * streamless([1,2,4,3])
   *  .max(n => n)
   *  .first() // 4
   */
  max(selector: (next: TInput) => number): Chainable<TInput, TAsync>;
  /**
   * yields the default value if the generator does not produce any items
   *
   * @example
   * streamless([1,2,3])
   *  .filter(it => it > 3)
   *  .defaultTo(0)
   *  .first() // 0
   */
  defaultTo<TDefault = TInput>(
    getDefault: () => TDefault,
  ): Chainable<TInput | TDefault, TAsync, TDefault>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * streamless([1,2,3,4])
   *  .find(n => n > 2)
   *  .toArray() // [3]
   */
  find(fn: (next: TInput) => boolean): Chainable<TInput, TAsync>;
  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
   *
   * @example
   * streamless([1,2,3,4])
   *  .some(n => n > 2)
   *  .first() // true
   */
  some(fn: (next: TInput) => boolean): Chainable<boolean, TAsync, false>;
  /**
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
   *
   * @example
   * streamless([1,2,3,4])
   *  .every(n => n > 1)
   *  .first() // false
   */
  every(fn: (next: TInput) => boolean): Chainable<boolean, TAsync, true>;
  /**
   * yields the items in reverse order after the generator is consumed
   * @example
   * streamless([1,2,3])
   *  .reverse()
   *  .toArray() // [3,2,1]
   */
  reverse(): Chainable<TInput, TAsync>;
  /**
   * Accepts a generator middleware and yields the output of the middleware to the next operation.
   *
   * @example
   * streamless([1,2,3])
   *  .lift(function* multiplyByTwo(generator) {
   *    using generator =  InternalStreamless.disposable(source);
    for (const next of generator) {
   *     yield next * 2;
   *    }
   *   })
   *   .toArray() // [2, 4, 6]
   *
   * @example
   * streamless([-2,1,2,-3,4])
   *  .lift(function* filterNegatives(generator) {
   *   using generator =  InternalStreamless.disposable(source);
    for (const next of generator) {
   *    if (next < 0) continue;
   *     yield next;
   *    }
   *   })
   *   .toArray() // [1, 2, 4]
   *
   * @example
   * streamless("a", "b", "c")
   *  .lift(function* joinStrings(source) {
   *    return function() {
   *      const acc: string[] = [];
   *      using generator =  InternalStreamless.disposable(source);
    for (const next of generator) {
   *       acc.push(next);
   *      }
   *      yield acc.join(".");
   *    }
   *  })
   *  .first() // "a.b.c"
   * */
  lift<TOutput = never>(
    middleware: TAsync extends true
      ? (
          source: AsyncProviderFunction<TInput>,
        ) => AsyncProviderFunction<TOutput>
      : (source: ProviderFunction<TInput>) => ProviderFunction<TOutput>,
  ): Chainable<TOutput, TAsync>;

  countBy(fn: (next: TInput) => number): Chainable<number, TAsync, number>;

  chunkBy<TIdentifier>(
    fn: (next: TInput) => TIdentifier,
  ): Chainable<MaybeAwaited<TInput[], TAsync>, TAsync, TInput[]>;
};

export type LiftMiddleware<TInput, TOutput> = (
  source: ProviderFunction<TInput>,
) => ProviderFunction<TOutput>;
export type AsyncLiftMiddleware<TInput, TOutput> = (
  source: AsyncProviderFunction<TInput>,
) => AsyncProviderFunction<TOutput>;
