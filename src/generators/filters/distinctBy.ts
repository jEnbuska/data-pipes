import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

/**
 * filters out items produced by the generator that produce the same value as the previous item when passed to the selector.
 *
 * @example
 * streamless([1,2,3,4].distinctBy(n => n % 2).toArray() // [1,2]
 */
export function distinctBy<TInput, Value>(
  source: ProviderFunction<TInput>,
  selector: (next: TInput) => Value,
): ProviderFunction<TInput> {
  return function* distinctByGenerator() {
    const set = new Set<Value>();
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      const key = selector(next);
      if (set.has(key)) {
        continue;
      }
      set.add(key);
      yield next;
    }
  };
}
export function distinctByAsync<TInput, Value>(
  source: AsyncProviderFunction<TInput>,
  selector: (next: TInput) => Value,
): AsyncProviderFunction<TInput> {
  return async function* distinctByAsyncGenerator() {
    const set = new Set<Value>();
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      const key = selector(next);
      if (set.has(key)) continue;
      set.add(key);
      yield next;
    }
  };
}
