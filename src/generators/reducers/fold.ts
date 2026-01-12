import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

export function fold<TInput, TOutput>(
  source: StreamlessProvider<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): StreamlessProvider<TOutput> {
  return function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = InternalStreamless.disposable(source);
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
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
