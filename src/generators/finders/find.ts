import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function find<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<TInput> {
  return function* findGenerator() {
    using generator = disposable(source);
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
    using generator = disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield next;
    }
  };
}
