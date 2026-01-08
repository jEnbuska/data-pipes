import { type ProviderFunction, type AsyncProviderFunction } from "../../types";
import { InternalStreamless } from "../../utils";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * streamless([1,2,3])count().first() // 3
 */
export function count<TInput>(
  source: ProviderFunction<TInput>,
): ProviderFunction<number> {
  return function* countGenerator() {
    using generator = InternalStreamless.disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
): AsyncProviderFunction<number> {
  return async function* countAsyncGenerator() {
    let count = 0;
    using generator = InternalStreamless.disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
