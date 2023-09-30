import { type GeneratorMiddleware } from "../../types";

export function map<Input, Output>(
  mapper: (next: Input) => Output,
): GeneratorMiddleware<Input, Output> {
  return function* mapGenerator(generator) {
    for (const next of generator) {
      yield mapper(next);
    }
  };
}
