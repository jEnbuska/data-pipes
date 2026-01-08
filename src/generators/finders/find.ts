import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function find<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<TInput> {
  return function* findGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}

export function findAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncProviderFunction<TInput> {
  return async function* findAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
