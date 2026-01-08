import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function skipWhile<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<TInput> {
  return function* skipWhileGenerator() {
    let skip = true;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}

export function skipWhileAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncProviderFunction<TInput> {
  return async function* skipWhileAsyncGenerator() {
    let skip = true;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (skip && predicate(next)) continue;
      skip = false;
      yield next;
    }
  };
}
