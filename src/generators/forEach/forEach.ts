import { type GeneratorMiddleware } from "../../types";

export function forEach<Input>(
  consumer: (next: Input) => unknown,
): GeneratorMiddleware<Input> {
  return function* forEachGenerator(generator) {
    for (const next of generator) {
      consumer(next);
      yield next;
    }
  };
}
