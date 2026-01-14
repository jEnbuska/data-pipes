import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalY } from "../../utils";

export function foldSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): SyncYieldedProvider<TOutput> {
  return function* foldSyncGenerator(signal) {
    let acc = initial();
    let index = 0;
    using generator = _internalY.getDisposableGenerator(source, signal);
    for (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}

export function foldAsync<TInput, TOutput>(
  source: AsyncYieldedProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): AsyncYieldedProvider<Awaited<TOutput>> {
  return async function* foldGenerator(signal) {
    let acc = initial();
    let index = 0;
    using generator = _internalY.getDisposableAsyncGenerator(source, signal);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
