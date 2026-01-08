import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

/**
 * yields the default value if the generator does not produce any items
 * @example
 * streamless([1,2,3].filter(it => it > 3).defaultTo(0).first() // 0
 */
export function defaultTo<TInput, TDefault>(
  source: ProviderFunction<TInput>,
  getDefault: () => TDefault,
): ProviderFunction<TInput | TDefault> {
  return function* defaultToGenerator() {
    let empty = true;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}

export function defaultToAsync<TInput, TDefault>(
  source: AsyncProviderFunction<TInput>,
  getDefault: () => TDefault,
): AsyncProviderFunction<TInput | TDefault> {
  return async function* defaultToAsyncGenerator() {
    let empty = true;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      yield next;
      empty = false;
    }
    if (empty) {
      yield getDefault();
    }
  };
}
