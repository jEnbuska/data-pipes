import {
  type YieldedSyncProvider,
  type YieldedAsyncProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function reduceSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): YieldedSyncProvider<TOutput> {
  return function* reduceSyncGenerator(signal) {
    let acc = initialValue;
    let index = 0;
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  provider: YieldedAsyncProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): YieldedAsyncProvider<Awaited<TOutput>> {
  return async function* reduceAsyncGenerator(signal) {
    let acc = initialValue;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}
