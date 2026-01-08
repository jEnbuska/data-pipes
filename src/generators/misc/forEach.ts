import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function forEach<TInput>(
  source: ProviderFunction<TInput>,
  consumer: (next: TInput) => unknown,
): ProviderFunction<TInput> {
  return function* forEachGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}

export function forEachAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  consumer: (next: TInput) => unknown,
): AsyncProviderFunction<TInput> {
  return async function* forEachAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
