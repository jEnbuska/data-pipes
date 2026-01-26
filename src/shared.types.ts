import type { IAsyncYielded, IYielded } from "./yielded.types.ts";

export type YieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined | void,
  void
>;
export type YieldedIterator<TOut = unknown> = IteratorObject<
  TOut,
  undefined | void,
  void
>;

export type PromiseOrNot<T> = Promise<T> | T;
export type YieldedGenerator<T, TAsync extends boolean> = TAsync extends true
  ? YieldedAsyncGenerator<T>
  : YieldedIterator<T>;

export type CallbackReturn<T, TAsync extends boolean> = TAsync extends true
  ? Promise<T> | T
  : T;
export type NextYielded<T, TAsync extends boolean> = TAsync extends true
  ? IAsyncYielded<T>
  : IYielded<T>;
