import {
  type ProviderFunction,
  type AsyncProviderFunction,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * source([{age: 5, age: 59}]).countBy((next) => next.age).first() // 64
 */
export function countBy<TInput>(
  source: ProviderFunction<TInput>,
  mapper: (next: TInput) => number,
): ProviderFunction<number> {
  return function* countByGenerator() {
    let acc = 0;
    using generator = disposable(source);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncProviderFunction<TInput>,
  mapper: (next: TInput) => number,
): AsyncProviderFunction<number> {
  return async function* countByAsyncGenerator() {
    let acc = 0;
    using generator = disposable(source);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
