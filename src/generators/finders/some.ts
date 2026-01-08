import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function some<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<boolean> {
  return function* someGenerator() {
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
export function someAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncProviderFunction<boolean> {
  return async function* someAsyncGenerator() {
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
