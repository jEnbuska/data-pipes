import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
  type AsyncGeneratorMiddlewareReturn,
} from "../../types";

/**
 * skips the first `count` items produced by the generator and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  skip(2)
 * ).toArray() // [3]
 */
export function skip<ImperativeTInput = never>(count: number) {
  return function* skipGenerator<TInput = ImperativeTInput>(
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
export function skipAsync<ImperativeTInput = never>(count: number) {
  return async function* skipAsyncGenerator<TInput = ImperativeTInput>(
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
