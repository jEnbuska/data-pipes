import type {
  IMaybeAsync,
  IYieldedIterableSource,
} from "../../general/types.ts";

export type IYieldedParallelGenerator<TOut = unknown> = AsyncGenerator<
  TOut,
  undefined | void,
  void
>;

export type ParallelCallbackReturn<TOut> =
  | void
  | "STOP"
  | IYieldedIterableSource<TOut, "parallel">;

export type ParallelGeneratorState = "running" | "done" | "aborted";

export type ParallelGeneratorOnNext<T, TOut> = (
  value: T,
) => IMaybeAsync<ParallelCallbackReturn<TOut>>;

export type ParallelGeneratorOnDone<TOut> =
  () => IMaybeAsync<void | IYieldedIterableSource<TOut, "parallel">>;
