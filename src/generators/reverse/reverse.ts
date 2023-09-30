import { type GeneratorProvider } from "../../types";

export function reverse<ImperativeInput = never>() {
  return function* reverseGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    yield* [...generator].reverse();
  };
}
