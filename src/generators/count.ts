import {
  type AsyncGeneratorProvider,
  type AnyGeneratorProvider,
  type PipeSource,
  type AsyncPipeSource,
} from "../types.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * source([1,2,3])count().first() // 3
 */
export function count<TInput>(source: PipeSource<TInput>): PipeSource<number> {
  return function* countGenerator(signal): AnyGeneratorProvider<number> {
    yield [...source(signal)].length;
  };
}

export function countAsync<TInput>(
  source: AsyncPipeSource<TInput>,
): AsyncPipeSource<number> {
  return async function* countAsyncGenerator(
    signal,
  ): AsyncGeneratorProvider<number> {
    let count = 0;
    for await (const _ of source(signal)) {
      count++;
    }
    yield count;
  };
}
