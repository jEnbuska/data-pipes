import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

export function fold<TInput, TOutput>(
  source: SyncStreamlessProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): SyncStreamlessProvider<TOutput> {
  return function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = _internalStreamless.disposable(source);
    for (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}

export function foldAsync<TInput, TOutput>(
  source: AsyncStreamlessProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): AsyncStreamlessProvider<TOutput> {
  return async function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
