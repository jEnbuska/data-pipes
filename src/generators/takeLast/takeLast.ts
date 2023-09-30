import { type GeneratorProvider } from "../../types";

export function takeLast<ImperativeInput = never>(count: number) {
  return function* takeLastGenerator<Input = ImperativeInput>(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Input> {
    const array = [...generator];
    yield* array.slice(Math.max(array.length - count, 0));
  };
}
