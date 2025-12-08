import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

export function every<TInput>(
  source: ProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): ProviderFunction<boolean> {
  return function* everyGenerator() {
    using generator = disposable(source);
    for (const next of generator) {
      if (!predicate(next)) return yield false;
    }

    yield true;
  };
}
export function everyAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  predicate: (next: TInput) => boolean,
): AsyncProviderFunction<boolean> {
  return async function* everyAsyncGenerator() {
    using generator = disposable(source);
    for await (const next of generator) {
      if (!predicate(next)) return yield false;
    }

    yield true;
  };
}
