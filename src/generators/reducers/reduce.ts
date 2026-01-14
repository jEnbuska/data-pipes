import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import {
  getDisposableGenerator,
  getDisposableAsyncGenerator,
} from "../../index.ts";

export function reduceSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  reducer: (acc: TOutput, next: TInput, index: number) => TOutput,
  initialValue: TOutput,
): SyncYieldedProvider<TOutput> {
  return function* reduceSyncGenerator(signal) {
    let acc = initialValue;
    let index = 0;
    using generator = getDisposableGenerator(source, signal);
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
    using generator = getDisposableAsyncGenerator(source, signal);
    let index = 0;
    for await (const next of generator) {
      acc = reducer(acc, next, index++);
    }
    yield acc;
  };
}
