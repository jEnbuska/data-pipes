import {
  type SyncStreamlessProvider,
  type AsyncStreamlessProvider,
} from "../../types";
import { _internalStreamless } from "../../utils";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * streamless([1,2,3])count().collect() // 3
 */
export function count<TInput>(
  source: SyncStreamlessProvider<TInput>,
): SyncStreamlessProvider<number> {
  return function* countGenerator() {
    using generator = _internalStreamless.disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncStreamlessProvider<TInput>,
): AsyncStreamlessProvider<number> {
  return async function* countAsyncGenerator() {
    let count = 0;
    using generator = _internalStreamless.disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
