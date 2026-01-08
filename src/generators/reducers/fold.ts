import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function fold<TInput, TOutput>(
  source: ProviderFunction<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): ProviderFunction<TOutput> {
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
  source: AsyncProviderFunction<TInput>,
  initial: () => TOutput,
  fold: (acc: TOutput, next: TInput, index: number) => TOutput,
): AsyncProviderFunction<TOutput> {
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
