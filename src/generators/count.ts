import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

/**
 * counts the number of items produced by the generator and then yields the total to the next operation.
 * @example
 * source([1,2,3])count().first() // 3
 */
export function count() {
  return function* countGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<number> {
    yield [...generator].length;
  };
}

export function countAsync() {
  return async function* countAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorProvider<number> {
    let count = 0;
    for await (const _ of generator) {
      count++;
    }
    yield count;
  };
}
