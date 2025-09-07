import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
  type AsyncGeneratorMiddlewareReturn,
} from "../types.ts";

/**
 * skips the last `count` items produced by the generator and yields the rest to the next operation.
 * @example
 * pipe(
 *  [1,2,3],
 *  skipLast(2)
 * ).toArray() // [1]
 */
export function skipLast<ImperativeTInput = never>(count: number) {
  return function* skipLastGenerator<TInput = ImperativeTInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    const buffer: TInput[] = [];
    let skipped = 0;
    for (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}

export function skipLastAsync<ImperativeTInput = never>(count: number) {
  return async function* skipLastAsyncGenerator<TInput = ImperativeTInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    const buffer: TInput[] = [];
    let skipped = 0;
    for await (const next of generator) {
      buffer.push(next);
      if (skipped < count) {
        skipped++;
        continue;
      }
      yield buffer.shift()!;
    }
  };
}
