import {
  type AsyncGeneratorMiddlewareReturn,
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

export function skipLast(count: number) {
  return function* skipLastGenerator<TInput>(
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

export function skipLastAsync(count: number) {
  return async function* skipLastAsyncGenerator<TInput>(
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
