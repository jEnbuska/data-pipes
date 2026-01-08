import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

export function take<TInput>(
  source: ProviderFunction<TInput>,
  count: number,
): ProviderFunction<TInput> {
  return function* takeGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}

export function takeAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  count: number,
): AsyncProviderFunction<TInput> {
  return async function* takeAsyncGenerator() {
    if (count <= 0) {
      return;
    }
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      yield next;
      if (!--count) return;
    }
  };
}
