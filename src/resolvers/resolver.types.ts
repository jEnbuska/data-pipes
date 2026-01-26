import type { IYieldedConsume } from "../consumers/consume.ts";
import type { IYieldedCount } from "../consumers/count.ts";
import type { IYieldedEvery } from "../consumers/every.ts";
import type { IYieldedFind } from "../consumers/find.ts";
import type { IYieldedFirst } from "../consumers/first.ts";
import type { IYieldedForEach } from "../consumers/forEach.ts";
import type { IYieldedGroupBy } from "../consumers/groupBy.ts";
import type { IYieldedLast } from "../consumers/last.ts";
import type { IYieldedMaxBy } from "../consumers/maxBy.ts";
import type { IYieldedMinBy } from "../consumers/minBy.ts";
import type { IYieldedReduce } from "../consumers/reduce.ts";
import type { IYieldedSome } from "../consumers/some.ts";
import type { IYieldedSumBy } from "../consumers/sumBy.ts";
import type { IYieldedToArray } from "../consumers/toArray.ts";
import type { IYieldedToReversed } from "../consumers/toReversed.ts";
import type { IYieldedToSorted } from "../consumers/toSorted.ts";

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

export interface IAsyncYieldedResolver<T> extends ISharedYieldedResolver<
  T,
  true
> {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}

export interface IYieldedResolver<T> extends ISharedYieldedResolver<T, false> {
  [Symbol.iterator](): Generator<T>;
}
