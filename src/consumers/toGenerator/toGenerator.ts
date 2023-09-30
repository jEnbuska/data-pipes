import { type GeneratorProvider } from "../../types";

export function toGenerator<ImperativeInput = never>() {
  return function toGeneratorConsumer<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): Generator<Input, void, void> {
    return generator;
  };
}
