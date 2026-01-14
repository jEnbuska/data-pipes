import { _yielded } from "../../_internal.ts";
import {
  type YieldedAsyncProvider,
  type YieldedSyncProvider,
} from "../../types.ts";

export function foldSync<TInput, TOutput>(
  provider: YieldedSyncProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): YieldedSyncProvider<TOutput> {
  return function* foldSyncGenerator(signal) {
    let acc = initial();
    let index = 0;
    using generator = _yielded.getDisposableGenerator(provider, signal);
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
    using generator = _yielded.getDisposableAsyncGenerator(provider, signal);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
