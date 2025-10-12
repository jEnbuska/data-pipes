import {
  type AsyncGeneratorMiddlewareReturn,
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

export function takeLast(count: number) {
  return function* takeLastGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    const array = [...generator];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}

export function takeLastAsync(count: number) {
  return async function* takeLastAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorMiddlewareReturn<TInput> {
    const acc: TInput[] = [];
    for await (const next of generator) {
      acc.push(next);
    }
    yield* acc.slice(Math.max(acc.length - count, 0));
  };
}
