import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function map<TInput, TOutput>(
  source: ProviderFunction<TInput>,
  mapper: (next: TInput) => TOutput,
): ProviderFunction<TOutput> {
  return function* mapGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      yield mapper(next);
    }
  };
}

export function mapAsync<TInput, TOutput>(
  source: AsyncProviderFunction<TInput>,
  mapper: (next: TInput) => TOutput,
): AsyncProviderFunction<Awaited<TOutput>> {
  return async function* mapAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      yield mapper(next);
    }
  };
}
