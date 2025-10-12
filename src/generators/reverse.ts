import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

export function reverse<ImperativeTInput>() {
  return function* reverseGenerator<TInput>(
    generator: GeneratorProvider<TInput>,
  ): GeneratorProvider<TInput> {
    const acc: TInput[] = [];
    for (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}

export function reverseAsync() {
  return async function* reverseAsyncGenerator<TInput>(
    generator: AsyncGeneratorProvider<TInput>,
  ): AsyncGenerator<TInput, void, undefined & void> {
    const acc: TInput[] = [];
    for await (const next of generator) {
      acc.unshift(next);
    }
    yield* acc;
  };
}
