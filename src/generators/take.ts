import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
  type AsyncGeneratorMiddlewareReturn,
} from "../types.ts";

/**
 * yields the first `count` items produced by the generator to the next and ignores the rest.
 * @example
 * pipe(
 *  [1,2,3],
 *  take(2)
 * ).toArray() // [1,2]
 */
export function take<ImperativeTInput = never>(count: number) {
  return function* takeGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    for (const next of generator) {
      if (count <= 0) {
        break;
      }
      count--;
      yield next;
    }
  };
}

export function takeAsync<ImperativeTInput = never>(count: number) {
  return async function* takeAsyncGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    for await (const next of generator) {
      if (count <= 0) {
        break;
      }
      count--;
      yield next;
    }
  };
}
