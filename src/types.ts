import type { OnDoneAction, OnNextAction } from "./generators/actions.ts";

export type OnNext<In, Out = In, Return = never> = (next: In) => Generator<
  never | OnNextAction<Out>,
  | void
  | undefined
  | {
      onNext?: (
        next: In,
      ) => Generator<never | OnNextAction<Out>, void | undefined, void>;
      onDone?: OnDone<Out, Return>;
    },
  void
>;

export type OnDone<Out, Return = never> = () => Generator<
  never | OnDoneAction<Out, Return>,
  void | undefined,
  unknown
>;

export type YieldedProvider<In, Out = In, Return = never> = () => {
  onNext?: OnNext<In, Out, Return>;
  onDone?: OnDone<Out, Return>;
  preferReturn?: boolean;
  onDispose?: () => void;
};

export type Yielded<
  Args extends any[],
  Async extends boolean,
  TIterable extends boolean,
  In,
  TDefault = In,
> = TIterable extends true
  ? IterableYielded<Args, Async, In>
  : SingleYielded<Args, Async, In, TDefault>;

type SingleYielded<
  Args extends any[],
  Async extends boolean,
  T,
  TDefault = T,
> = Async extends true
  ? AsyncSingleYielded<Args, T, TDefault>
  : SyncSingleYielded<Args, T, TDefault>;

type IterableYielded<
  Args extends any[],
  Async extends boolean,
  In,
> = Async extends true
  ? AsyncIterableYielded<Args, In>
  : SyncIterableYielded<Args, In>;

type MaybePromise<In, Async extends boolean> = Async extends true
  ? Promise<In>
  : In;

export type SyncSingleYielded<Args extends any[], In, D> = CommonYielded<
  Args,
  false,
  false,
  In,
  D
> & {
  /**
   * @example
   * await yielded(1)
   *   .map(n => Promise.resolve(n))
   *   .toAwaited()
   *   .map(n => n * 2)
   *   .resolve() // Promise<number | undefined>
   * */
  toAwaited(): AsyncSingleYielded<Args, In, undefined>;
  [Symbol.toStringTag]: `SyncSingleYielded`;

  forEach(callback: (next: In) => void, ...args: Args): void;
  consume(...args: Args): void;
  resolve(...args: Args): In | D;
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
  ): Pick<SyncSingleYielded<Args, In, TDefault>, "resolve">;
};
export type AsyncSingleYielded<
  Args extends any[],
  In,
  TDefault,
> = CommonYielded<Args, true, false, Awaited<In>, TDefault> & {
  [Symbol.toStringTag]: `AsyncSingleYielded`;
  consume(...args: Args): Promise<void>;
  resolve(...args: Args): Promise<In | TDefault>;
  forEach(callback: (next: In) => void, ...args: Args): Promise<void>;
  /**
   * defaultTo Provides default value before resolving yielded for single result to avoid 'undefined' case
   * @example
   * yielded([1,2,3])
   *  .toAwaited()
   *  .find(n => n < 0)
   *  .defaultTo(0)
   *  .resolve() satisfies Promise<number> // Promise<0>
   */
  defaultTo<D>(
    getDefault: () => D,
  ): Pick<AsyncSingleYielded<Args, In, D>, "resolve">;
};

export type SyncIterableYielded<Args extends any[], In> = SharedIterableYielded<
  Args,
  false,
  In
> & {
  /**
   * @example
   * await yielded([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .toAwaited()
   *  .map(n => n * 2)
   *  .resolve() // Promise<[1,2,3]>
   */
  toAwaited(): AsyncIterableYielded<Args, In>;
  /**
   * @example
   * yielded([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .toAwaitedParallel(3)
   *  .resolve() // Promise<[300, 10, 100, 450, 550]>
   */
  toAwaitedParallel(count: number): AsyncIterableYielded<Args, In>;
  [Symbol.iterator](): IterableIterator<In>;
  [Symbol.toStringTag]: `SyncIterableYielded`;
  consume(...args: Args): void;
  resolve(...args: Args): In[];
  forEach(callback: (next: In) => void, ...args: Args): void;
};

export type AsyncIterableYielded<
  Args extends any[],
  In,
> = SharedIterableYielded<Args, true, Awaited<In>> & {
  [Symbol.asyncIterator](): AsyncIterableIterator<In>;
  [Symbol.toStringTag]: `AsyncIterableYielded`;
  consume(...args: Args): Promise<void>;
  resolve(...args: Args): Promise<Array<Awaited<In>>>;
};

export type SharedIterableYielded<
  Args extends any[],
  Async extends boolean = false,
  In = unknown,
> = CommonYielded<Args, Async, true, In> & {
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
  countBy(fn: (next: In) => number): SingleYielded<Args, Async, number, number>;
  /**
   * @examples
   * yielded([1,2,3,4,5])
   * .chunkBy((n) => n % 2)
   * .resolve() // [[1,3,5], [2,4]]
   * */
  chunkBy<TIdentifier>(
    fn: (next: In) => TIdentifier,
  ): IterableYielded<Args, Async, In[]>;
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
  batch(predicate: (acc: In[]) => boolean): IterableYielded<Args, Async, In[]>;
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
  reduce<Out>(
    reducer: (acc: Out, next: In, index: number) => Out,
    initialValue: Out,
  ): SingleYielded<Args, Async, Out>;
  reduce<Out = In>(
    reducer: (acc: Out, next: In, index: number) => Out,
  ): SingleYielded<Args, Async, Out>;
  /**
   * @example
   * yielded([1,2,3,4,5])
   *   .skip(2)
   *   .resolve() // [3,4,5]
   * */
  skip(count: number): IterableYielded<Args, Async, In>;
  /**
   * skips the last `count` items produced by the generator and yields the rest to the next operation.
   * Note. The dropLast operator stars emitting previous values to next operation, when it has the skipped amount
   * of values buffered
   * @example
   * yielded([1,2,3,4,5])
   *  .dropLast(2)
   *  .resolve() // [1,2,3]
   
   *
   * @example
   * yielded(['A','B','C','D', 'E'])
   *  .tap(l => storeStep.push(`${l}1`))
   *  .dropLast(2)
   *  .tap(l => storeStep.push(`${l}2`))
   *  .consume()
   *  // steps ->
   *  // A1  B1  C1
   *  // A2          D1
   *  //     B2          E1
   *  //         C2
   */
  skipLast(count: number): IterableYielded<Args, Async, In>;
  /**
   * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .skipWhile(n => n < 3)
   *  .resolve() // [3,4]
   * */
  skipWhile(fn: (next: In) => boolean): IterableYielded<Args, Async, In>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * yielded([1,2,3,4,5])
   *  .take(2)
   *  .resolve() // [1,2]
   */
  take(count: number): IterableYielded<Args, Async, In>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .takeLast(2)
   *  .resolve() // [4,5]
   */
  takeLast(count: number): IterableYielded<Args, Async, In>;
  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * yielded([1,2,3])
   *  .count()
   *  .resolve() // 3
   */
  count(): SingleYielded<Args, Async, number>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * yielded([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .resolve() // [1,2]
   */
  takeWhile(fn: (next: In) => boolean): IterableYielded<Args, Async, In>;
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
    compareFn: (a: In, b: In) => number,
  ): IterableYielded<Args, Async, In>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even')
   *  .resolve() // {even: [2,4], odd: [1,3,5]}
   */
  groupBy<K extends PropertyKey>(
    keySelector: (next: In) => K,
    groups?: undefined,
  ): SingleYielded<Args, Async, Partial<Record<K, In[]>>>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * Defining 'groups' argument you can ensure that all these groups are part of the result
   * @example
   * yielded([1,2,3,4,5])
   *  .groupBy(n => n % 2 ? 'odd' : 'even', ['odd', 'even', 'other'])
   *  .collect() // {even: [2,4], odd: [1,3,5], other:[]}
   */
  groupBy<K extends PropertyKey, G extends PropertyKey>(
    keySelector: (next: In) => K,
    groups: G[],
  ): SingleYielded<
    Args,
    Async,
    Record<G, In[]> & Partial<Record<Exclude<K, G>, In[]>>
  >;
  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * yielded([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .resolve() // [1,2]
   */
  distinctBy<Our>(
    selector: (next: In) => Our,
  ): IterableYielded<Args, Async, In>;
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
    comparator?: (previous: In, current: In) => unknown,
  ): IterableYielded<Args, Async, In>;
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
    selector: (next: In) => number,
  ): SingleYielded<Args, Async, In, undefined>;
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
    selector: (next: In) => number,
  ): SingleYielded<Args, Async, In, undefined>;

  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .resolve() satisfies number[] // [1,2,3];
   */
  filter<Our extends In>(
    fn: (next: In) => next is Our,
  ): IterableYielded<Args, Async, Our>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * yielded([1,2,3])
   *   .filter(n => n % 2)
   *   .resolve() // [1,3];
   */
  filter(fn: (next: In) => unknown): IterableYielded<Args, Async, In>;

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
  some(fn: (next: In) => boolean): SingleYielded<Args, Async, boolean>;
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
  every(fn: (next: In) => boolean): SingleYielded<Args, Async, boolean>;
  /**
   * yields the items in reverse order after the parent generator is consumed
   * @example
   * yielded([1,2,3])
   *  .toReverse()
   *  .resolve() // [3,2,1]
   */
  toReverse(): IterableYielded<Args, Async, In>;
};

type CommonYielded<
  Args extends any[],
  Async extends boolean,
  TIterable extends boolean,
  In,
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
  map<Out = unknown>(
    mapper: (next: In) => Out,
  ): Yielded<Args, Async, TIterable, Out, undefined>;

  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * yielded([1,2,3])
   *  .tab(n => console.log(n)) // 1, 2, 3
   *  .consume();
   * */
  tap(
    callback: (next: In) => unknown,
  ): Yielded<Args, Async, TIterable, In, TDefault>;
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
  ): IterableYielded<Args, Async, FlatArray<In[], Depth>>;
  flatMap<Out>(
    callback: (value: In) => Out | Out[],
  ): IterableYielded<Args, Async, Out>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * yielded([1,2,3,4])
   *  .find(n => n > 2)
   *  .resolve() // [3]
   */
  find(
    predicate: (next: In) => boolean,
    ...args: Args
  ): MaybePromise<In | undefined, Async>;

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
  find<Out extends In>(
    predicate: (next: In) => next is Out,
  ): MaybePromise<Out | undefined, Async>;
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
  lift<Out = never>(
    middleware: YieldedLiftMiddleware<Async, In, Out>,
  ): IterableYielded<Args, Async, Out>;
};
