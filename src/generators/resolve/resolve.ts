import {
  type GeneratorProvider,
  type AsyncGeneratorProvider,
} from "../../types.ts";

export function resolve<TInput>() {
  return async function* resolveGenerator(
    generator: GeneratorProvider<TInput> | AsyncGeneratorProvider<TInput>,
  ): AsyncGeneratorProvider<Awaited<TInput>> {
    for await (const next of generator) {
      yield next;
    }
  };
}
