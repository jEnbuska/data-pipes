import type {
  IAsyncYielded,
  IParallelYielded,
  IYielded,
} from "./yielded.types.ts";

export type IYieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined | void,
  void
>;

export interface IYieldedParallelGenerator<
  TOut = unknown,
> extends AsyncDisposable {
  next(_?: undefined): Promise<IteratorResult<Promise<TOut>, void>>;
  return(value?: undefined): Promise<IteratorReturnResult<void | undefined>>;
  throw(e: any): Promise<IteratorReturnResult<void | undefined>>;
}

export type IYieldedIterator<TOut = unknown> = IteratorObject<
  TOut,
  undefined | void,
  void
>;

export type IYieldedGenerator<
  T,
  TFlow extends IYieldedFlow,
> = TFlow extends "async"
  ? IYieldedAsyncGenerator<T>
  : TFlow extends "parallel"
    ? IYieldedParallelGenerator<T>
    : IYieldedIterator<T>;

export type ICallbackReturn<
  T,
  TFlow extends IYieldedFlow,
> = TFlow extends "sync" ? T : Promise<T> | T;
export type INextYielded<T, TFlow extends IYieldedFlow> = TFlow extends "async"
  ? IAsyncYielded<T>
  : TFlow extends "parallel"
    ? IParallelYielded<T>
    : IYielded<T>;

export type MaybeAsync<T> = Promise<T> | T;

export type IYieldedFlow = "sync" | "async" | "parallel";
