import { type GeneratorMiddleware } from "../../types";

export function reduce<Input, Output>(
  reducer: (acc: Output, next: Input) => Output,
  initialValue: Output,
): GeneratorMiddleware<Input, Output> {
  return function* reduceGenerator(generator) {
    let acc = initialValue;
    for (const next of generator) {
      acc = reducer(acc, next);
    }
    yield acc;
  };
}
