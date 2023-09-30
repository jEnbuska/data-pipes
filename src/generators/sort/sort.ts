import { type GeneratorMiddleware } from "../../types";

export function sort<Input = never>(
  comparator?: (a: Input, b: Input) => number,
): GeneratorMiddleware<Input> {
  return function* sortGenerator(generator) {
    yield* [...generator].sort(comparator);
  };
}
