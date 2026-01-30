import type { IYieldedBatch } from "./generators/next/batch.ts";
import type { IYieldedChunkBy } from "./generators/next/chunkBy.ts";
import type { IYieldedDistinctBy } from "./generators/next/distinctBy.ts";
import type { IYieldedDistinctUntilChanged } from "./generators/next/distinctUntilChanged.ts";
import type { IYieldedDrop } from "./generators/next/drop.ts";
import type { IYieldedDropLast } from "./generators/next/dropLast.ts";
import type { IYieldedDropWhile } from "./generators/next/dropWhile.ts";
import type { IYieldedFilter } from "./generators/next/filter.ts";
import type { IYieldedFlat } from "./generators/next/flat.ts";
import type { IYieldedFlatMap } from "./generators/next/flatMap.ts";
import type { IYieldedLift } from "./generators/next/lift.ts";
import type { IYieldedMap } from "./generators/next/map.ts";
import type { IYieldedReverse } from "./generators/next/reversed.ts";
import type { IYieldedSorted } from "./generators/next/sorted.ts";
import type { IYieldedTake } from "./generators/next/take.ts";
import type { IYieldedTakeLast } from "./generators/next/takeLast.ts";
import type { IYieldedTakeWhile } from "./generators/next/takeWhile.ts";
import type { IYieldedTap } from "./generators/next/tap.ts";
import type { IYieldedToSet } from "./resolvers/apply/toSet.ts";
import type {
  IAsyncYieldedResolver,
  IYieldedResolver,
} from "./resolvers/resolver.types.ts";

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
   * in the pipeline — it applies only to the next async operation.
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
  awaited(): IAsyncYielded<Awaited<T>>;
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
    IYieldedTap<T, TAsync>,
    IYieldedToSet<T, TAsync> {}
