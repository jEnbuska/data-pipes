import {
  type AsyncGeneratorMiddlewareReturn,
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

/**
 * skips the first `count` items produced by the generator and yields the rest to the next operation.
 * @example
 * source([1,2,3].skip(2).toArray() // [3]
 */
export function skip(count: number) {
  return function* skipGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    let skipped = 0;
    for (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
export function skipAsync(count: number) {
  return async function* skipAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    let skipped = 0;
    for await (const next of generator) {
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield next;
    }
  };
}
