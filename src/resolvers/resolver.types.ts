import type { IYieldedConsume } from "./apply/consume.ts";
import type { IYieldedCount } from "./apply/count.ts";
import type { IYieldedEvery } from "./apply/every.ts";
import type { IYieldedFind } from "./apply/find.ts";
import type { IYieldedFirst } from "./apply/first.ts";
import type { IYieldedForEach } from "./apply/forEach.ts";
import type { IYieldedGroupBy } from "./apply/groupBy.ts";
import type { IYieldedLast } from "./apply/last.ts";
import type { IYieldedMaxBy } from "./apply/maxBy.ts";
import type { IYieldedMinBy } from "./apply/minBy.ts";
import type { IYieldedReduce } from "./apply/reduce.ts";
import type { IYieldedSome } from "./apply/some.ts";
import type { IYieldedSumBy } from "./apply/sumBy.ts";
import type { IYieldedToArray } from "./apply/toArray.ts";
import type { IYieldedToReversed } from "./apply/toReversed.ts";
import type { IYieldedToSorted } from "./apply/toSorted.ts";

/** If Async then Promise<T> otherwise T */
export type ReturnValue<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T>
  : T;

interface ISharedYieldedResolver<T, TAsync extends boolean>
  extends
    IYieldedReduce<T, TAsync>,
    IYieldedFind<T, TAsync>,
    IYieldedMaxBy<T, TAsync>,
    IYieldedSome<T, TAsync>,
    IYieldedEvery<T, TAsync>,
    IYieldedMinBy<T, TAsync>,
    IYieldedGroupBy<T, TAsync>,
    IYieldedCount<TAsync>,
    IYieldedSumBy<T, TAsync>,
    IYieldedToSorted<T, TAsync>,
    IYieldedToReversed<T, TAsync>,
    IYieldedToArray<T, TAsync>,
    IYieldedFirst<T, TAsync>,
    IYieldedLast<T, TAsync>,
    IYieldedConsume<TAsync>,
    IYieldedForEach<T, TAsync> {}

export type IYieldedIterable<T, TAsync extends boolean> = TAsync extends true
  ?
      | AsyncIterable<T, void | undefined, void | undefined>
      | Iterable<T, void | undefined, void | undefined>
  : Iterable<T, void | undefined, void | undefined>;

export interface IAsyncYieldedResolver<T> extends ISharedYieldedResolver<
  T,
  true
> {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}

export interface IYieldedResolver<T> extends ISharedYieldedResolver<T, false> {
  [Symbol.iterator](): Generator<T>;
}
