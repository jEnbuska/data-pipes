import { type GeneratorProvider } from "../../types";

export function count<ImperativeInput = never>() {
  return function* countGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<number> {
    yield [...generator].length;
  };
}
