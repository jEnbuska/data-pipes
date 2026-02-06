import type { IYieldedFlow, MaybeAsync } from "../shared.types.ts";
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

/** If sync then T otherwise Promise<T> */
export type ReturnValue<T, TFlow extends IYieldedFlow> = TFlow extends "sync"
  ? T
  : Promise<T>;

interface ISharedYieldedResolver<T, TFlow extends IYieldedFlow>
  extends
    IYieldedReduce<T, TFlow>,
    IYieldedFind<T, TFlow>,
    IYieldedMaxBy<T, TFlow>,
    IYieldedSome<T, TFlow>,
    IYieldedEvery<T, TFlow>,
    IYieldedMinBy<T, TFlow>,
    IYieldedGroupBy<T, TFlow>,
    IYieldedCount<TFlow>,
    IYieldedSumBy<T, TFlow>,
    IYieldedToSorted<T, TFlow>,
    IYieldedToReversed<T, TFlow>,
    IYieldedToArray<T, TFlow>,
    IYieldedFirst<T, TFlow>,
    IYieldedLast<T, TFlow>,
    IYieldedConsume<TFlow>,
    IYieldedForEach<T, TFlow> {}

export type IYieldedIterableSource<
  T,
  TFlow extends IYieldedFlow,
> = TFlow extends "sync"
  ?
      | Iterable<T, void | undefined, void | undefined>
      | Iterator<T, undefined | void, undefined | void>
  :
      | Iterable<MaybeAsync<T>, undefined | void, undefined | void>
      | Iterator<MaybeAsync<T>, undefined | void, undefined | void>
      | AsyncIterable<MaybeAsync<T>, void | undefined, void | undefined>
      | AsyncIterator<MaybeAsync<T>, void | undefined, void | undefined>;

export interface IAsyncYieldedResolver<T> extends ISharedYieldedResolver<
  T,
  "async"
> {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}

export interface IParallelYieldedResolver<T> extends ISharedYieldedResolver<
  T,
  "parallel"
> {
  [Symbol.asyncIterator](): AsyncGenerator<T>;
}

export interface IYieldedResolver<T> extends ISharedYieldedResolver<T, "sync"> {
  [Symbol.iterator](): Generator<T>;
}
