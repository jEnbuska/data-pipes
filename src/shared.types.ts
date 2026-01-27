import type { IAsyncYielded, IYielded } from "./yielded.types.ts";

export type IYieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined | void,
  void
>;

export type IYieldedParallelGenerator<TOut = unknown> = AsyncGenerator<
  Promise<TOut>,
  undefined | void,
  void
>;

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
