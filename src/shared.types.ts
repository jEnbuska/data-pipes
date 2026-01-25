export type YieldedAsyncGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined,
  unknown
>;
export type YieldedIterator<TOut = unknown> = IteratorObject<
  TOut,
  undefined,
  unknown
>;

export type PromiseOrNot<T> = Promise<T> | T;
export type YieldedGenerator<T, TAsync extends boolean> = TAsync extends true
  ? YieldedAsyncGenerator<T>
  : YieldedIterator<T>;
