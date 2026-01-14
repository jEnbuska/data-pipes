import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function reduceSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): SyncYieldedProvider<TOutput> {
  return function* reduceSyncGenerator(signal) {
    let acc = initialValue;
    let index = 0;
    using generator = _internalY.getDisposableGenerator(source, signal);
    for (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}

export function reduceAsync<TInput, TOutput>(
  source: AsyncYieldedProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* reduceAsyncGenerator(signal) {
    let acc = initialValue;
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}
