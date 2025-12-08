import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function some<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<boolean> {
  return function* someGenerator() {
    using generator = disposable(source);
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
    using generator = disposable(source);
    for await (const next of generator) {
      if (predicate(next)) return yield true;
    }
    yield false;
  };
}
