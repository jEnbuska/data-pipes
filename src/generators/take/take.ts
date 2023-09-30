import { type GeneratorProvider } from "../../types";

export function take<ImperativeInput = never>(count: number) {
  return function* takeGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    for (const next of generator) {
      if (count <= 0) {
        break;
      }
      count--;
      yield next;
    }
  };
}
