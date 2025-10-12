import {
  type AsyncGeneratorProvider,
  type GeneratorProvider,
} from "../types.ts";

export function resolve<TInput>() {
  return async function* resolveGenerator(
    generator: GeneratorProvider<TInput> | AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorProvider<TInput extends Promise<infer U> ? U : TInput> {
    for await (const next of generator) {
      yield next as any;
    }
  };
}
