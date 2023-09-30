import { type GeneratorProvider } from "../../types";
export function map<Input, Output>(mapper: (next: Input) => Output) {
  return function* mapGenerator(
    generator: GeneratorProvider<Input>,
  ): GeneratorProvider<Output> {
    for (const next of generator) {
      yield mapper(next);
    }
  };
}
