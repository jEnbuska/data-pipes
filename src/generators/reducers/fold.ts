import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";
import { _internalY } from "../../utils.ts";

export function foldSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): YieldedSyncProvider<TOutput> {
  return function* foldSyncGenerator(signal) {
    let acc = initial();
    let index = 0;
    using generator = _internalY.getDisposableGenerator(provider, signal);
    for (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}

export function foldAsync<TInput, TOutput>(
  provider: YieldedAsyncProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): YieldedAsyncProvider<Awaited<TOutput>> {
  return async function* foldGenerator(signal) {
    let acc = initial();
    let index = 0;
    using generator = _internalY.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
