import { type GeneratorProvider } from "../../types";

export function unflat<ImperativeInput = never>() {
  return function* unflatGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input[]> {
    yield [...generator];
  };
}
