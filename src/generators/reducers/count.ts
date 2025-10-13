import {
  type AsyncProvider,
  type PipeSource,
  type AsyncPipeSource,
} from "../../types.ts";
import { disposable } from "../../utils.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * source([1,2,3])count().first() // 3
 */
export function count<TInput>(source: PipeSource<TInput>): PipeSource<number> {
  return function* countGenerator() {
    using generator = disposable(source);
    yield [...generator].length;
  };
}

export function countAsync<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncPipeSource<number> {
  return async function* countAsyncGenerator(): AsyncProvider<number> {
    let count = 0;
    using generator = disposable(source);
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
