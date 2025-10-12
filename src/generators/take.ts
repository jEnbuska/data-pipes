import {
  type AsyncGeneratorMiddlewareReturn,
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

/**
 * yields the first `count` items produced by the generator to the next and ignores the rest.
 * @example
 * source([1,2,3]).take(2).toArray() // [1,2]
 */
export function take(count: number) {
  return function* takeGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    if (count <= 0) {
      return;
    }
    for (const next of generator) {
      yield next;
      if (!--count) {
        break;
      }
    }
  };
}

export function takeAsync(count: number) {
  return async function* takeAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    if (count <= 0) {
      return;
    }
    for await (const next of generator) {
      yield next;
      if (!--count) {
        break;
      }
    }
  };
}
