import {
  type SyncYieldedProvider,
  type AsyncYieldedProvider,
} from "../../types";
import { _internalYielded } from "../../utils";

export function foldSync<TInput, TOutput>(
  source: SyncYieldedProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): SyncYieldedProvider<TOutput> {
  return function* foldSyncGenerator() {
    let acc = initial();
    let index = 0;
    using generator = _internalYielded.disposable(source);
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
  return async function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = _internalYielded.disposable(source);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
