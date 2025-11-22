import { type PipeSource, type AsyncPipeSource } from "../../types.ts";
import { disposable } from "../../utils.ts";

export function fold<TInput, TOutput>(
  source: PipeSource<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): PipeSource<TOutput> {
  return function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = disposable(source);
    for (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}

export function foldAsync<TInput, TOutput>(
  source: AsyncPipeSource<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): AsyncPipeSource<TOutput> {
  return async function* foldGenerator() {
    let acc = initial();
    let index = 0;
    using generator = disposable(source);
    for await (const next of generator) {
      acc = fold(acc, next, index++);
    }
    yield acc;
  };
}
