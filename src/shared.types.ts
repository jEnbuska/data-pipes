import type { IAsyncYielded, IYielded } from "./yielded.types.ts";

export type IYieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined | void,
  void
>;

/* export type IYieldedParallelGenerator<TOut = unknown> = AsyncGenerator<
  Promise<TOut>,
  undefined | void,
  void
>; */

export interface IYieldedParallelGenerator<
  TOut = unknown,
> extends AsyncDisposable {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(_?: undefined): Promise<IteratorResult<Promise<TOut>, void | undefined>>;
  return(value?: undefined): Promise<IteratorReturnResult<void | undefined>>;
  throw(e: any): Promise<IteratorReturnResult<void | undefined>>;
  [Symbol.asyncIterator](): AsyncGenerator<
    TOut,
    void | undefined,
    void | undefined
  >;
}

export type IYieldedIterator<TOut = unknown> = IteratorObject<
  TOut,
  undefined | void,
  void
>;

export type IPromiseOrNot<T> = Promise<T> | T;
export type IYieldedGenerator<T, TAsync extends boolean> = TAsync extends true
  ? IYieldedAsyncGenerator<T>
  : IYieldedIterator<T>;

export type ICallbackReturn<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T> | T
  : T;
export type INextYielded<T, TAsync extends boolean> = TAsync extends true
  ? IAsyncYielded<T>
  : IYielded<T>;

export type MaybeAsync<T> = Promise<T> | T;
