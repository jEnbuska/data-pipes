import {
  type StreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { InternalStreamless } from "../../utils";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * streamless([1,2,3])count().first() // 3
 */
export function count<TInput>(
  source: StreamlessProvider<TInput>,
): StreamlessProvider<number> {
  return function* countGenerator() {
    using generator = InternalStreamless.disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
): AsyncStreamlessProvider<number> {
  return async function* countAsyncGenerator() {
    let count = 0;
    using generator = InternalStreamless.disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
