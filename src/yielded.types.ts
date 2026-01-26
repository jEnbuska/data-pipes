import type { IYieldedBatch } from "./middlewares/batch.ts";
import type { IYieldedChunkBy } from "./middlewares/chunkBy.ts";
import type { IYieldedDistinctBy } from "./middlewares/distinctBy.ts";
import type { IYieldedDistinctUntilChanged } from "./middlewares/distinctUntilChanged.ts";
import type { IYieldedDrop } from "./middlewares/drop.ts";
import type { IYieldedDropLast } from "./middlewares/dropLast.ts";
import type { IYieldedDropWhile } from "./middlewares/dropWhile.ts";
import type { IYieldedFilter } from "./middlewares/filter.ts";
import type { IYieldedFlat } from "./middlewares/flat.ts";
import type { IYieldedFlatMap } from "./middlewares/flatMap.ts";
import type { IYieldedLift } from "./middlewares/lift.ts";
import type { IYieldedMap } from "./middlewares/map.ts";
import type { IYieldedReverse } from "./middlewares/reversed.ts";
import type { IYieldedSorted } from "./middlewares/sorted.ts";
import type { IYieldedTake } from "./middlewares/take.ts";
import type { IYieldedTakeLast } from "./middlewares/takeLast.ts";
import type { IYieldedTakeWhile } from "./middlewares/takeWhile.ts";
import type { IYieldedTap } from "./middlewares/tap.ts";
import type {
  IAsyncYieldedResolver,
  IYieldedResolver,
} from "./resolvers/resolver.types.ts";
import type {
  CallbackReturn,
  NextYielded,
  YieldedGenerator,
} from "./shared.types.ts";

export interface IAsyncYielded<T>
  extends IYieldedOperations<T, true>, IAsyncYieldedResolver<T> {
  /**
   * Enables parallel processing for the **next asynchronous operation**.
   *
   * By default, items are processed sequentially (one at a time).
   * Calling `parallel(count)` configures the pipeline so that the
   * **following async-producing operation** may run with up to
   * `count` items in flight simultaneously.
   *
   * This setting does not retroactively affect previous operations
   * in the pipeline — it applies only to the next async stage.
   *
   * As soon as one operation completes, the next pending item
   * is started, keeping at most `count` operations active.
   *
   * Results are yielded in **order of completion**, not in the
   * original input order.
   *
   * This is useful for increasing throughput when performing
   * independent asynchronous work such as network requests,
   * timers, or I/O.
   *
   * @example
   * ```ts
   * Yielded.from([550, 450, 300, 10, 100])
   *  .map((m) => sleep(m).then(() => it))
   *  .awaited()
   *  .parallel(3)
   *  .toArray() // Promise<[300, 10, 100, 450, 550]>
   */
  parallel(count: number): IAsyncYielded<T>;
}

export interface IYielded<T>
  extends IYieldedOperations<T, false>, IYieldedResolver<T> {
  /**
   * @example
   * await Yielded.from([1,2,3])
   *  .map(n => Promise.resolve(n))
   *  .awaited()
   *  .map(n => n * 2)
   *  .toArray() // Promise<[1,2,3]>
   */
  awaited(): IAsyncYielded<Awaited<T>> & IAsyncYieldedResolver<Awaited<T>>;
}

export interface IYieldedOperations<T, TAsync extends boolean>
  extends
    IYieldedChunkBy<T, TAsync>,
    IYieldedBatch<T, TAsync>,
    IYieldedDrop<T, TAsync>,
    IYieldedDropLast<T, TAsync>,
    IYieldedDropWhile<T, TAsync>,
    IYieldedTake<T, TAsync>,
    IYieldedTakeLast<T, TAsync>,
    IYieldedTakeWhile<T, TAsync>,
    IYieldedSorted<T, TAsync>,
    IYieldedReverse<T, TAsync>,
    IYieldedDistinctBy<T, TAsync>,
    IYieldedDistinctUntilChanged<T, TAsync>,
    IYieldedFilter<T, TAsync>,
    IYieldedMap<T, TAsync>,
    IYieldedFlatMap<T, TAsync>,
    IYieldedFlat<T, TAsync>,
    IYieldedLift<T, TAsync>,
    IYieldedTap<T, TAsync> {
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
  ): NextYielded<TOut, TAsync>;
  /**
   * Filters items produced by the generator using the provided predicate
   * and yields the items that pass the predicate to the next operation.
   *
   * @example
   * Yielded.from([1,2,3])
   *   .filter(n => n % 2)
   *   .toArray() satisfies number[] // [1,3] ;
   */
  filter(fn: (next: T) => any): NextYielded<T, TAsync>;

  /**
   * yields the items in reverse order after the parent generator is consumed
   * @example
   * Yielded.from([1,2,3])
   *  .reversed()
   *  .toArray() satisfies number[] // [3,2,1]
   */
  reversed(): NextYielded<T, TAsync>;
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
    mapper: (next: T) => CallbackReturn<TOut, TAsync>,
  ): NextYielded<TOut, TAsync>;

  /**
   * Calls the provided consumer function for each item produced by the generator and yields it
   * to the next operation.
   * @example
   * Yielded.from([1,2,3])
   *  .tab(n => console.log(n))
   *  .toArray() satisfies number[] // ([1, 2, 3])
   */
  tap(callback: (next: T) => unknown): NextYielded<T, TAsync>;
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
  ): NextYielded<FlatArray<T[], Depth>, TAsync>;
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
   *  .first() satisfies string | undefined // "a.b.c"
   */
  lift<TOut = never>(
    middleware: (
      generator: YieldedGenerator<T, TAsync>,
    ) => YieldedGenerator<TOut, TAsync>,
  ): NextYielded<TOut, TAsync>;

  flatMap<TOut>(
    mapper: (
      next: T,
      index: number,
    ) => CallbackReturn<readonly TOut[] | Iterable<TOut> | TOut, TAsync>,
  ): NextYielded<TOut, TAsync>;
}
