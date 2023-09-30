import { type GeneratorProvider } from "../../types";

export function toArray<ImperativeInput = never>() {
  return function toArrayConsumer<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): Input[] {
    return [...generator];
  };
}
