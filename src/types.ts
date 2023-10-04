export type GeneratorProvider<T> = Generator<T, void, undefined & void>;

export type GeneratorMiddleware<Input, Output = Input> = (
  generator: GeneratorProvider<Input>,
) => GeneratorProvider<Output>;

export type PipeSource<Input> =
  | Input
  | Input[]
  | (() => GeneratorProvider<Input>)
  | GeneratorConsumable<Input>;

export type GeneratorConsumable<Input> = {
  [Symbol.iterator]: () => Generator<Input, void, undefined & void>;
  [Symbol.toStringTag]: "GeneratorConsumer";
  /**
   * Triggers the generators to execute and returns their outputs as an array.
   */
  toArray(): Input[];
  /**
   * Initiates the execution of the generators but does not return any value.
   */
  consume(): void;
  /**
   * Initiates the generators and retrieves the first item they produce.
   *
   * - If the generator provides no items and no default value is specified, an error is thrown upon completion.
   * - If the generator provides no items but a default value is specified, the default value is returned.
   */
  first<Default = Input>(defaultValue?: Default): Input | Default;
};
export type Chainable<Input> = GeneratorConsumable<Input> & {
  /**
   * Maps next item produced by the generator using the provided transform function and yields it
   * to the next operation.
   *
   * @example
   * chainable([1,2,3])
   *  .map(n => n * 2)
   *  .toArray() // [2, 4, 6];
   */
  map<Output>(mapper: (next: Input) => Output): Chainable<Output>;
  flat<Depth extends number = 1>(
    depth?: Depth,
  ): Chainable<FlatArray<Input[], Depth>>;
  unflat(): Chainable<Input[]>;
  flatMap<Output>(
    callback: (value: Input) => Output | readonly Output[],
  ): Chainable<Output>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * chainable([1,2,3,"A"])
   *   .filter((n): n is number => typeof n === "number")
   *   .toArray() // [1,2,3];
   */
  filter<Output extends Input>(
    fn: (next: Input) => next is Output,
  ): Chainable<Output>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * chainable([1,2,3])
   *   .filter(n => n % 2)
   *   .toArray() // [1,3];
   */
  filter<Input>(fn: (next: Input) => unknown): Chainable<Input>;
  /**
   * Reduces items produced by the generator using the provided reducer function.
   * The final result of the reduction is yielded to the next operation.
   * @example
   * chainable([1,2,3])
   *   .reduce((sum, n) => sum + n, 0)
   *   .first() // 6
   * */
  reduce<Output>(
    fn: (acc: Output, next: Input) => Output,
    initialValue: Output,
  ): Chainable<Output>;
  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * chainable([1,2,3])
   *  .forEach(n => console.log(n)) // 1, 2, 3
   *  .consume();
   * */
  forEach(callback: (next: Input) => void): Chainable<Input>;
  /**
   * skips the first `count` items produced by the generator and yields the rest to the next operation.
   * @example
   * chainable([1,2,3])
   *  .skip(2)
   *  .toArray() // [3]
   */
  skip(count: number): Chainable<Input>;
  /**
   * skips the last `count` items produced by the generator and yields the rest to the next operation.
   * @example
   * chainable([1,2,3])
   *  .skipLast(2)
   *  .toArray() // [1]
   */
  skipLast(count: number): Chainable<Input>;
  /**
   * skips items produced by the generator while the predicate returns true and yields the rest to the next operation.
   * @example
   * chainable([1,2,3,4])
   *  .skipWhile(n => n < 3)
   *  .toArray() // [3,4]
   * */
  skipWhile(fn: (next: Input) => boolean): Chainable<Input>;
  /**
   * yields the first `count` items produced by the generator to the next and ignores the rest.
   * @example
   * chainable([1,2,3])
   *  .take(2)
   *  .toArray() // [1,2]
   */
  take(count: number): Chainable<Input>;
  /**
   * takes the last `count` items produced by the generator and yields them to the next operation.
   * @example
   * chainable([1,2,3])
   *  .takeLast(2)
   *  .toArray() // [2,3]
   */
  takeLast(count: number): Chainable<Input>;
  /**
   * counts the number of items produced by the generator and then yields the total to the next operation.
   * @example
   * chainable([1,2,3])
   *  .count()
   *  .first() // 3
   */
  count(): Chainable<number>;
  /**
   * takes items produced by the generator while the predicate returns true and yields them to the next operation.
   * @example
   * chainable([1,2,3,4])
   *  .takeWhile(n => n < 3)
   *  .toArray() // [1,2]
   */
  takeWhile(fn: (next: Input) => boolean): Chainable<Input>;
  /**
   * sorts the items produced by the generator and then yields them to the next operation one by one in the sorted order.
   *
   * @example
   * chainable([3,2,1])
   *  .sort((a, z) => a - z)
   *  .toArray() // [1,2,3]
   */
  sort(compareFn?: (a: Input, b: Input) => number): Chainable<Input>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * chainable([1,2,3,4])
   *  .groupBy(n => n % 2 ? 'odd' : 'even')
   *  .first() // {even: [2,4], odd: [1,3]}
   */
  groupBy<Key extends PropertyKey>(
    keySelector: (next: Input) => Key,
  ): Chainable<Record<Key, Input[]>>;
  /**
   * Groups items produced by the generator by the key returned by the keySelector and finally then yields the grouped data to the next operation.
   * @example
   * chainable([1,2,3,4])
   *  .groupBy(n => n % 2 ? 'odd' : 'even', ["odd", "other"])
   *  .first() // {odd: [1,3], even: [2,4], other: []}
   */
  groupBy<
    Key extends PropertyKey,
    Groups extends Array<Key | PropertyKey> = [],
  >(
    keySelector: (next: Input) => Key | PropertyKey,
    groups?: Groups,
  ): Chainable<Record<Groups[number], Input[]> & Partial<Record<Key, Input[]>>>;
  /**
   * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
   *
   * @example
   * chainable([1,2,3,4])
   *  .distinctBy(n => n % 2)
   *  .toArray() // [1,2]
   */
  distinctBy<Value>(selector: (next: Input) => Value): Chainable<Input>;
  /**
   * filters out items produced by the generator that are equal to the previous item by the compare function.
   * If no compare function is provided, the strict equality operator is used.
   *
   * @example
   * chainable([1,2,2,2,3])
   *  .distinctUntilChanged()
   *  .toArray() // [1,2,3]
   *
   * @example
   * chainable([1, 2, 5, 8, 3])
   *  .distinctUntilChanged((previous, current) => previous % 3 === current % 3)
   *  .toArray() // [1,2,3]
   */
  distinctUntilChanged(
    comparator?: (previous: Input, current: Input) => boolean,
  ): Chainable<Input>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally it yields the item with the lowest number to the next operation.
   *
   * @example
   * chainable(2,1,3,4)
   *  .min(n => n)
   *  .first() // 1
   */
  min(selector: (next: Input) => number): Chainable<Input>;
  /**
   * takes each item produced by the generator and maps it to a number using the callback.
   * Finally it yields the item with the highest number to the next operation.
   *
   * @example
   * chainable([1,2,4,3])
   *  .max(n => n)
   *  .first() // 4
   */
  max(selector: (next: Input) => number): Chainable<Input>;
  /**
   * yields the default value if the generator does not produce any items
   *
   * @example
   * chainable([1,2,3])
   *  .filter(it => it > 3)
   *  .defaultIfEmpty(0)
   *  .first() // 0
   */
  defaultIfEmpty<Default = Input>(
    defaultValue: Default,
  ): Chainable<Input | Default>;
  /**
   * takes each item produced by the generator until predicate returns true, and then it yields the value to the next operation
   * @example
   * chainable([1,2,3,4])
   *  .find(n => n > 2)
   *  .toArray() // [3]
   */
  find(fn: (next: Input) => boolean): Chainable<Input>;
  /**
   * yields true when predicate returns true for the first time, otherwise finally it yields false after the generator is consumer. <br/>
   * if the generator is empty yields false
   *
   * @example
   * chainable([1,2,3,4])
   *  .some(n => n > 2)
   *  .first() // true
   */
  some(fn: (next: Input) => boolean): Chainable<boolean>;
  /**
   * yields false when predicate returns false for the first time, otherwise finally it yields true after the generator is consumer. <br/>
   * if the generator is empty yields true
   *
   * @example
   * chainable([1,2,3,4])
   *  .every(n => n > 1)
   *  .first() // false
   */
  every(fn: (next: Input) => boolean): Chainable<boolean>;
  /**
   * yields the items in reverse order after the generator is consumed
   * @example
   * chainable([1,2,3])
   *  .reverse()
   *  .toArray() // [3,2,1]
   */
  reverse(): Chainable<Input>;
  /**
   * Accepts a generator middleware and yields the output of the middleware to the next operation.
   *
   * @example
   * chainable([1,2,3])
   *  .lift(function* multiplyByTwo(generator) {
   *    for (const next of generator) {
   *     yield next * 2;
   *    }
   *   })
   *   .toArray() // [2, 4, 6]
   *
   * @example
   * chainable([-2,1,2,-3,4])
   *  .lift(function* filterNegatives(generator) {
   *   for (const next of generator) {
   *    if (next < 0) continue;
   *     yield next;
   *    }
   *   })
   *   .toArray() // [1, 2, 4]
   *
   * @example
   * chainable("a", "b", "c")
   *  .lift(function* joinStrings(generator) {
   *    const acc: string[] = [];
   *    for (const next of generator) {
   *     acc.push(next);
   *    }
   *    yield acc.join(".");
   *  })
   *  .first() // "a.b.c"
   * */
  lift<Output = never>(
    generatorFunction: GeneratorMiddleware<Input, Output>,
  ): Chainable<Output>;
};
