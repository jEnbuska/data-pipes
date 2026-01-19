import { _yielded } from "../_internal.ts";
import { consumeSync } from "../consumers/consume.ts";
import { firstSync } from "../consumers/first.ts";
import { toArraySync, toArraySyncFromReturn } from "../consumers/toArray.ts";
import { withProvider } from "../consumers/yieldedProviderResolver.ts";
import { distinctBySync } from "../generators/filters/distinctBy.ts";
import { distinctUntilChangedSync } from "../generators/filters/distinctUntilChanged.ts";
import { filterSync } from "../generators/filters/filter.ts";
import { skipSync } from "../generators/filters/skip.ts";
import { skipLastSync } from "../generators/filters/skipLast.ts";
import { skipWhileSync } from "../generators/filters/skipWhile.ts";
import { takeSync } from "../generators/filters/take.ts";
import { takeLastSync } from "../generators/filters/takeLast.ts";
import { takeWhileSync } from "../generators/filters/takeWhile.ts";
import { everySync } from "../generators/finders/every.ts";
import { findSync } from "../generators/finders/find.ts";
import { someSync } from "../generators/finders/some.ts";
import { batchSync } from "../generators/grouppers/batch.ts";
import { chunkBySync } from "../generators/grouppers/chunkBy.ts";
import { liftSync } from "../generators/misc/lift.ts";
import { mapSync } from "../generators/misc/map.ts";
import { tapSync } from "../generators/misc/tap.ts";
import { toAwaited, toAwaitedParallel } from "../generators/misc/toAwaited.ts";
import { countSync } from "../generators/reducers/count.ts";
import { countBySync } from "../generators/reducers/countBy.ts";
import { foldSync } from "../generators/reducers/fold.ts";
import {
  createInitialGroups,
  groupBySync,
} from "../generators/reducers/groupBy.ts";
import { maxSync } from "../generators/reducers/max.ts";
import { minSync } from "../generators/reducers/min.ts";
import { reduceSync } from "../generators/reducers/reduce.ts";
import { toReverseSync } from "../generators/sorters/toReverse.ts";
import { toSortedSync } from "../generators/sorters/toSorted.ts";
import { flatSync } from "../generators/spreaders/flat.ts";
import { flatMapSync } from "../generators/spreaders/flatMap.ts";
import type {
  GeneratorOperator,
  SyncProvider,
  YieldedLiftMiddleware,
} from "../types.ts";
import { asyncIterableAYielded } from "./asyncIterableAYielded.ts";
import { syncSingleYielded } from "./syncSingleYielded.ts";
import { YieldedBase } from "./YieldedBase.ts";

export class MultiYielded<TOut, TOptional extends boolean> extends YieldedBase<
  TOut,
  TOptional,
  false,
  true
> {
  constructor(provider: SyncProvider<TOut>, isOptional: TOptional) {
    super(provider, { isOptional, isMulti: true, isAsync: false });
    this.resolve = this.resolve.bind(this);
    this.consume = this.consume.bind(this);
  }

  private create<TNext, TNextOptional extends boolean>(
    next: GeneratorOperator<TOut, TNext>,
    optional: TNextOptional,
  ): MultiYielded<TNext, TNextOptional>;
  private create<TNext>(
    next: GeneratorOperator<TOut, TNext>,
  ): MultiYielded<TNext, TOptional>;
  private create(
    next: GeneratorOperator<any, any>,
    optional = this.#optional,
  ): MultiYielded<any, boolean> {
    return new MultiYielded<any, boolean>(
      withProvider(this.#provider, next),
      optional,
    );
  }

  filter<TNext extends TOut>(
    predicate: (next: TOut) => next is TNext,
  ): MultiYielded<TNext, true>;
  filter(
    predicate: (next: TOut) => boolean | Promise<boolean>,
  ): MultiYielded<TOut, true>;
  filter(predicate: (next: any) => any) {
    return this.create(filterSync(predicate), true);
  }

  flat<Depth extends number = 1>(depth?: Depth) {
    return this.create(flatSync(depth), true);
  }

  flatMap<TNext>(callback: (value: TOut) => TNext | TNext[]) {
    return this.create(flatMapSync(callback), true);
  }

  lift<TNext = never>(middleware: YieldedLiftMiddleware<false, TOut, TNext>) {
    return this.create(liftSync(middleware), true);
  }

  map<TNext>(mapper: (next: TOut) => Promise<TNext> | TNext) {
    return this.create(mapSync(mapper));
  }

  resolve(): Promise<TOut>;
  resolve(signal: AbortSignal): Promise<TOut | undefined>;
  resolve(signal?: AbortSignal) {
    return firstSync(this.#provider, signal);
  }

  tap(callback: (next: TOut) => unknown) {
    return this.create(tapSync(callback));
  }

  batch(predicate) {
    return syncIterableYielded(batchSync(provider, predicate));
  }

  chunkBy(fn) {
    return syncIterableYielded(chunkBySync(provider, fn));
  }

  consume(signal?: AbortSignal) {
    return consumeSync(provider, signal);
  }

  count() {
    return syncSingleYielded(countSync(provider), _yielded.getZero);
  }

  countBy(fn) {
    return syncSingleYielded(countBySync(provider, fn), _yielded.getZero);
  }

  distinctBy(selector) {
    return syncIterableYielded(distinctBySync(provider, selector));
  }

  distinctUntilChanged(isEqual) {
    return syncIterableYielded(distinctUntilChangedSync(provider, isEqual));
  }

  every(predicate) {
    return syncSingleYielded(everySync(provider, predicate), _yielded.getTrue);
  }

  filter<TNext extends TData>(predicate: (next: TData) => next is TNext) {
    return syncIterableYielded(filterSync(provider, predicate));
  }

  find(predicate: (next: TData) => boolean) {
    return syncSingleYielded(
      findSync(provider, predicate),
      _yielded.getUndefined,
    );
  }

  flat(depth) {
    return syncIterableYielded(flatSync(provider, depth));
  }

  flatMap(callback) {
    return syncIterableYielded(flatMapSync(provider, callback));
  }

  fold(initial, reducer) {
    const initialOnce = _yielded.once(initial);
    return syncSingleYielded(
      foldSync(provider, initialOnce, reducer),
      initialOnce,
    );
  }

  groupBy(keySelector: (next: any) => PropertyKey, groups: PropertyKey[] = []) {
    return syncSingleYielded(groupBySync(provider, keySelector, groups), () =>
      Object.fromEntries(createInitialGroups(groups ?? [])),
    );
  }

  lift(middleware) {
    return syncIterableYielded(liftSync(provider, middleware));
  }

  map(mapper) {
    return syncIterableYielded(mapSync(provider, mapper));
  }

  max(callback) {
    return syncSingleYielded(
      maxSync(provider, callback),
      _yielded.getUndefined,
    );
  }

  min(callback) {
    return syncSingleYielded(
      minSync(provider, callback),
      _yielded.getUndefined,
    );
  }

  reduce(reducer, initialValue) {
    return syncSingleYielded(
      reduceSync(provider, reducer, initialValue),
      () => initialValue,
    );
  }

  resolve(signal?: AbortSignal) {
    return toArraySync(provider, signal);
  }

  skip(count) {
    return syncIterableYielded(skipSync(provider, count));
  }

  skipLast(count) {
    return syncIterableYielded(skipLastSync(provider, count));
  }

  skipWhile(predicate) {
    return syncIterableYielded(skipWhileSync(provider, predicate));
  }

  some(predicate) {
    return syncSingleYielded(someSync(provider, predicate), () => false);
  }

  take(count) {
    return syncIterableYielded(takeSync(provider, count));
  }

  takeLast(count) {
    const takeLastProvider = takeLastSync(provider, count);
    return syncIterableYielded(takeLastProvider, {
      resolve(signal?: AbortSignal) {
        return toArraySyncFromReturn(takeLastProvider, signal);
      },
    });
  }

  takeWhile(predicate) {
    return syncIterableYielded(takeWhileSync(provider, predicate));
  }

  tap(callback) {
    return syncIterableYielded(tapSync(provider, callback));
  }

  toAwaited() {
    return asyncIterableAYielded(toAwaited(provider));
  }

  toAwaitedParallel(count: number) {
    return asyncIterableAYielded(toAwaitedParallel(provider, count));
  }

  toReverse() {
    const reverseProvider = toReverseSync(provider);
    return syncIterableYielded(reverseProvider, {
      resolve(signal?: AbortSignal) {
        return toArraySyncFromReturn(reverseProvider, signal);
      },
    });
  }

  toSorted(compareFn) {
    const sortProvider = toSortedSync(provider, compareFn);
    return syncIterableYielded(sortProvider, {
      resolve(signal?: AbortSignal) {
        return toArraySyncFromReturn(sortProvider, signal);
      },
    });
  }
}
