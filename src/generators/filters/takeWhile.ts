import { type AsyncProviderFunction, type ProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function takeWhile<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<TInput> {
  return function* takeWhileAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
export function takeWhileAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncProviderFunction<TInput> {
  return async function* takeWhileAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return;
      yield next;
    }
  };
}
