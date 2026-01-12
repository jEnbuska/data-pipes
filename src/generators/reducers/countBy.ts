import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * streamless([{age: 5, age: 59}]).countBy((next) => next.age).first() // 64
 */
export function countBy<TInput>(
  source: StreamlessProvider<TInput>,
  mapper: (next: TInput) => number,
): StreamlessProvider<number> {
  return function* countByGenerator() {
    let acc = 0;
    using generator = InternalStreamless.disposable(source);
    for (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}

export function countByAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
  mapper: (next: TInput) => number,
): AsyncStreamlessProvider<number> {
  return async function* countByAsyncGenerator() {
    let acc = 0;
    using generator = InternalStreamless.disposable(source);
    for await (const next of generator) {
      acc += mapper(next);
    }
    yield acc;
  };
}
